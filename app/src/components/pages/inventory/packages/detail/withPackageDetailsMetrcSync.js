//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { syncPackage as gqlSyncPackage } from 'ops/packages'
import { withNotifications, getNotification } from 'components/Notifications'
import { withConfirm, withModals, withCancelConfirmation } from 'components/Modal'
import { withRouter } from 'react-router-dom'
import { withVenueID } from 'components/Venue'

const successUpdated = (name = 'Package') => getNotification('success', 'Success:', `${name} updated`)
const errorAssign = (message = '') => getNotification('error', 'Error', message)

export default () => compose(
  withRouter,
  withVenueID,
  withNotifications,
  withConfirm(),
  withCancelConfirmation(),
  withModals,
  graphql(gqlSyncPackage, {
    props: ({ mutate, ownProps }) => ({
      syncPackage: () => {
        const input = {
          input: {
            storeId: ownProps.selectedVenueId,
            packageId: ownProps.packageId,
          },
        }
        mutate({
          variables: input,
        })
          .then(() => { // After the promise is resolved. Is not called if there's an error.
            ownProps.addNotification(successUpdated())
          }, (error) => {
            ownProps.addNotification(errorAssign(error.message))
            return error
          })
      },
    }),
  }),
)
