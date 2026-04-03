import { op as operation } from 'api/operation'

/* eslint-disable graphql/template-strings */

// Get Packages List
export const getPackages = operation`
  query getPackages($filter: PackageFilterInput, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [PackageSortInput]) {
    store(id: $storeID) {
      id,
      brands {
        id,
        name,
      }
      strains {
        id,
        name,
      }
      salesTypes {
        id,
        name,
      }
      packages (filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy ) {
        totalCount,
        edges {
          node {
            id
            active
            needsAttention
            name # This field isn't being used anymore. Refraining from removing it until it is removed from the back-end.
            source
            facilityName
            producerLicense
            producerName
            facilityLicense
            dateReceived
            initialQuantity
            quantity
            unit
            finishedDate
            harvestDate
            sourceIsProducer
            pricePaid,
            strain {
              name
            }
            brand {
              id
              name
            }
            product {
              id
              name
            }
            labResult {
              testLabName
              testStatus
              testDate
              displayCbd
              displayThc
              isThcUnderLoq
              isCbdUnderLoq
              displayIndica
              displaySativa
            }
            providerInfo {
              ... on MetrcPackage {
                metrcPackageId
                tag
                metrcProduct {
                  category
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

// Get Packages List
export const getPackagesToAssign = operation`
  query getPackages($filter: PackageFilterInput, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [PackageSortInput]) {
    store(id: $storeID) {
      id,
      packages (filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy ) {
        totalCount,
        edges {
          node {
            id
            active
            source
            producerName
            dateReceived
            initialQuantity
            quantity
            unit
            product {
              id
              name
            }
            providerInfo {
              ... on MetrcPackage {
                metrcPackageId
                tag
                metrcProduct {
                  category
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

export const getPackage = operation`
  query getPackage($packageID: ID!, $storeID: ID!) {
    node(id: $packageID) {
      ...on Package {
        id
        active
        name # This field isn't being used anymore. Refraining from removing it until it is removed from the back-end.
        unit
        source
        harvestDate
        sourceIsProducer
        producerName
        producerLicense
        initialQuantity
        quantity
        providerUnit
        dateReceived
        finishedDate
        isPendingFinish
        pricePaid
        facilityName
        facilityLicense  # facilityID
        providerLastModified
        providerLastSync
        manifestNumber
        isOnHold
        strain {
          name
        }
        brand {
          id
          name
        }
        labResult {
          testDate
          testLabName
          testStatus
          remediationRequired
          displayThc
          displayCbd
          isThcUnderLoq
          isCbdUnderLoq
          displayIndica
          displaySativa
          resultHistory {
            previousTestLabName
            previousTestDate
          }
        }
        product {
            id
            name
            posActive
            salesType {
              id
              name
              portalTag
            }
        }
        providerInfo {
          ... on MetrcPackage {
            tag
            metrcPackageId
            metrcProduct {
              metrcProductId
              name
              category
            }
          }
        }
      }
    }
    store(id: $storeID) {
      id,
      adjustReasons,
      brands {
        id,
        name,
      }
      strains {
        name,
      }
    }
  }
`
// get Brands  - is this used??
export const getBrands = operation`
  query getBrands($storeID: ID!) {
    store(id: $storeID) {
      id,
      brands {
        id,
        name,
      }
    }
  }
`

export const getStrains = operation`
  query getStrains($storeID: ID!) {
    store(id: $storeID) {
      id,
      strains {
        name,
      }
    }
  }
`

export const queryAllFilteredPackages = operation`
  query queryAllFilteredPackages($filter: PackageFilterInput!, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int) {
    store(id: $storeID) {
      id
      packages (filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped){
        totalCount
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

// Get a Package Change Log List
export const getPackageChangeLog = operation`
  query GetPackage($packageId: ID!, $filter: ChangeLogFilterInput!){
    node(id: $packageId) {
      ... on Package {
      id
      changelog(filterBy: $filter)
        {
          edges {
            node {
              id
              employeeId
              employeeName
              timestamp
              payload
              {
                header
                content
                identifier
              }
            }
          }
        }
      }
    }
  }
`

export const getPackagesForInventoryManifestReport = operation`
  query getPackages($filter: PackageFilterInput, $storeID: ID!, $pageSize: Int, $pagesSkipped: Int, $search: String, $sortBy: [PackageSortInput]) {
    store(id: $storeID) {
      id,
      packages (filterBy: $filter, pageSize: $pageSize, pagesSkipped: $pagesSkipped, search: $search, sortBy: $sortBy ) {
        totalCount,
        edges {
          node {
            id
            name
            dateReceived
            producerName
            quantity
            initialQuantity
            product {
              id
              name
            }
            providerInfo {
              ... on MetrcPackage {
                metrcPackageId
                tag
                metrcProduct {
                  category
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`
