//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { adjustLoyaltyPoints, getLoyaltyMembers } from 'ops/loyaltyPoints'

const successNote = (name = 'Customer') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Update Customer Error: ${msg}`)

const withAdjustLoyaltyPoints = () => compose(
  graphql(adjustLoyaltyPoints, {
    props: ({ mutate, ownProps }) => ({
      adjustLoyaltyPoints: ({ memberId, adjustmentData, refetchData }) => {
        const input = {
          loyaltyMemberId: memberId,
          loyaltyPointAdjustment: adjustmentData,
        }
        return mutate({
          variables: { input },
          update: () => {
            refetchData()
          },
          refetchQueries: [
            {
              query: getLoyaltyMembers,
              variables: {
                storeID: ownProps.selectedVenueId,
              },
            },
          ],
        })
          .then(() => {
            ownProps.addNotification(successNote())
          }, (error) => {
            ownProps.addNotification(errorNote(error.message))
            return error
          })
      },
    }),
  }),
)

export default withAdjustLoyaltyPoints
