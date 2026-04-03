import { graphql } from 'api/operationCompat'
import { getStrains } from 'ops'

export const withStoreStrains = C =>
  graphql(getStrains, {
    name: 'storeStrainsData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export default withStoreStrains

