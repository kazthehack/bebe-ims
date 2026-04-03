//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { updateIntegrations } from 'ops'
import { getNotification } from 'components/Notifications'
import { withVenueID } from 'components/Venue'

const successNote = (name = 'Metrc Integrations') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Metrc Integrations Error: ${msg}`)

export default () => C => compose(
  withVenueID,
  graphql(updateIntegrations, {
    props: ({ mutate, ownProps }) => ({
      submitUpdateIntegrations: (licenseNumber, userKey, readOnly) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          metrc: {
            userKey,
            licenseNumber,
            readOnly,
          },
        }
        return mutate({
          variables: { input },
        })
          .then(() => { // After the promise is resolved. Is not called if there's an error.
            ownProps.addNotification(successNote())
          }, (error) => {
            ownProps.addNotification(errorNote(error.message))
            return error
          })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(C)
