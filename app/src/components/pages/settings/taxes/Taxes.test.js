import { createWaitForElement, mountWithMocks, getLoggedInEmployeeMockedResponse } from 'utils/test'
import { getTaxList } from 'ops/tax'
import { fetchVenueSettings } from 'ops'
import { TaxList } from './Taxes'

describe('<Taxes />', () => {
  it('should render a TaxList', (done) => {
    const name = 'Ashley Mcknight'
    const amount = '88.48'
    const appliesTo = 'SUBTOTAL'
    const customerType = 'RECREATIONAL'

    const component = mountWithMocks(TaxList, [{
      request: {
        query: fetchVenueSettings,
        variables: {
          storeID: '1',
        },
      },
      result: {
        data: {
          store: {
            id: 'U3RvcmU6MQ==',
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
    }, {
      request: {
        query: getTaxList,
        variables: {
          storeID: '1',
          includeTaxArchives: false,
        },
      },
      result: {
        data: {
          store: {
            id: 'U3RvcmU6MQ==',
            taxes: {
              edges: [
                {
                  node: {
                    id: '1337',
                    name,
                    amount,
                    appliesTo,
                    amountType: 'FIXED',
                    customerType,
                    active: true,
                    archivedDate: null,
                    salesTypes: [
                      { id: '7331', __typename: 'SalesType' },
                    ],
                    __typename: 'Tax',
                  },
                  __typename: 'TaxEdge',
                },
              ],
              __typename: 'TaxConnection',
            },
            __typename: 'Store',
          },
        },
      },
    },
    getLoggedInEmployeeMockedResponse,
    ], { venues: { selectedId: '1' } })

    const waitForTaxes = createWaitForElement('.TaxListPure')

    return waitForTaxes(component).then(() => {
      expect(component.text()).toContain(name)
      expect(component.text()).toContain(amount)
      expect(component.text().toUpperCase()).toContain(appliesTo)
      expect(component.text().toUpperCase()).toContain(customerType)
      done()
    })
  })
})
