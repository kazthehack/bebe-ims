import { op as operation } from 'api/operation'

// Get Product List
export const getProducts = operation`
query getProducts($filter: ProductFilterInput!, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [ProductSortInput]) {
    store(id: $storeID) {
      id,
      products(filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy) {
        totalCount,
        edges {
          node {
            id
            name
            inventoryId
            notes
            posActive
            medicalOnly
            activePackageCount
            emptyPackageCount
            salesType {
              name
              id
              iconName
            }
            packages {
              id
              quantity
              finishedDate
              source
              unit
              providerInfo {
                ... on MetrcPackage {
                  tag
                }
              }
            }
            priceGroup {
              id
            }
            managedInventoryLevels {
              totalReceived
              totalLost
              totalSold
              totalVoided
              totalReturned
              currentStock
            }
          }
        }
      }
    }
  }
`

// Get Product
// TODO: remove unneeded fields once this is used and we know which are needed
export const getProduct = operation`
  query getProduct($productID: ID!) {
    node(id: $productID) {
      ...on Product {
        id
        name
        inventoryId
        posActive
        medicalOnly
        notes
        preventDiscount
        archivedDate
        salesType {
          name
          unit
          id
          portalTag
          liquid
        }
        packages {
          id
          name
          active
          source
          dateReceived
          initialQuantity
          quantity
          unit
          facilityName
          producerName
          finishedDate
          providerInfo {
              ... on MetrcPackage {
                tag
                metrcProduct {
                  name
                }
              }
            }
        }
        priceGroup {
          id
          name
          active
          shared
          portalMedicalSame
          salesType {
            id
            portalTag
          }
          prices {
            id
            portalActive
            customerType
            quantityAmount
            quantityUnit
            volumeAmount
            volumeUnit
            price
          }
        }
        managedInventoryLevels {
          totalReceived
          totalLost
          totalSold
          totalVoided
          totalReturned
          currentStock
        }
        combined
        combinedSalesTypes {
          quantityAmount
          salesType {
            name
            id
          }
        }
        combinedBreakdownPricing
      }
    }
  }
`

export const getProductsForInventoryManifestReport = operation`
query getProducts($filter: ProductFilterInput!, $storeID: ID!) {
  store(id: $storeID) {
    id,
    products(filterBy: $filter) {
      edges {
        node {
          id
          name
          salesType {
            name
          }
          managedInventoryLevels {
            totalReceived
            currentStock
          }
        }
      }
    }
  }
}
`

// Get Product
// TODO: remove unneeded fields once this is used and we know which are needed
export const getAssociatedProduct = operation`
  query getProduct($productID: ID!) {
    node(id: $productID) {
      ...on Product {
        id
        name
        inventoryId
        salesType {
          name
          id
          portalTag
        }
        packages {
          id
          name
          active
          source
          dateReceived
          initialQuantity
          quantity
          unit
          finishedDate
          providerInfo {
              ... on MetrcPackage {
                tag
                metrcProduct {
                  name
                }
              }
            }
        }
        priceGroup {
          id
          name
          salesType {
            id
            portalTag
          }
          prices {
            price
            quantityAmount
          }
        }
      }
    }
  }
`

// Get Product List to Assign
export const getProductsToAssign = operation`
query getProducts($filter: ProductFilterInput!, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [ProductSortInput]) {
    store(id: $storeID) {
      id,
      products(filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy) {
        totalCount,
        edges {
          node {
            id
            name
            inventoryId
            posActive
            medicalOnly
            activePackageCount
            salesType {
              name
              id
            }
          }
        }
      }
    }
  }
`

export const getProductsPaginated = operation`
query getProducts($filter: ProductFilterInput!, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [ProductSortInput]) {
    store(id: $storeID) {
      id,
      products(filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy) {
        totalCount,
        edges {
          node {
            id
            name
            inventoryId
            posActive
            medicalOnly
            activePackageCount
            emptyPackageCount
            salesType {
              name
              id
              iconName
            }
          }
        }
      }
    }
  }
`
