//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const updateCompliance = operation`
  mutation updateCompliance($input: UpdateComplianceInput!) {
    updateCompliance(input: $input) {
      complianceLimit {
        name
        customerType
        limitQuantity
        unit
        timeframe
        salesTypes {
          id
        }
        id
      }
    }
  }
`

export const addCompliance = operation`
  mutation addCompliance($input: AddComplianceInput!) {
    addCompliance(input: $input) {
      complianceLimit {
        name
        customerType
        limitQuantity
        unit
        timeframe
        salesTypes {
          id
        }
        id
      }
    }
  }
`

export const archiveCompliance = operation`
  mutation archiveCompliance($input: ArchiveComplianceInput!) {
    archiveCompliance(input: $input) {
      complianceLimit {
        id
        archivedDate
      }
    }
  }
`
