//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getProductsPaginated } from 'ops'
import { withProps, compose } from 'recompose'
import { get } from 'lodash'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

const fieldsName = {
  posActive: 'ACTIVE',
  name: 'NAME',
  medicalOnly: 'MEDICAL',
  inventoryId: 'INVENTORY_ID',
  salesType: 'SALES_TYPE',
  activePackageCount: 'USABLE_PACKAGES',
  emptyPackageCount: 'EMPTY_PACKAGES',
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

export const defaultSorting = [{
  id: 'posActive',
  desc: true,
}, {
  id: 'name',
  desc: false,
}]

export default compose(
  graphql(getProductsPaginated, {
    name: 'productsData',
    options: ({
      selectedVenueId,
      paginationState,
      tableSearchTerm,
      productsTable,
      tableFilters,
    }) => {
      const filters = {
        ...tableFilters,
        priceGroupId: get(tableFilters, 'priceGroupId.value'),
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
          sortBy: getSort(productsTable.sort || defaultSorting),
        },
        pollInterval: PAGE_POLL_INTERVAL,
        fetchPolicy: 'cache-and-network',
      })
    },
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(({ storeData, ...props }) => ({
    totalProducts: get(storeData, 'store.products.totalCount', 0),
    ...props,
  })),
)
