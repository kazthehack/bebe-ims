//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const asyncCreateInventoryReport = operation`
  mutation AsyncCreateInventoryReport($input: AsyncCreateInventoryReportInput!) {
    asyncCreateInventoryReport(input: $input) {
      inventoryReportId
    }
  }
`

export const generateInventoryReportURL = operation`
  mutation GenerateInventoryReportURL($input:GenerateInventoryReportURLInput!) {
    generateInventoryReportUrl(input: $input) {
      signedUrl {
        url
      }
    }
  }
`
