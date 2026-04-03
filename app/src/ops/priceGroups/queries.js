// Copyright (c) 2018 First Foundry Inc. All rights reserved.
import { op as operation } from 'api/operation'

// Get price group list
// the first part gets all of the different price groups
// the second part gets all of the products that use a price group
// so that they can be aggregated on the front-end
export const getPriceGroupsWithAssociatedProducts = operation`
  query getPriceGroupsWithAssociatedProducts($storeID: ID!, $archived: Boolean, $filter: ProductFilterInput!) {
    store(id: $storeID) {
      priceGroups(archived: $archived) {
        edges {
          node {
            id
            name
            active
            shared
            archivedDate
            salesType {
              id
              name
            }
          }
        }
      }
      id
      products(filterBy: $filter) {
        edges {
          node {
            id
            posActive
            priceGroup {
              id
              name
              active
            }
          }
        }
      }
    }
  }
`

export const getPriceGroups = operation`
 query getPriceGroups($storeID: ID!, $archived: Boolean) {
    store(id: $storeID) {
      id,
      priceGroups(archived: $archived) {
        edges {
          node {
            id
            name
            shared
            active
            portalMedicalSame
            salesType {
              id
            }
            prices {
              id
              portalActive
              customerType
              quantityAmount
              quantityUnit
              price
            }
            archivedDate
          }
        }
      }
    }
  }
`

export const getPriceGroup = operation`
  query getPriceGroup($priceGroupID: ID!) {
    node(id: $priceGroupID) {
      ... on PriceGroup {
        name
        shared
        active
        portalMedicalSame
        salesType {
          name
          id
        }
        prices {
          portalActive
          customerType
          quantityUnit
          volumeUnit
          quantityAmount
          volumeAmount
          price
        }
        id
        archivedDate
      }
    }
  }
`

export const getFilteredProducts = operation`
  query GetFilteredProducts($filter: ProductFilterInput!, $storeId: ID!){
    store(id: $storeId) {
      id
      products(filterBy: $filter) {
        edges {
          node {
            id
            inventoryId
            posActive
            name
            medicalOnly
            salesType {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const getPriceGroupsForProductFilter = operation`
 query getPriceGroups($storeID: ID!, $archived: Boolean) {
    store(id: $storeID) {
      id,
      priceGroups(archived: $archived) {
        edges {
          node {
            id
            name
            shared
          }
        }
      }
    }
  }
`
