import { graphql } from 'api/operationCompat'
import { getPriceGroupsForProductFilter } from 'ops/priceGroups'

export default ({
  name = 'priceGroupData',
  ...config
} = {}) => C =>
  graphql(getPriceGroupsForProductFilter, {
    name,
    ...config,
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)
