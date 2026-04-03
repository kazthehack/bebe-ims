//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const asyncCreateSalesReport = operation`
  mutation AsyncCreateSalesReport($input: AsyncCreateSalesReportInput!) {
    asyncCreateSalesReport(input: $input) {
      salesReportId
    }
  }
`

export const generateSalesReportUrl = operation`
  mutation GenerateSalesReportURL($input:GenerateSalesReportURLInput!) {
    generateSalesReportUrl(input: $input) {
      signedUrl {
        url
      }
    }
  }
`
