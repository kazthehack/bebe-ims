//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { updateLeafly } from 'ops/thirdPartySettings'
import { getNotification } from 'components/Notifications'
import { withVenueID } from 'components/Venue'

const successNote = (name = 'Leafly Integrations') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Leafly Integrations Error: ${msg}`)

const withUpdateLeafly = () => compose(
  withVenueID,
  graphql(updateLeafly, {
    props: ({ mutate, ownProps }) => ({
      updateLeafly: (userKey, activeKey = false) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          leafly: {
            clientKey: userKey,
            active: activeKey,
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
)

export default withUpdateLeafly
