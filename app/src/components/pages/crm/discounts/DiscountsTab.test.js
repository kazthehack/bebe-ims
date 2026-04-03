// TODO: add more test coverage
import { createWaitForElement, mountWithMocks, getLoggedInEmployeeMockedResponse } from 'utils/test'
import { fetchDiscounts } from 'ops'
import { Table } from 'components/Table'
import { DiscountsList } from './DiscountsTab'

describe('<DiscountsTab />', () => {
  it('should render a DiscountsList', (done) => {
    const id = 1
    const name = 'testDiscount'
    const amount = '30'
    const appliesTo = 'SUBTOTAL'
    const amountType = 'PERCENTAGE'
    const active = true
    const requiresApproval = true
    const category = 'AMOUNT'
    const archivedDate = null

    const component = mountWithMocks(DiscountsList, [{
      request: {
        query: fetchDiscounts,
        variables: {
          storeID: 'U3RvcmU6MQ==',
        },
      },
      result: {
        data: {
          store: {
            id: 'U3RvcmU6MQ==',
            discounts: {
              edges: [
                {
                  node: {
                    id,
                    archivedDate,
                    name,
                    amount,
                    appliesTo,
                    amountType,
                    active,
                    requiresApproval,
                    category,
                    __typename: 'Discount',
                  },
                  __typename: 'DiscountEdge',
                },
              ],
              __typename: 'DiscountConnection',
            },
            __typename: 'Store',
          },
        },
      },
      getLoggedInEmployeeMockedResponse,
    }], { venues: { selectedId: 'U3RvcmU6MQ==' } })

    // expect(component.text()).toContain('Loading...') // TODO update for Spinner
    const waitForDiscounts = createWaitForElement('.DiscountsListPure')

    return waitForDiscounts(component).then(() => {
      // Should have 5 columns on the header
      const tableColumns = component.find(Table).find('.rt-th')
      expect(tableColumns).toHaveLength(5)

      // Should have 5 columns for each row
      const items = component.find(Table).find('.rt-td')
      expect(items).toHaveLength(5)

      // Active column
      expect(items.first().text()).toEqual('')
      expect(items.at(1).text()).toEqual('testDiscount')
      // As amount = '30' and amountType = 'PERCENTAGE', should display 30% off
      expect(items.at(2).text()).toEqual('30% off')
      expect(items.at(3).text()).toEqual('Subtotal')
      // requiresApproval = true
      expect(items.at(4).text()).toEqual('Yes')

      done()
    })
  })
})
