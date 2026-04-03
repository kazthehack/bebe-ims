import { graphql } from 'api/operationCompat'
import { fetchStoreEnableDareMode } from 'ops'

export const withStoreEnableDareMode = C =>
  graphql(fetchStoreEnableDareMode, {
    name: 'venueSettings',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export default withStoreEnableDareMode

