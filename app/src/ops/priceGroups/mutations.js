// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const updatePriceGroup = operation`
  mutation updatePriceGroup($input: UpdatePriceGroupInput!) {
    updatePriceGroup(input: $input) {
      priceGroup {
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
      }
    }
  }
`

export const addPriceGroup = operation`
  mutation addPriceGroup($input: AddPriceGroupInput!) {
    addPriceGroup(input: $input) {
      priceGroup {
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
      }
    }
  }
`

export const archivePriceGroup = operation`
  mutation archivePriceGroup ($input: ArchivePriceGroupInput!) {
    archivePriceGroup(input: $input) {
      archivedPriceGroupId
      archivedDate
    }
  }
`
