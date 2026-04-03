//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { updateCustomer, getCustomerDetails, getLoyaltyMembers } from 'ops/loyaltyPoints'

const successNote = (name = 'Customer') => getNotification('success', 'Success:', `${name} updated`)
const errorNote = (msg = '') => getNotification('error', 'Error:', `Update Customer Error: ${msg}`)

const withUpdateCustomer = () => compose(
  graphql(updateCustomer, {
    props: ({ mutate, ownProps }) => ({
      updateCustomer: ({ memberId, memberData }) => {
        const input = {
          loyaltyMemberId: memberId,
          loyaltyMember: memberData,
        }
        const { selectedVenueId } = ownProps
        return mutate({
          variables: { input },
          refetchQueries: [
            {
              query: getCustomerDetails,
              variables: {
                memberID: memberId,
              },
            },
            {
              query: getLoyaltyMembers,
              variables: {
                storeID: selectedVenueId,
              },
            },
          ],
        })
          .then(() => {
            ownProps.history.push('/crm')
            ownProps.addNotification(successNote())
          }, (error) => {
            ownProps.addNotification(errorNote(error.message))
            return error
          })
      },
    }),
  }),
)

export default withUpdateCustomer
