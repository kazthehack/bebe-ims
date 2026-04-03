//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.
// TODO: create package details template
import { op as operation } from 'api/operation'

export const adjustPackage = operation`
  mutation adjustPackage($input: AdjustPackageInput!) {
    adjustPackage(input: $input) {
      package {
        id
        name
        source
        dateReceived
        initialQuantity
        quantity
        unit
        providerInfo {
          ... on MetrcPackage {
            tag
          }
        }
        product {
          name
          id
        }
      }
    }
  }
`

export const associatePackageProduct = operation`
  mutation associatePackageProduct($input: AssociatePackageProductInput!) {
    associatePackageProduct(input: $input) {
      package {
        id
        name
        source
        dateReceived
        initialQuantity
        quantity
        unit
        finishedDate
        providerInfo {
          ... on MetrcPackage {
            tag
          }
        }
        product {
          name
          id
        }
      }
    }
  }
`

export const finishPackage = operation`
  mutation finishPackage($input: FinishPackageInput!) {
    finishPackage(input: $input) {
      package {
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
        isPendingFinish
        finishedDate
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
  }
`

export const updatePackage = operation`
  mutation updatePackage($input: UpdatePackageInput!) {
    updatePackage(input: $input) {
      package {
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
        pricePaid
        harvestDate
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
  }
`

export const fetchUnsyncedPackages = operation`
  mutation fetchActivePackages($input: FetchActivePackagesInput!) {
    fetchActivePackages(input: $input) {
      providerData
    }
  }
`

export const createPackageFromProvider = operation`
  mutation createPackageFromProvider($input: CreatePackageFromProviderInput!) {
    createPackageFromProvider(input: $input) {
      package {
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
  }
`

export const syncPackage = operation`
  mutation SyncPackage($input: SyncPackageInput!) {
    syncPackage(input: $input) {
      package {
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
  }
`

export const importPackages = operation`
  mutation importPackages($input: ImportPackagesInput!) {
    importPackages(input: $input) {
      packages {
        id
        active
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
        pricePaid
        harvestDate
        sourceIsProducer
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
          testDate
          testStatus
          displayCbd
          displayThc
          isThcUnderLoq
          isCbdUnderLoq
          displayIndica,
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
`
