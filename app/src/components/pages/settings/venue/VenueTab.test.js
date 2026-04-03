import { createWaitForElement, mountWithMocks, getLoggedInEmployeeMockedResponse } from 'utils/test'
import { fetchVenueSettings } from 'ops'
import Button from 'components/common/input/Button'
import { VenueTab } from './VenueTab'

const STORE_ID = '1'

describe('<VenueTab />', () => {
  it('should be able to toggle edit state', (done) => {
    const component = mountWithMocks(VenueTab, [
      {
        request: {
          query: fetchVenueSettings,
          variables: {
            storeID: STORE_ID,
          },
        },
        result: {
          data: {
            store: {
              id: STORE_ID,
              name: 'Store',
              logoUrl: '',
              receiptTagline: '',
              packagesLastImportedAt: '1970-01-01',
              owner: {
                id: 'someID??',
                name: 'someNAME??',
                __typename: 'Employee',
              },
              address: '123 Store St',
              addressExtra: null,
              city: 'Storeville',
              state: 'ST',
              zipCode: '12345',
              phone: '123-456-7890',
              website: 'http://store.biz',
              timezone: 'Greenwich',
              settings: {
                runReportsAt: '1970-01-01',
                pricingScheme: 'POST_TAX',
                pinLength: 4,
                enableDareMode: false,
                allowDashboardSelection: false,
                enableNewDashboard: false,
                __typename: 'StoreSettings',
              },
              posSettings: {
                useWeightHeavy: false,
                useSplitPricing: true,
                weightHeavyQuantity: 0,
                usePackageFinishThreshold: false,
                packageFinishThreshold: 0,
                usePosAutoLogout: false,
                posAutoLogoutMinutes: 0,
                openCashDrawerRequiresManager: false,
                enableReceiptPrint: false,
                logoutAfterSale: false,
                ageCheck: 21,
                useForceAgeCheck: false,
                labelPrintTiming: 'ON_WEIGH',
                metrcDelayMins: 5,
                __typename: 'POSSettings',
              },
              integrations: {
                metrc: {
                  licenseNumber: 666,
                  userKey: 'foobar',
                  readOnly: false,
                  __typename: 'Integration',
                },
                __typename: 'Integrations',
              },
              __typename: 'Store',
            },
          },
        },
      },
      getLoggedInEmployeeMockedResponse,
    ], { venues: { selectedId: STORE_ID } })

    const waitForTab = createWaitForElement('.VenueTabPure')
    return waitForTab(component).then(() => {
      const form = component.find('.VenueTabPure')
      expect(form).toHaveLength(1)

      // Edit mode
      const storeLogoButton = component.find('#storeInfo').find(Button)
      expect(storeLogoButton.text()).toContain('UPLOAD LOGO')
      storeLogoButton.simulate('click')

      const editButton = component.find('#footerButtons').find(Button).filter('#editButton')
      expect(editButton.text()).toContain('Edit')
      editButton.simulate('click')

      // Save and Cancel Buttons should be shown after the edit button click event
      const saveButton = component.find(Button).at(2)
      expect(saveButton.text()).toContain('Save')
      saveButton.simulate('click')

      const cancelButton = component.find(Button).at(1)
      expect(cancelButton.text()).toContain('Cancel')
      cancelButton.simulate('click')

      done()
    })
  })
})
