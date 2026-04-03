// Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getProducts, getProductsToAssign } from 'ops'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import { get } from 'lodash'

export const withProductList = (showArchived = false) => C =>
  graphql(getProducts, {
    name: 'productsData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
        filter: {
          archived: showArchived,
        },
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)

export const withProductListToAssign = (showArchived = false) => C =>
  graphql(getProductsToAssign, {
    name: 'productsData',
    options: ({ selectedVenueId, assignProductTable, selectedSalesType }) => ({
      variables: {
        storeID: selectedVenueId,
        filter: {
          archived: showArchived,
          salesTypes: [selectedSalesType],
        },
        pageSize: 50,
        pagesSkipped: get(assignProductTable, 'page'),
        search: get(assignProductTable, 'searchTerm'),
      },
      pollInterval: PAGE_POLL_INTERVAL,
      fetchPolicy: 'cache-and-network',
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C)
