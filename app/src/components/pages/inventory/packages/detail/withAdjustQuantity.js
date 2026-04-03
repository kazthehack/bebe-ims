//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { adjustPackage } from 'ops'
import { getNotification } from 'components/Notifications'
import { get } from 'lodash'
import { format } from 'date-fns'

const UPDATE_SUCCESS = (previousQuantity, quantity) => getNotification('success', 'Success:', `Changed from ${previousQuantity} to ${Number(quantity)} quantity updated`)
const ERROR = (message = '') => getNotification('error', 'Error', message)

const withAdjustQuantity = fixPackage => compose(
  graphql(adjustPackage, {
    props: ({ mutate, ownProps }) => ({
      onSubmitAdjustPackage: ({
        packageId,
        quantity,
        adjustmentAmount,
        report,
        reason,
        note,
        date,
      }) => {
        const QuantityMultiplier = (report === 'loss') ? -1 : 1
        const input = {
          packageId,
          quantity: String(adjustmentAmount * QuantityMultiplier),
          reason,
          note,
          date: format(date, 'YYYY-MM-DD'),
        }
        // Safeguard against allowing metrc mutation on a readOnly store. Should never be reached.
        if (get(ownProps, 'metrcSettings.store.integrations.metrc.readOnly')) {
          ownProps.addNotification(ERROR('Operation not allowed in METRC Read Only Mode.'))
          return false
        }
        return mutate({
          variables: { input },
        }).then(({ data }) => { // After the promise is resolved. Not called if there's an error
          const newQuantity = get(data, 'adjustPackage.package.quantity')
          ownProps.addNotification(UPDATE_SUCCESS(quantity, newQuantity))
          if (fixPackage) {
            ownProps.history.push(`/inventory/packages/fix/${packageId}`) // Redirects to fix package details.
          } else {
            ownProps.history.push(`/inventory/packages/${packageId}`) // Redirects to package details.
          }
        }, (error) => {
          ownProps.addNotification(ERROR(error.message))
          return error
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withAdjustQuantity
