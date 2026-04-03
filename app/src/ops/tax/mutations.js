//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const updateTax = operation`
  mutation updateTax($input: UpdateTaxInput!) {
    updateTax(input: $input) {
      tax {
        id
        name
        amount
        appliesTo
        amountType
        customerType
        active
        salesTypes {
          id
        }
      }
    }
  }
`

// TODO: include more information with this callback so that refetchQueries doesn't need to be
// called after a tax is added.
export const addTax = operation`
  mutation addTax($input: AddTaxInput!) {
    addTax(input: $input) {
      tax {
        id
      }
    }
  }
`

export const deleteTax = operation`
  mutation deleteTax ($input: DeleteTaxInput!) {
    deleteTax(input: $input) {
      deletedTaxId
    }
  }
`

export const genPresignedTaxReportUrl = operation`
  mutation genPresignedTaxReportUrl($input: GenerateTaxReportURLInput!) {
    genPresignedTaxReportUrl(input: $input) {
      signedUrl {
        url
      }
    }
  }
`

export const regenTaxReport = operation`
  mutation regenTaxReport($input: RegenerateTaxReportInput!) {
    regenerateTaxReport(input: $input) {
      signedUrl {
        url
      }
      taxReport {
        reportType
        name
        id
        date
        createdAt
        totalRetailSales
        totalTaxExemptSales
        taxCollected
      }
    }
  }
`

export const archiveTax = operation`
  mutation archiveTax($input: ArchiveTaxInput!) {
    archiveTax(input: $input) {
      tax {
        id
        archivedDate
      }
    }
  }
`
