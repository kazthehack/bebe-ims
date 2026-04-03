//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { updatePaybotics as gqlUpdatePaybotics } from 'ops/thirdPartySettings/mutations'

const successNote = (name = 'Paybotics Integrations') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Paybotics Integrations Error: ${msg}`)

const withUpdatePaybotics = () => compose(
  graphql(gqlUpdatePaybotics, {
    props: ({ mutate, ownProps }) => ({
      updatePaybotics: (activeToggle = false) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          posSettings: {
            enablePaybotics: activeToggle,
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

export default withUpdatePaybotics
