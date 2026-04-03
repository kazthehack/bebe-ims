import { graphql } from 'api/operationCompat'
import { getBrands } from 'ops'

export const withStoreBrands = C =>
  graphql(getBrands, {
    name: 'storeBrandsData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export default withStoreBrands

