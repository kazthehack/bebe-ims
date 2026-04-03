//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { updateReward, getRewardDetails } from 'ops/loyaltyPoints'

const successNote = (name = 'Reward') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Update Reward Error: ${msg}`)

const withUpdateReward = () => compose(
  graphql(updateReward, {
    props: ({ mutate, ownProps }) => ({
      updateReward: ({ reward, rewardId }) => {
        const { history } = ownProps
        const input = {
          reward,
          rewardId,
        }
        return mutate({
          variables: { input },
          refetchQueries: [
            {
              query: getRewardDetails,
              variables: {
                rewardID: rewardId,
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
  }),
)

export default withUpdateReward
