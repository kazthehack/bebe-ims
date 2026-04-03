//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'api/operationCompat'
import { withRouter } from 'react-router-dom'
import { compose, branch } from 'recompose'
import { withVenueID, withVenueSettings } from 'components/Venue'
import { renderWhileLoading } from 'utils/hoc'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { getTaxList, addTax, updateTax } from 'ops/tax'
import Spinner from 'components/common/display/Spinner'
import { withCancelConfirmation, withConfirm } from 'components/Modal'
import { withNotifications, getNotification } from 'components/Notifications'
import { forIn, find, get } from 'lodash'
import { withSalesTypes, defaultGroupings } from 'components/SalesTypes'
import { withQueryErrorPageOnError, PageNotFound } from 'components/pages/ErrorPage'
import TaxForm from './TaxForm'
import withTax from '../withTax'
import withTaxList from '../withTaxList'
import withDeleteTax from '../withDeleteTax'

const addTaxSuccessToast = name => getNotification('success', 'Tax created', name)
const updateTaxSuccessToast = name => getNotification('success', 'Tax saved', name)
const addTaxErrorToast = (message = 'Error creating tax') => getNotification('error', 'Error', message)
const updateTaxErrorToast = (message = 'Error saving tax') => getNotification('error', 'Error', message)

export const EditTax = ({ match }) => <EditTaxHOC taxId={match.params.id} />
export const NewLineItemTax = () => <NewTaxHOC lineItem />
export const NewSubtotalTax = () => <NewTaxHOC lineItem={false} />

EditTax.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}

const newTaxProps = ({ ownProps, mutate }) => {
  const ADD_TAX_MSG = (
    <div>
      <p>Adding a new tax will alter pricing on applicable active products you have!</p>
      <p>Are you sure you want to proceed?</p>
    </div>
  )
  const { history, lineItem, selectedVenueId } = ownProps
  return {
    onSubmit: ({ name, customerType, amountType, amount, salesTypes, active }) => {
      const newSalesTypes = []
      if (lineItem) {
        forIn(salesTypes, (grouping) => {
          forIn(grouping, (value, key) => {
            if (value) newSalesTypes.push(key)
          })
        })
      }
      const input = {
        storeId: selectedVenueId,
        tax: {
          name,
          customerType,
          appliesTo: lineItem ? 'ITEM' : 'SUBTOTAL',
          amountType,
          amount,
          startDate: (new Date()).toISOString(),
          active,
          salesTypes: newSalesTypes,
        },
      }
      const mutateNewTax = () => {
        mutate({
          variables: { input },
          refetchQueries: [{ // TODO: switch this to insert the record rather than refetch.
            query: getTaxList,
            variables: {
              storeID: selectedVenueId,
            },
          }],
        }).then(() => {
          history.push('/settings/taxes') // Redirects to taxes list page
          ownProps.addNotification(addTaxSuccessToast(name))
        }, (error) => { // Called if there's an error.
          ownProps.addNotification(addTaxErrorToast(error.message))
        })
      }
      if (active) {
        ownProps.confirm({
          title: 'Warning',
          message: ADD_TAX_MSG,
        }).then((confirmed) => {
          if (confirmed) {
            mutateNewTax()
          }
        })
      } else {
        mutateNewTax()
      }
    },
  }
}

const updateTaxProps = ({ ownProps, mutate }) => {
  const { history, taxId, taxData: { tax } } = ownProps
  const isLineItem = get(tax, 'appliesTo') === 'ITEM'
  let EDIT_TAX_MSG = isLineItem ? (
    <div>
      <p>Editing this tax will alter pricing on applicable active products you have!</p>
      <p>Are you sure you want to proceed?</p>
    </div>
  )
    : (
      <div>
        <p>Editing this tax will immediately affect pricing.</p>
        <p>Are you sure you want to proceed?</p>
      </div>
    )
  return {
    onSubmit: ({ name, customerType, amountType, amount, salesTypes, active }) => {
      const newSalesTypes = []
      if (get(tax, 'appliesTo') === 'ITEM') {
        forIn(salesTypes, (grouping) => {
          forIn(grouping, (value, key) => {
            if (value) newSalesTypes.push(key)
          })
        })
      }
      const input = {
        taxId,
        tax: {
          name,
          customerType,
          amountType,
          amount,
          active,
          salesTypes: newSalesTypes,
        },
      }
      if ((!tax.active && active) || (tax.active && !active)) {
        if (!tax.active && active) {
          EDIT_TAX_MSG = isLineItem ? (
            <div>
              <p>Activating this tax will alter pricing on applicable active products you have!</p>
              <p>Are you sure you want to proceed?</p>
            </div>
          )
            : (
              <div>
                <p>Adding a new tax will immediately affect pricing.</p>
                <p>Are you sure you want to proceed?</p>
              </div>
            )
        }
        if (tax.active && !active) {
          EDIT_TAX_MSG = isLineItem ? (
            <div>
              <p>Deactivating a tax will alter pricing on applicable active products you have and
                 result in your budtenders not collecting this tax during sales.
              </p>
              <p>Are you sure you want to proceed?</p>
            </div>
          )
            : (
              <div>
                <p>Deactivating this tax will immediately alter pricing. You will no longer be
                   collecting this tax during sales.
                </p>
                <p>Are you sure you want to proceed?</p>
              </div>
            )
        }
      }
      ownProps.confirm({
        title: 'Warning',
        message: EDIT_TAX_MSG,
      }).then((confirmed) => {
        if (confirmed) {
          mutate({
            variables: { input },
          }).then(() => {
            history.push('/settings/taxes') // Redirects to taxes list page
            ownProps.addNotification(updateTaxSuccessToast(name))
          }, (error) => { // Called if there's an error.
            ownProps.addNotification(updateTaxErrorToast(error.message))
          })
        }
      })
    },
    lineItem: get(tax, 'appliesTo') === 'ITEM',
  }
}

const NewTaxHOC = compose(
  withVenueID,
  withRouter,
  withVenueSettings({ name: 'venueSettings' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withTaxList({ name: 'taxListData' }),
  withCancelConfirmation('/settings/taxes', { title: 'Discard record', message: 'Discard this new tax record?' }),
  withConfirm({ message: 'This is a test message' }),
  withNotifications,
  withSalesTypes(defaultGroupings), // salesTypeData
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '512px' }} />,
    ['salesTypeData', 'taxListData'],
  ),
  withQueryErrorPageOnError(['salesTypeData', 'taxListData'], true),
  graphql(addTax, {
    props: newTaxProps,
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(TaxForm)

const EditTaxHOC = compose(
  withVenueID,
  withRouter,
  withVenueSettings({ name: 'venueSettings' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withTax(),
  withTaxList({ name: 'taxListData' }),
  withConfirm(),
  withCancelConfirmation('/settings/taxes', { title: 'Discard changes', message: 'Discard changes made to this tax record?' }),
  withNotifications,
  withDeleteTax(),
  withSalesTypes(defaultGroupings), // salesTypeData
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '512px' }} />,
    ['salesTypeData', 'taxData', 'taxListData'],
  ),
  branch(
    ({ taxList, taxId }) => !find(taxList, tax => get(tax, 'id') === taxId),
    () => PageNotFound(true),
  ),
  withQueryErrorPageOnError(['salesTypeData', 'taxListData', 'taxData'], true),
  graphql(updateTax, {
    props: updateTaxProps,
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(TaxForm)
