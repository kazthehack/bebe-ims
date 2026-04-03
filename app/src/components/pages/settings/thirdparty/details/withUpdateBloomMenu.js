//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { updateBloomMenu } from 'ops/thirdPartySettings'
import { getNotification } from 'components/Notifications'
import { withVenueID } from 'components/Venue'

const successNote = (name = 'Bloom Menu Integrations') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Bloom Menu Integrations Error: ${msg}`)

const withUpdateBloomMenu = () => compose(
  withVenueID,
  graphql(updateBloomMenu, {
    props: ({ mutate, ownProps }) => ({
      updateBloomMenu: (instructions, active) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          onlineMenu: {
            instructions,
            active,
          },
        }
        return mutate({
          variables: { input },
        })
          .then(() => {
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

export default withUpdateBloomMenu
