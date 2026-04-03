// Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import moment from 'moment-timezone'
import { graphql } from 'api/operationCompat'
import { compose, withProps } from 'recompose'
import { getPriceGroup, updatePriceGroup, addPriceGroup, getPriceGroups, getPriceGroupsWithAssociatedProducts, archivePriceGroup } from 'ops'
import { withVenueSettings } from 'components/Venue'
import { withCancelConfirmation, withAlert, withConfirm } from 'components/Modal'
import withTaxList from 'components/pages/settings/taxes/withTaxList'
import { withSalesTypes, defaultGroupings } from 'components/SalesTypes'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { withNotifications, getNotification } from 'components/Notifications'
import findTaxes from 'utils/aggregateTaxesForPriceTables'
import { findIndex, set, get } from 'lodash'
import { initializePriceRows, zipPriceRows } from 'utils/priceGroup'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withProductList } from 'components/pages/inventory/products/withProductList'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import PriceGroupForm from './PriceGroupForm'
import withPriceGroupProducts from '../withPriceGroupProducts'

const addPriceGroupSuccessToast = name => getNotification('success', 'Price group created', name)
const updatePriceGroupSuccessToast = name => getNotification('success', 'Price group saved', name)
const archivePriceGroupSuccessToast = name => getNotification('success', 'Price group deleted', name)
const addPriceGroupErrorToast = (message = 'Error creating price group') => getNotification('error', 'Error', message)
const updatePriceGroupErrorToast = (message = 'Error saving price group') => getNotification('error', 'Error', message)
const archivePriceGroupErrorToast = (message = 'Error deleting price group') => getNotification('error', 'Error', message)


const withPriceGroup = C =>
  graphql(getPriceGroup, {
    name: 'priceGroupData',
    options: ({ match: { params: { id } } }) => ({
      variables: {
        priceGroupID: id,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
  })(C)

const withAddPriceGroup = C =>
  graphql(addPriceGroup, {
    props: ({ mutate, ownProps: {
      selectedVenueId,
      history,
      addNotification,
      venueSettings: { store: { settings: { pricingScheme } } },
    } }) => ({
      onSubmit: ({ active, name, customPG, salesTypeId, portalMedicalSame }) => {
        const preScheme = pricingScheme === 'PRE_TAX'
        const zippedPrices = zipPriceRows(preScheme, customPG)
        const input = {
          input: {
            storeId: selectedVenueId,
            priceGroup: {
              salesTypeId,
              name,
              active,
              portalMedicalSame,
              prices: zippedPrices,
            },
          },
        }
        return mutate({
          variables: input,
          refetchQueries: [{ // TODO: manually update the query instead of refetching
            query: getPriceGroups,
            variables: {
              storeID: selectedVenueId,
            },
          }, {
            query: getPriceGroupsWithAssociatedProducts,
            variables: {
              storeID: selectedVenueId,
            },
          }],
        }).then(() => {
          history.push('/inventory/price-groups') // Redirects to price groups list page
          addNotification(addPriceGroupSuccessToast(name))
        }, (error) => {
          addNotification(addPriceGroupErrorToast(error.message))
        })
      },
    }),
  })(C)

const withUpdatePriceGroup = C =>
  graphql(updatePriceGroup, {
    props: ({ mutate, ownProps: {
      history,
      addNotification,
      venueSettings: { store: { settings: { pricingScheme } } },
    } }) => ({
      onSubmit: ({ active, id, name, customPG, portalMedicalSame }) => {
        const preScheme = pricingScheme === 'PRE_TAX'
        const zippedPrices = zipPriceRows(preScheme, customPG)
        const input = {
          input: {
            priceGroupId: id,
            priceGroup: {
              name,
              active,
              portalMedicalSame,
              prices: zippedPrices,
            },
          },
        }
        return mutate({ variables: input }).then(() => {
          history.push('/inventory/price-groups') // Redirects to price groups list page
          addNotification(updatePriceGroupSuccessToast(name))
        }, (error) => {
          addNotification(updatePriceGroupErrorToast(error.message))
        })
      },
    }),
  })(C)

const ATTEMPT_DELETE_ACTIVE_TITLE = 'Price Group is still active'
const ATTEMPT_DELETE_ACTIVE_MESSAGE = 'Active price groups cannot be deleted.\n\nPlease deactivate the price group, save, and try again.\n\nNote that a price group can only be deactivated if it is not used by any active or inactive products.'
const CONFIRM_DELETE_MESSAGE = 'Are you sure you want to delete this price group?'

const withArchivePriceGroup = C => compose(
  graphql(archivePriceGroup, {
    props: ({ mutate, ownProps: {
      selectedVenueId,
      history,
      addNotification,
      alert,
      confirm,
    } }) => ({
      onDelete: ({ active, id, name }) => {
        const input = {
          input: {
            priceGroupId: id,
            when: moment.tz(new Date(), 'UTC').format(),
          },
        }

        if (active) {
          return alert({
            title: ATTEMPT_DELETE_ACTIVE_TITLE,
            message: ATTEMPT_DELETE_ACTIVE_MESSAGE,
            primaryText: 'OK',
            contentStyle: {
              content: {
                textAlign: 'center',
                margin: 40,
                whiteSpace: 'pre-wrap',
                lineHeight: '0.9',
                overflow: 'hidden',
              },
            },
          })
        }

        return (
          confirm({
            title: 'Are you sure?',
            message: CONFIRM_DELETE_MESSAGE,
            contentStyle: {
              content: {
                textAlign: 'center',
                margin: 40,
              },
            },
          }).then((confirmed) => {
            if (!confirmed) return undefined
            return mutate({
              variables: input,
              update: (cache) => {
                const variables = { storeID: selectedVenueId }
                const data = cache.readQuery({
                  query: getPriceGroupsWithAssociatedProducts,
                  variables,
                })
                const prevPGList = get(data, 'store.priceGroups.edges') || []
                prevPGList.splice(findIndex(prevPGList, elt => get(elt, 'node.id') === id), 1)
                const nextPGList = prevPGList
                set(data, 'store.priceGroups.edges', nextPGList)
                return cache.writeQuery({
                  query: getPriceGroupsWithAssociatedProducts,
                  variables,
                  data,
                })
              },
            }).then(() => {
              history.push('/inventory/price-groups')
              addNotification(archivePriceGroupSuccessToast(name))
            }, (error) => {
              addNotification(archivePriceGroupErrorToast(error.message))
            })
          })
        )
      },
    }),
  }),
)(C)

const initialValuesMap = (
  { prices = [], salesType, portalMedicalSame = true, ...rest },
  tax,
  typeOptions,
  preScheme,
) => {
  const newPrices = initializePriceRows({ prices }, tax, preScheme).prices
  return ({
    active: true,
    name: '',
    portalMedicalSame,
    tax, // storing for reference
    liquid: salesType ? salesType.liquid : get(typeOptions[0], 'liquid'), // storing for reference
    salesTypeId: get(salesType, 'id', get(typeOptions[0], 'id')),
    customPG: {
      prices: (newPrices.rec.length !== 0) ? newPrices : {
        rec: [
          { portalActive: true, quantityAmount: 1 },
          { portalActive: false, quantityAmount: 2 },
          { portalActive: false, quantityAmount: 3.5 },
          { portalActive: false, quantityAmount: 7 },
          { portalActive: false, quantityAmount: 14 },
          { portalActive: false, quantityAmount: 28 },
        ],
        med: [
          { portalActive: true, quantityAmount: 1 },
          { portalActive: false, quantityAmount: 2 },
          { portalActive: false, quantityAmount: 3.5 },
          { portalActive: false, quantityAmount: 7 },
          { portalActive: false, quantityAmount: 14 },
          { portalActive: false, quantityAmount: 28 },
        ],
      },
    },
    ...rest,
  })
}

const withPriceGroupFormProps = withProps(({
  venueSettings: { store: { settings: { pricingScheme } } },
  priceGroupData,
  taxListData,
  salesTypeData: { salesTypes },
}) => {
  const pre = pricingScheme === 'PRE_TAX'
  const priceGroup = get(priceGroupData, 'node', {})
  // grouping can be flower or hemp, but we can check that from the selected type later.
  const flower = true // (groupingValue === 'flower' || groupingValue === 'hemp')
  const typeOptions = []
  typeOptions.push(...get(salesTypes.find(el => (el.id === 'flower')), 'salesTypes', []))
  typeOptions.push(...get(salesTypes.find(el => (el.id === 'usableHemp')), 'salesTypes', []))
  const tax = findTaxes(
    get(taxListData, 'store.taxes.edges', []),
    get(priceGroup, 'salesType') || typeOptions[0],
  )
  const taxList = taxListData.store.taxes.edges
  const initialValues = initialValuesMap(priceGroup, tax, typeOptions, pre)
  return ({
    pre,
    initialValues,
    typeOptions,
    tax,
    taxList,
    flower,
  })
})

export const NewPriceGroupForm = compose(
  withNotifications,
  withVenueSettings(), // venueSettings
  withTaxList(), // taxListData
  withSalesTypes(defaultGroupings), // salesTypeData
  withAddPriceGroup,
  withCancelConfirmation('/inventory/price-groups', { title: 'Discard record', message: 'Discard this new price group record?' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '100px' }} />,
    ['venueSettings', 'salesTypeData', 'authenticatedUserData', 'taxListData'],
    'selectedVenueId',
  ),
  withQueryErrorPageOnError(['venueSettings', 'salesTypeData', 'authenticatedUserData', 'taxListData'], true),
  withPriceGroupFormProps,
)(PriceGroupForm)

export const EditPriceGroupForm = compose(
  withAlert(),
  withConfirm(),
  withNotifications,
  withVenueSettings(), // venueSettings
  withPriceGroup, // priceGroupData
  withTaxList(), // taxListData
  withSalesTypes(defaultGroupings), // salesTypeData
  withPriceGroupProducts,
  withUpdatePriceGroup,
  withArchivePriceGroup,
  withCancelConfirmation('/inventory/price-groups', { title: 'Discard changes', message: 'Discard changes made to this price group record?' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '100px' }} />,
    ['venueSettings', 'priceGroupData', 'salesTypeData', 'authenticatedUserData', 'taxListData'],
    'selectedVenueId', 'priceGroupProductsData',
  ),
  withQueryErrorPageOnError(['venueSettings', 'priceGroupData', 'salesTypeData', 'authenticatedUserData', 'taxListData', 'priceGroupProductsData'], true),
  withProductList(),
  withPriceGroupFormProps,
)(({ ...props }) => <PriceGroupForm edit {...props} />)
