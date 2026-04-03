// Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getPriceGroups } from 'ops'

// Requires withVenueID for selectedVenueId prop.
export default ({
  name = 'priceGroupData',
  ...config
} = {}) => C =>
  graphql(getPriceGroups, {
    name,
    ...config,
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)
