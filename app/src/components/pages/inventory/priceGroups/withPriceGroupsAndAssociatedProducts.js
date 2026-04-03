// Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getPriceGroupsWithAssociatedProducts } from 'ops'
import { withVenueID } from 'components/Venue'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

export default ({
  name = 'priceGroupsMessyData',
  ...config
} = {}) => C => compose(
  withVenueID, // TODO: Don't import this here, hurts separation of concerns
  graphql(getPriceGroupsWithAssociatedProducts, {
    name,
    ...config,
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
        filter: {
          archived: false,
        },
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(C)
