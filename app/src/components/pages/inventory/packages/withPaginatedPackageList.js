//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getPackages } from 'ops'
import { withProps, compose } from 'recompose'
import { get } from 'lodash'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

const fieldsName = {
  'node.active': 'ACTIVE',
  'node.needsAttention': 'ATTENTION_NEEDED',
  'node.dateReceived': 'DATE_RECEIVED',
  'node.providerInfo.tag': 'TAG',
  'node.providerInfo.metrcProduct.category': 'METRC_PRODUCT_CATEGORY',
  'node.providerInfo.metrcProduct.name': 'METRC_PRODUCT_NAME',
  'node.facilityName': 'FACILITY_NAME',
  'node.productName': 'PRODUCT_NAME',
  'node.product.name': 'PRODUCT_NAME',
  'node.quantity': 'QUANTITY',
}

const getSort = (sorting = []) => {
  const sortingArray = []

  sorting.forEach((sortObject) => {
    if (fieldsName[sortObject.id]) {
      sortingArray.push({
        fieldName: fieldsName[sortObject.id],
        orderBy: sortObject.desc ? 'DESCENDING' : 'ASCENDING',
      })
    }
  })

  return sortingArray
}

const defaultSorting = [{
  id: 'node.active',
  desc: true,
}, {
  id: 'node.dateReceived',
  desc: true,
}, {
  id: 'node.finishedDate',
  desc: true,
},
]

export default compose(
  graphql(getPackages, {
    name: 'packagesListData',
    options: ({
      selectedVenueId,
      paginationState,
      tableSearchTerm,
      packagesTable,
      tableFilters,
    }) => {
      const filters = {
        ...tableFilters,
        finished: get(tableFilters, 'finished.value'),
        brandId: get(tableFilters, 'brandId.value'),
        strainId: get(tableFilters, 'strainId.value'),
        salesTypes: get(tableFilters, 'salesTypes', []).map(salesType => get(salesType, 'value')),
      }
      return ({
        variables: {
          storeID: selectedVenueId,
          filter: {
            archived: false,
            ...filters,
          },
          pageSize: paginationState.pageSize,
          pagesSkipped: paginationState.pagesSkipped,
          search: tableSearchTerm,
          sortBy: getSort(packagesTable.sort || defaultSorting),
        },
        pollInterval: PAGE_POLL_INTERVAL,
      })
    },
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(({ storeData, ...props }) => ({
    totalPackages: get(storeData, 'store.packages.totalCount', 0),
    brands: get(storeData, 'store.brands', []),
    ...props,
  })),
)
