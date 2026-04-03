//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { getFilteredProducts } from 'ops'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

// Requires
// { withVenueID } from 'components/Venue'
export default C => compose(
  graphql(getFilteredProducts, {
    name: 'priceGroupProductsData',
    options: ({ match, selectedVenueId }) => ({
      variables: {
        storeId: selectedVenueId,
        filter: {
          priceGroupId: match.params.id,
          archived: false,
        },
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(C)
