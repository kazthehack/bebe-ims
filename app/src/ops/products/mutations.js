// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const addProduct = operation`
  mutation addProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      product {
        id
        name
        inventoryId
        posActive
        medicalOnly
        notes
        packages {
          id
          initialQuantity
          quantity
        }
        salesType {
          name
          id
          iconName
        }
        priceGroup {
          id
          name
          active
          portalMedicalSame
          prices {
            portalActive
            customerType
            quantityAmount
            quantityUnit
            price
            volumeAmount
            volumeUnit
          }
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
`

export const updateProduct = operation`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
        name
        posActive
        medicalOnly
        preventDiscount
        notes
        salesType {
          name
          unit
          id
          portalTag
        }
        priceGroup {
          id
          name
          active
          portalMedicalSame
          shared
          prices {
            id
            portalActive
            customerType
            quantityAmount
            quantityUnit
            price
            volumeAmount
            volumeUnit
          }
        }
        packages {
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
`

export const addManagedInventoryEvent = operation`
  mutation addManagedInventoryEvent($input: AddManagedInventoryEventInput!) {
    addManagedInventoryEvent(input: $input) {
      event {
        eventDate
        eventType
        quantity
        notes
        id
      }
    }
  }
`

export const archiveProduct = operation`
  mutation archiveProduct($input: ArchiveProductInput!) {
    archiveProduct(input: $input) {
      product {
        id
        name
        archivedDate
      }
    }
  }
`
