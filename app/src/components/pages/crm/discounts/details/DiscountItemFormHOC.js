//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { graphql } from 'api/operationCompat'
import { compose, withProps, branch } from 'recompose'
import { createSelector } from 'reselect'
import { renderWhileLoading } from 'utils/hoc'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { filter, forIn, isEmpty } from 'lodash'
import { weekLookup, DAYS } from 'utils/dayToWeekMatcher'
import { withRouter } from 'react-router-dom'
import { withVenueID } from 'components/Venue'
import amountTypeCategoryMap from 'utils/amountTypeCategoryMapper'
import { addDiscount, updateDiscount, getDiscount, fetchDiscounts } from 'ops'
import Spinner from 'components/common/display/Spinner'
import { withNotifications, getNotification } from 'components/Notifications'
import { withConfirm, withCancelConfirmation } from 'components/Modal'
import { withSalesTypes, defaultGroupings } from 'components/SalesTypes'
import { withQueryErrorPageOnError, PageNotFound } from 'components/pages/ErrorPage'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import withAlert from 'components/Modal/withAlert'
import { withStoreEnableDareMode } from 'components/pages/settings/venue/withEnableDareMode'
import DiscountItemFormPure from './DiscountItemForm'
import withDeleteDiscount from './withDeleteDiscount'

const addDiscountSuccessToast = name => getNotification('success', 'Discount created', name)
const updateDiscountSuccessToast = name => getNotification('success', 'Discount saved', name)
const addDiscountErrorToast = (message = 'Error creating discount') => getNotification('error', 'Error', message)
const updateDiscountErrorToast = (message = 'Error saving discount') => getNotification('error', 'Error', message)

// These separately export different HOCs which decorate the same base component,
// DiscountItemFormPure. They're used by the routes defined in SettingsPage.
export const NewDiscountItemForm = () => <DiscountItemFormNew type="ITEM" className="" />
export const NewDiscountSubtotalForm = () => <DiscountItemFormNew type="SUBTOTAL" className="" />
export const EditDiscountItemForm = obj => <UpdateDiscountItemForm discountID={obj.match.params.id} className="" />

const allDayCron = day => ({
  cronString: `0 0 * * ${weekLookup(day)}`,
  duration: 1440,
  allDaySelected: true,
})

const timeFrameToCron = (startStr, endStr) => {
  const start = startStr.split(':')
  const end = endStr.split(':')

  const startHour = String(parseInt(start[0], 10))
  const startMinute = String(parseInt(start[1], 10))

  const startMinutes = (parseInt(startHour, 10) * 60) + parseInt(startMinute, 10)
  const endMinutes = (parseInt(end[0], 10) * 60) + parseInt(end[1], 10)

  return {
    cronString: `${startMinute} ${startHour} * *`,
    duration: endMinutes - startMinutes,
  }
}

const dayToCron = (cron, day) => `${cron} ${weekLookup(day)}`

const getDiscountProps = isNew => createSelector(
  ({ ownProps }) => ownProps.history,
  ({ ownProps }) => ownProps.selectedVenueId,
  ({ ownProps }) => ownProps.discountID,
  ({ ownProps }) => ownProps.addNotification,
  ({ ownProps }) => ownProps.confirm,
  ({ mutate }) => mutate,
  (history, selectedVenueId, discountID, addNotification, confirm, mutate) => ({
    onSubmit: ({
      amountType,
      active,
      amount,
      customerType,
      name,
      requiresApproval,
      start,
      end,
      allDaySelected,
      appliesTo,
      salesTypes,
      ...values
    }) => {
      // Extra logic to extract input variables
      const map = amountTypeCategoryMap[amountType]
      const category = map[0]
      const newAmountType = map[1]

      let newSchedule = []
      const schedule = filter(DAYS, d => !!values[d])
      const hasSchedule = schedule.length > 0
      if (hasSchedule) {
        if (allDaySelected === 'allday') {
          newSchedule = schedule.map(d => allDayCron(d))
        } else {
          const { cronString, duration } = timeFrameToCron(start, end)
          newSchedule = schedule.map(d => ({
            cronString: dayToCron(cronString, d),
            allDaySelected: false,
            duration,
          }))
        }
      }
      const newSalesTypes = []
      if (appliesTo === 'ITEM') {
        forIn(salesTypes, (grouping) => {
          forIn(grouping, (value, key) => {
            if (value) newSalesTypes.push(key)
          })
        })
      }
      // Forming input object for mutation payload
      const input = {
        input: {
          discount: {
            schedule: newSchedule,
            name,
            customerType,
            requiresApproval,
            hasSchedule,
            category,
            amountType: newAmountType,
            amount,
            active,
            salesTypes: newSalesTypes,
          },
        },
      }
      if (isNew) {
        Object.assign(input.input, { storeId: selectedVenueId })
        input.input.discount = {
          ...input.input.discount,
          appliesTo,
        }
        return mutate({ // Actually invokes the mutation. Returns a promise.
          variables: input, // Give the mutation the payload.
          update: (store, { data: { addDiscount: { discount } } }) => {
            // Pulling up the data from the query we want to update. In this case, fetchDiscounts.
            const data = store.readQuery({
              query: fetchDiscounts,
              variables: {
                storeID: selectedVenueId,
              },
            })
            // Putting the discount to add to the list in the proper format
            const newEdge = {
              node: discount,
              __typename: 'DiscountEdge', // Requires the correct __typename
            }
            data.store.discounts.edges.push(newEdge) // Adding new discount to back of list
            store.writeQuery({ // Writing the edited list back to the cache.
              query: fetchDiscounts,
              variables: {
                storeID: selectedVenueId,
              },
              data, // The query data to write.
            })
          },
        }).then(() => { // After the promise is resolved. Is not called if there's an error.
          history.push('/crm/discounts') // Redirects to discounts list page
          addNotification(addDiscountSuccessToast(name))
        }, (error) => {
          addNotification(addDiscountErrorToast(error.message))
          return error
        })
      }
      Object.assign(input.input, { discountId: discountID })
      return mutate({ // Actually invokes the mutation. Returns a promise.
        variables: input, // Give the mutation the payload.
      }).then(() => { // After the promise is resolved. Is not called if there's an error.
        history.push('/crm/discounts') // Redirects to discounts list page
        addNotification(updateDiscountSuccessToast(name))
      }, (error) => {
        addNotification(updateDiscountErrorToast(error.message))
        return error
      })
    },
  }),
)

// HOC called when one of the new discount options are selected
const DiscountItemFormNew = compose(
  withVenueID,
  withStoreEnableDareMode,
  withRouter, // Adds 'history' prop, used to navigate back to discount page after submission.
  withNotifications,
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withSalesTypes(defaultGroupings), // salesTypeData
  withCancelConfirmation('/crm/discounts', { title: 'Discard record', message: 'Discard this new discount record?' }),
  graphql(fetchDiscounts, { // TODO: move this into a withDiscounts HOC
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(() => ({
    isNewDiscount: true,
  })),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['salesTypeData', 'data']),
  graphql(addDiscount, { // Mutation HOC. Adds prop to call mutation.
    props: getDiscountProps(true),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(DiscountItemFormPure)

// HOC called when one of the discounts in the table is selected.
const UpdateDiscountItemForm = compose(
  withVenueID,
  withStoreEnableDareMode,
  withRouter, // Adds 'history' prop, used to navigate back to discount page after submission.
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withNotifications,
  withDeleteDiscount(),
  withConfirm(), // TODO: I don't think needs both of these, probably an accident?
  withAlert(),
  withCancelConfirmation('/crm/discounts', { title: 'Discard changes', message: 'Discard changes made to this discount record?' }),
  withSalesTypes(defaultGroupings),
  graphql(getDiscount, { // Query to get the selected discount on component render
    name: 'discountData',
    options: props => ({
      variables: {
        discountID: props.discountID,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  graphql(fetchDiscounts, { // TODO: move this into a withDiscounts HOC
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(() => ({
    isNewDiscount: false,
  })),
  // Renders specified component instead while the query is loading/on error.
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['discountData', 'salesTypeData', 'data']),
  withQueryErrorPageOnError(['discountData', 'salesTypeData', 'data'], true),
  graphql(updateDiscount, { // Mutation HOC. Adds prop to call mutation.
    props: getDiscountProps(false),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  branch(
    ({ discountData }) => {
      const { loading } = discountData
      if (loading) return false
      return isEmpty(discountData.node)
    },
    () => PageNotFound(true),
  ),
)(DiscountItemFormPure)
