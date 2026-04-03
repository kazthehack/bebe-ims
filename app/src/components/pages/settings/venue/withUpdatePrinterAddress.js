//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getNotification } from 'components/Notifications'
import { updatePrinterAddress as gqlPrinterAddress } from 'ops/venues/mutations'

const successNote = () => getNotification('success', 'Success:', 'Label Printer Address Success.')
const errorNote = () => getNotification('error', 'Error:', 'Label Printer Address Error.')

const updatePrinterAddressHOC = () => compose(
  graphql(gqlPrinterAddress, {
    props: ({ mutate, ownProps }) => ({
      updatePrinterAddress: (ipAddress) => {
        const input = {
          storeId: ownProps.selectedVenueId,
          settings: {
            labelPrinterAddress: ipAddress,
          },
        }
        return mutate({
          variables: { input },
        })
          .then(() => {
            ownProps.addNotification(successNote())
          }, (error) => {
            ownProps.addNotification(errorNote())
            return error
          })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default updatePrinterAddressHOC
