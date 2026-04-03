// Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { queryAllFilteredPackages } from 'ops'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

const withFilteredPackageIDs = C =>
  graphql(queryAllFilteredPackages, {
    name: 'filteredPackageIDs',
    options: ({ selectedVenueId, skipFilteredPackageIDsTrigger }) => ({
      variables: {
        storeID: selectedVenueId,
        filter: {
          active: true,
          finished: false,
          archived: false,
          needsAttention: true,
        },
      },
      pollInterval: skipFilteredPackageIDsTrigger ? 0 : PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export default withFilteredPackageIDs
