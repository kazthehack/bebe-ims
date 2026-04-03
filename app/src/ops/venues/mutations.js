import { op as operation } from 'api/operation'

export const updateVenueSettings = operation`
mutation UpdateVenueSettings($input: UpdateStoreInput!) {
  updateStore(input: $input) {
    clientMutationId,
  }
}
`

export const updateStore = operation`
mutation updateStore($input: UpdateStoreInput!) {
  updateStore(input: $input) {
    clientMutationId
    store {
      id
      name
      address
      addressExtra
      city
      state
      zipCode
      phone
      website
      timezone
      settings {
        runReportsAt
        pricingScheme
        labelPrinterAddress
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
        fetchIntervalMinutes
        ageCheck
        useForceAgeCheck
        labelPrintTiming
        useSplitPricing
        metrcDelayMins
      }
    }
  }
}
`

export const getLogoUploadURL = operation`
mutation getLogoUploadURL($input: GenerateStoreLogoURLInput!) {
  genPresignedLogoUrl(input: $input) {
    logoUrl,
    signedUpload { url, fields },
    clientMutationId
  }
}
`

export const setLogoURL = operation`
mutation setLogoURL($input: SetStoreLogoInput!) {
  setStoreLogo(input: $input) {
    success,
    clientMutationId
  }
}
`

export const updatePrinterAddress = operation`
  mutation updatePrinterAddress($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      clientMutationId
      store {
        id
        settings {
          labelPrinterAddress
        }
      }
    }
  }
`

export const updateDashboardSelection = operation`
  mutation updateDashboardSelection($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      clientMutationId
      store {
        id
        settings {
          enableNewDashboard
        }
      }
    }
  }
`
