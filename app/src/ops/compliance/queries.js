//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const getComplianceLimit = operation`
  query getCompliance($complianceID: ID!) {
    complianceLimit: node(id: $complianceID) {
      ...on ComplianceLimit {
        name
        customerType
        limitQuantity
        unit
        timeframe
        salesTypes {
          id
        }
        id
        archivedDate
      }
    }
  }
`

export const getComplianceList = operation`
  query FetchComplianceList($storeID: ID!) {
    store(id: $storeID) {
      id,
      complianceLimits{
        edges {
          node {
            name
            customerType
            limitQuantity
            unit
            timeframe
            id
          }
        }
      }
    }
  }
`
