//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { v4 } from 'uuid'
import { findIndex, get, set } from 'lodash'
import { fetchDiscounts, archiveDiscount } from 'ops'
import { withVenueID } from 'components/Venue'
import { getNotification } from 'components/Notifications'
import { withConfirm } from 'components/Modal'

const deleteDiscountSuccessToast = name => getNotification('success', 'Discount deleted', name)
const deleteDiscountErrorToast = (message = 'Error deleting discount') => getNotification('error', 'Error', message)

const withDeleteDiscount = (id = v4()) => compose(
  withVenueID,
  withConfirm(id),
  graphql(archiveDiscount, {
    props: ({ mutate, ownProps }) => ({
      deleteDiscount: (discountId, discountName) => {
        const input = { discountId }
        return ownProps.confirm({
          title: 'Delete Discount?',
          message: 'Are you sure you want to delete this discount?',
        }).then((confirmed) => {
          if (!confirmed) return undefined
          return mutate({
            variables: { input },
            update: (cache) => {
              const variables = { storeID: ownProps.selectedVenueId }
              const data = cache.readQuery({ query: fetchDiscounts, variables })
              const prevDiscountList = get(data, 'store.discounts.edges') || []
              prevDiscountList.splice(findIndex(prevDiscountList, elt => get(elt, 'node.id') === discountId), 1)
              const nextDiscountList = prevDiscountList
              set(data, 'store.discounts.edges', nextDiscountList)
              return cache.writeQuery({
                query: fetchDiscounts,
                variables,
                data,
              })
            },
          }).then(() => { // After the promise is resolved. Is not called if there's an error.
            ownProps.history.push('/crm/discounts') // Redirects to discounts list page
            ownProps.addNotification(deleteDiscountSuccessToast(discountName))
          }, (error) => {
            ownProps.addNotification(deleteDiscountErrorToast(error.message))
            return error
          })
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withDeleteDiscount
