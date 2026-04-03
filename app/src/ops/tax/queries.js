//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

// Get Tax List
export const getTaxList = operation`
  query getTaxList($storeID: ID!, $includeTaxArchives: Boolean = false) { # do not include achived records unless explicitly requested
    store(id: $storeID) {
      id,
      taxes(archived: $includeTaxArchives) {
        edges {
          node {
            id
            name
            amount
            appliesTo
            amountType
            customerType
            active
            archivedDate
            salesTypes {
              id
            }
          }
        }
      }
    }
  }
`

// Get Tax
export const getTax = operation`
  query getTax($taxID: ID!) {
    tax: node(id: $taxID) {
      ...on Tax {
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

export const getMonthlyTaxReport = operation`
  query monthlyTaxReports($storeID: ID!, $startDate: Date!, $endDate: Date!) {
    store(id: $storeID) {
      id,
      monthlyTaxReports(startDate: $startDate, endDate: $endDate) {
        id
        date
        name
        createdAt
        taxCollected
        totalRetailSales
        totalTaxExemptSales
      }
    }
  }
`

export const getQuarterlyTaxReport = operation`
  query quarterlyTaxReports($storeID: ID!, $startDate: Date!, $endDate: Date!) {
    store(id: $storeID) {
      id,
      quarterlyTaxReports(startDate: $startDate, endDate: $endDate) {
        id
        date
        name
        createdAt
        taxCollected
        totalRetailSales
        totalTaxExemptSales
      }
    }
  }
`
