//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

/* eslint-disable graphql/template-strings */
import { op as operation } from 'api/operation'

export const fetchVenues = operation`
  {
    viewer {
      ... on Employee {
        stores {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`

const commonVenueSettings = {
  store: `
    id,
    name
    address
    addressExtra
    city
    state
    zipCode
    phone
    website
    timezone
    logoUrl
    receiptTagline
    packagesLastImportedAt
    owner {
      id
      name
    }
    posSettings {
      useWeightHeavy
      weightHeavyQuantity
      usePackageFinishThreshold
      packageFinishThreshold
      usePosAutoLogout
      posAutoLogoutMinutes
      openCashDrawerRequiresManager
      enableReceiptPrint
      logoutAfterSale
      ageCheck
      useForceAgeCheck
      labelPrintTiming
      useSplitPricing
      metrcDelayMins
    }
    settings {
      runReportsAt
      pricingScheme
      pinLength
      enableDareMode
      enableNewDashboard
      allowDashboardSelection
    }
  `,
}

const ownerOnlyVenueSettings = {
  store:
    `integrations {
      metrc {
        licenseNumber
        userKey
        readOnly
      }
    }
    `,
}

export const fetchOwnerVenueSettings = operation`
  query FetchVenueSettings($storeID: ID!) {
    store(id: $storeID) {
    ${commonVenueSettings.store}
    ${ownerOnlyVenueSettings.store}
    }
  }
`

export const fetchVenueSettings = operation`
  query FetchVenueSettings($storeID: ID!) {
    store(id: $storeID) {
      ${commonVenueSettings.store}
    }
  }
`

export const fetchStoreAdjustmentReasons = operation`
  query FetchVenueSettings($storeID: ID!) {
    store(id: $storeID) {
      id,
      adjustReasons,
    }
  }
`

export const fetchStoreRoles = operation`
  query FetchStoreRoles($storeID: ID!) {
    store(id: $storeID) {
      id,
      portalRoles {
        id
        name
      },
      posRoles {
        id
        name
      }
    }
}
`

export const fetchPrinterAddress = operation`
  query FetchPrinterAddress($storeID: ID!) {
    store(id: $storeID) {
      id,
      settings {
        labelPrinterAddress
      }
    }
}
`

export const fetchStoreEnableDareMode = operation`
  query FetchVenueSettings($storeID: ID!) {
    store(id: $storeID) {
      id,
      settings {
        enableDareMode
      }
    }
  }
`
