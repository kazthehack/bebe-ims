import { graphql } from 'api/operationCompat'
import { fetchPrinterAddress } from 'ops'

export const withPrinterAddress = C =>
  graphql(fetchPrinterAddress, {
    name: 'printerAddressData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export default withPrinterAddress

