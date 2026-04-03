//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

const createSalesExport = operation`
  mutation createSalesExport($input: CreateSalesExportInput!) {
    createSalesExport(input: $input) {
      signedUrl {
        url
      }
    }
  }
`

export default createSalesExport
