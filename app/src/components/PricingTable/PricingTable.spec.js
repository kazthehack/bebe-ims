import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Form } from 'react-final-form'
import { customPGPreTax as customPriceGroup } from 'utils/priceRowMappings.spec'
import { showTwoDecimals } from 'utils/currencyDecimal'
import mountWithMocks from 'utils/test/mountWithMocks'
import PricingTable, { changePriceList } from './PricingTable'

// props object for the pricingTable component
const propsObj = {
  values: {
    customPG: {
      ...customPriceGroup,
    },
  },
  tax: { percentage: 0.1, fixed: 0 },
  medTax: {},
  pre: true,
  table: 'customPG.prices.rec',
  uneditable: false,
  userPermissions: { read: true, write: true },
  archived: false,
  portalMedicalSame: false,
}

// Initial prices for the table
// (PricingTable component uses the form values and assumes they are already initialized)
const initialValues = {
  customPG: {
    ...customPriceGroup,
  },
}

// Sizes for the pricing table
const amounts = [
  '1 gram',
  '2 grams',
  '⅛ oz',
  '¼ oz',
  '½ oz',
  '1 oz',
]

// Mock onSubmit function
const onSubmit = jest.fn()

describe('<PricingTable />', () => {
  test('Pricing Table with pre-tax prices and editable fields', () => {
    // Mount the PricingTable component and its children
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ form, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PricingTable
                {...propsObj}
                changeForm={form.change}
              />
            </form>
          )}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow, rowIndex) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Active toggle
          const toggle = tableData.find('FormToggle')
          expect(toggle.exists()).toBe(true)
          expect(toggle.find('input[type="checkbox"]').props().value).toBe(customPriceGroup.prices.rec[rowIndex].portalActive)
        } else if (columnIndex === 1) { // Second column - Size
          const amount = tableData.find('div.rt-td')
          expect(amount.exists()).toBe(true)
          expect(amount.text()).toBe(amounts[rowIndex])
        } else if (columnIndex === 2) { // Third column - Base Price
          const basePrice = tableData.find('TextField')
          expect(basePrice.exists()).toBe(true)
          expect(basePrice.props().value).toBe(customPriceGroup.prices.rec[rowIndex].pre)
        } else if (columnIndex === 3) { // Fourth Column - Estimated Tax
          const estimatedTax = tableData.find('div.rt-td')
          expect(estimatedTax.exists()).toBe(true)
          expect(estimatedTax.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].tax)}`)
        } else if (columnIndex === 4) { // Fifth Column - Final Price
          const finalPrice = tableData.find('div.rt-td')
          expect(finalPrice.exists()).toBe(true)
          expect(finalPrice.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].post)}`)
        }
      })
    })
  })
  test('Pricing Table with post-tax prices and editable fields', () => {
    // Mount the PricingTable component and its children
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ form, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PricingTable
                {...propsObj}
                pre={false}
                changeForm={form.change}
              />
            </form>
          )}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow, rowIndex) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Active toggle
          const toggle = tableData.find('FormToggle')
          expect(toggle.exists()).toBe(true)
          expect(toggle.find('input[type="checkbox"]').props().value).toBe(customPriceGroup.prices.rec[rowIndex].portalActive)
        } else if (columnIndex === 1) { // Second column - Size
          const amount = tableData.find('div.rt-td')
          expect(amount.exists()).toBe(true)
          expect(amount.text()).toBe(amounts[rowIndex])
        } else if (columnIndex === 2) { // Third column - Base Price
          const basePrice = tableData.find('div.rt-td')
          expect(basePrice.exists()).toBe(true)
          expect(basePrice.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].pre)}`)
        } else if (columnIndex === 3) { // Fourth Column - Estimated Tax
          const estimatedTax = tableData.find('div.rt-td')
          expect(estimatedTax.exists()).toBe(true)
          expect(estimatedTax.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].tax)}`)
        } else if (columnIndex === 4) { // Fifth Column - Final Price
          const finalPrice = tableData.find('TextField')
          expect(finalPrice.exists()).toBe(true)
          expect(finalPrice.props().value).toBe(customPriceGroup.prices.rec[rowIndex].post)
        }
      })
    })
  })
  test('Pricing Table with uneditable fields', () => {
    // Mount the PricingTable component and its children
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ form, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PricingTable
                {...propsObj}
                uneditable
                changeForm={form.change}
              />
            </form>
          )}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow, rowIndex) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Size
          const amount = tableData.find('div.rt-td')
          expect(amount.exists()).toBe(true)
          expect(amount.text()).toBe(amounts[rowIndex])
        } else if (columnIndex === 1) { // Second column - Base Price
          const basePrice = tableData.find('div.rt-td')
          expect(basePrice.exists()).toBe(true)
          expect(basePrice.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].pre)}`)
        } else if (columnIndex === 2) { // Third Column - Estimated Tax
          const estimatedTax = tableData.find('div.rt-td')
          expect(estimatedTax.exists()).toBe(true)
          expect(estimatedTax.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].tax)}`)
        } else if (columnIndex === 3) { // Fourth Column - Final Price
          const finalPrice = tableData.find('div.rt-td')
          expect(finalPrice.exists()).toBe(true)
          expect(finalPrice.text()).toBe(`$${showTwoDecimals(customPriceGroup.prices.rec[rowIndex].post)}`)
        }
      })
    })
  })
  test('Pricing Table with pre-tax prices and disabled fields (no write permission)', () => {
    // Mount the PricingTable component and its children
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ form, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PricingTable
                {...propsObj}
                userPermissions={{ read: true, write: false }}
                changeForm={form.change}
              />
            </form>
          )}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Active toggle
          const toggle = tableData.find('FormToggle')
          expect(toggle.exists()).toBe(true)
          expect(toggle.props().disabled).toBe(true)
        } else if (columnIndex === 2) { // Third column - Base Price
          const basePrice = tableData.find('TextField')
          expect(basePrice.exists()).toBe(true)
          expect(basePrice.props().disabled).toBe(true)
        }
      })
    })
  })
  test('Pricing Table with post-tax prices and disabled fields (no write permission)', () => {
    // Mount the PricingTable component and its children
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ form, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PricingTable
                {...propsObj}
                pre={false}
                userPermissions={{ read: true, write: false }}
                changeForm={form.change}
              />
            </form>
          )}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Active toggle
          const toggle = tableData.find('FormToggle')
          expect(toggle.exists()).toBe(true)
          expect(toggle.props().disabled).toBe(true)
        } else if (columnIndex === 4) { // Fifth Column - Final Price
          const finalPrice = tableData.find('TextField')
          expect(finalPrice.exists()).toBe(true)
          expect(finalPrice.props().disabled).toBe(true)
        }
      })
    })
  })
})

// Helper function that sets the portalActive property of rows (whose index is passed here) to true
const activateToggles = (indexes) => {
  const newPrices = []
  customPriceGroup.prices.rec.forEach((row, index) => {
    newPrices.push({
      ...row,
      portalActive: indexes.includes(index),
    })
  })
  return newPrices
}

// `changePriceList` function used for updating price rows when an active price changes
describe('PricingTable: `changePriceList` function with PRE-tax prices', () => {
  test('All subsequent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '10.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 0, // The value of the first row is changed
      priceRows: activateToggles([0]), // Only the first row is active
      pricingScheme: 'pre',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated)
    expect(changeFormCalls.length).toBe(18)
    // Calls arguments for updating prices:
    // First row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('4.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('10.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('14.00')
    // Second row - Updated based on the first row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[3][1]).toBe('6.00')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[4][1]).toBe('20.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[5][1]).toBe('26.00')
    // Third row - Updated based on the first row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[6][1]).toBe('9.00')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[7][1]).toBe('35.00')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[8][1]).toBe('44.00')
    // Fourth Row - Updated based on the first row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[9][1]).toBe('16.00')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[10][1]).toBe('70.00')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[11][1]).toBe('86.00')
    // Fifth Row - Updated based on the first row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[12][1]).toBe('30.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[13][1]).toBe('140.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[14][1]).toBe('170.00')
    // Sixth Row - Updated based on the first row
    expect(changeFormCalls[15][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[15][1]).toBe('58.00')
    expect(changeFormCalls[16][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[16][1]).toBe('280.00')
    expect(changeFormCalls[17][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[17][1]).toBe('338.00')
  })
  test('Some subsequent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '10.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 0, // The value of the first row is changed
      priceRows: activateToggles([0, 3]), // First and fourth rows are active
      pricingScheme: 'pre',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated except the fourth row)
    expect(changeFormCalls.length).toBe(15)
    // Calls arguments for updating prices:
    // First row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('4.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('10.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('14.00')
    // Second row - Updated based on the first row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[3][1]).toBe('6.00')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[4][1]).toBe('20.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[5][1]).toBe('26.00')
    // Third row - Updated based on the first row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[6][1]).toBe('9.00')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[7][1]).toBe('35.00')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[8][1]).toBe('44.00')
    // Fifth Row - Updated based on the fourth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[9][1]).toBe('10.00')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[10][1]).toBe('40.00')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[11][1]).toBe('50.00')
    // Sixth Row - Updated based on the fourth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[12][1]).toBe('18.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[13][1]).toBe('80.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[14][1]).toBe('98.00')
  })
  test(' Only precedent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '50.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 4, // The value of the fifth row is changed
      priceRows: activateToggles([4, 5]), // Fifth and sixth rows are active
      pricingScheme: 'pre',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated except the sixth row)
    expect(changeFormCalls.length).toBe(15)
    // Calls arguments for updating prices:
    // Fifth row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[0][1]).toBe('12.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[1][1]).toBe('50.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[2][1]).toBe('62.00')
    // First row - Updated based on the fifth row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[3][1]).toBe('2.71')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[4][1]).toBe('3.57')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[5][1]).toBe('6.28')
    // Second row - Updated based on the fifth row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[6][1]).toBe('3.42')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[7][1]).toBe('7.14')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[8][1]).toBe('10.56')
    // Third Row - Updated based on the fifth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[9][1]).toBe('4.50')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[10][1]).toBe('12.50')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[11][1]).toBe('17.00')
    // Fourth Row - Updated based on the fifth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[12][1]).toBe('7.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[13][1]).toBe('25.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[14][1]).toBe('32.00')
  })
  test('Both precedent and subsequent inactive rows exist that should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '20.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 3, // The value of the fourth row is changed
      priceRows: activateToggles([3]), // Only the fourth row is active
      pricingScheme: 'pre',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated)
    expect(changeFormCalls.length).toBe(18)
    // Calls arguments for updating prices:
    // Fourth row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[0][1]).toBe('6.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[1][1]).toBe('20.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[2][1]).toBe('26.00')
    // First row - Updated based on the fourth row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[3][1]).toBe('2.57')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[4][1]).toBe('2.86')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[5][1]).toBe('5.43')
    // Second row - Updated based on the fourth row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[6][1]).toBe('3.14')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[7][1]).toBe('5.71')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[8][1]).toBe('8.85')
    // Third row - Updated based on the fourth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[9][1]).toBe('4.00')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[10][1]).toBe('10.00')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[11][1]).toBe('14.00')
    // Fifth Row - Updated based on the fourth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[12][1]).toBe('10.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[13][1]).toBe('40.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[14][1]).toBe('50.00')
    // Sixth Row - Updated based on the fourth row
    expect(changeFormCalls[15][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[15][1]).toBe('18.00')
    expect(changeFormCalls[16][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[16][1]).toBe('80.00')
    expect(changeFormCalls[17][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[17][1]).toBe('98.00')
  })
})

// POST-TAX
describe('PricingTable: changePriceList method with POST-tax prices', () => {
  test('All subsequent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '10.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 0, // The value of the first row is changed
      priceRows: activateToggles([0]), // Only the first row is active
      pricingScheme: 'post',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated)
    expect(changeFormCalls.length).toBe(18)
    // Calls arguments for updating prices:
    // First row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('3.33')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('6.67')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('10.00')
    // Second row - Updated based on the first row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[3][1]).toBe('5.00')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[4][1]).toBe('15.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[5][1]).toBe('20.00')
    // Third row - Updated based on the first row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[6][1]).toBe('7.50')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[7][1]).toBe('27.50')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[8][1]).toBe('35.00')
    // Fourth Row - Updated based on the first row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[9][1]).toBe('13.33')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[10][1]).toBe('56.67')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[11][1]).toBe('70.00')
    // Fifth Row - Updated based on the first row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[12][1]).toBe('25.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[13][1]).toBe('115.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[14][1]).toBe('140.00')
    // Sixth Row - Updated based on the first row
    expect(changeFormCalls[15][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[15][1]).toBe('48.33')
    expect(changeFormCalls[16][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[16][1]).toBe('231.67')
    expect(changeFormCalls[17][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[17][1]).toBe('280.00')
  })
  test('Some subsequent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '10.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 0, // The value of the first row is changed
      priceRows: activateToggles([0, 3]), // First and fourth rows are active
      pricingScheme: 'post',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated except the fourth row)
    expect(changeFormCalls.length).toBe(15)
    // Calls arguments for updating prices:
    // First row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('3.33')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('6.67')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('10.00')
    // Second row - Updated based on the first row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[3][1]).toBe('5.00')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[4][1]).toBe('15.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[5][1]).toBe('20.00')
    // Third row - Updated based on the first row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[6][1]).toBe('7.50')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[7][1]).toBe('27.50')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[8][1]).toBe('35.00')
    // Fifth Row - Updated based on the fourth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[9][1]).toBe('10.33')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[10][1]).toBe('41.67')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[11][1]).toBe('52.00')
    // Sixth Row - Updated based on the fourth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[12][1]).toBe('19.00')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[13][1]).toBe('85.00')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[14][1]).toBe('104.00')
  })
  test('Precedent inactive rows should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '50.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 4, // The value of the fifth row is changed
      priceRows: activateToggles([4, 5]), // Fifth and sixth rows are active
      pricingScheme: 'post',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated except the sixth row)
    expect(changeFormCalls.length).toBe(15)
    // Calls arguments for updating prices:
    // Fifth row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[0][1]).toBe('10.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[1][1]).toBe('40.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[2][1]).toBe('50.00')
    // First row - Updated based on the fifth row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[3][1]).toBe('2.26')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[4][1]).toBe('1.31')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[5][1]).toBe('3.57')
    // Second row - Updated based on the fifth row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[6][1]).toBe('2.85')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[7][1]).toBe('4.29')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[8][1]).toBe('7.14')
    // Third Row - Updated based on the fifth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[9][1]).toBe('3.75')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[10][1]).toBe('8.75')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[11][1]).toBe('12.50')
    // Fourth Row - Updated based on the fifth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[12][1]).toBe('5.83')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[13][1]).toBe('19.17')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[14][1]).toBe('25.00')
  })
  test('Both precedent and subsequent inactive rows exist that should be updated', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    changePriceList({
      value: '20.00',
      changeForm,
      tax: { percentage: 0.2, fixed: 2 },
      medTax: {},
      table: 'customPG.prices.rec',
      row: 3, // The value of the fourth row is changed
      priceRows: activateToggles([3]), // Only the fourth row is active
      pricingScheme: 'post',
      portalMedicalSame: false,
      deactivated: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls (All the rows get updated)
    expect(changeFormCalls.length).toBe(18)
    // Calls arguments for updating prices:
    // Fourth row - Changed
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[3].tax')
    expect(changeFormCalls[0][1]).toBe('5.00')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[3].pre')
    expect(changeFormCalls[1][1]).toBe('15.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[3].post')
    expect(changeFormCalls[2][1]).toBe('20.00')
    // First row - Updated based on the fourth row
    expect(changeFormCalls[3][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[3][1]).toBe('2.14')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[4][1]).toBe('0.72')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[5][1]).toBe('2.86')
    // Second row - Updated based on the fourth row
    expect(changeFormCalls[6][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[6][1]).toBe('2.61')
    expect(changeFormCalls[7][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[7][1]).toBe('3.10')
    expect(changeFormCalls[8][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[8][1]).toBe('5.71')
    // Third row - Updated based on the fourth row
    expect(changeFormCalls[9][0]).toBe('customPG.prices.rec[2].tax')
    expect(changeFormCalls[9][1]).toBe('3.33')
    expect(changeFormCalls[10][0]).toBe('customPG.prices.rec[2].pre')
    expect(changeFormCalls[10][1]).toBe('6.67')
    expect(changeFormCalls[11][0]).toBe('customPG.prices.rec[2].post')
    expect(changeFormCalls[11][1]).toBe('10.00')
    // Fifth Row - Updated based on the fourth row
    expect(changeFormCalls[12][0]).toBe('customPG.prices.rec[4].tax')
    expect(changeFormCalls[12][1]).toBe('8.33')
    expect(changeFormCalls[13][0]).toBe('customPG.prices.rec[4].pre')
    expect(changeFormCalls[13][1]).toBe('31.67')
    expect(changeFormCalls[14][0]).toBe('customPG.prices.rec[4].post')
    expect(changeFormCalls[14][1]).toBe('40.00')
    // Sixth Row - Updated based on the fourth row
    expect(changeFormCalls[15][0]).toBe('customPG.prices.rec[5].tax')
    expect(changeFormCalls[15][1]).toBe('15.00')
    expect(changeFormCalls[16][0]).toBe('customPG.prices.rec[5].pre')
    expect(changeFormCalls[16][1]).toBe('65.00')
    expect(changeFormCalls[17][0]).toBe('customPG.prices.rec[5].post')
    expect(changeFormCalls[17][1]).toBe('80.00')
  })
})
