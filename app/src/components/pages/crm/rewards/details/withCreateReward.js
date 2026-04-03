//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { createReward, getRewards } from 'ops/loyaltyPoints'

const successNote = (name = 'Reward') => getNotification('success', 'Success:', `${name} created`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Create Reward Error: ${msg}`)

const withCreateReward = () => compose(
  graphql(createReward, {
    props: ({ mutate, ownProps }) => ({
      createReward: ({ reward }) => {
        const { history, selectedVenueId } = ownProps
        const input = {
          storeId: selectedVenueId,
          reward,
        }
        return mutate({
          variables: {
            input,
          },
          refetchQueries: [
            {
              query: getRewards,
              variables: {
                storeID: selectedVenueId,
              },
            },
          ],
        })
          .then(() => {
            history.push('/crm/rewards')
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

export default withCreateReward
