import { updateRowPrices } from './priceGroup'

const constMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med',
  TAX: 'tax',
  ACTIVE: 'portalActive',
}

// Multiple-row pricing tables
describe('updateRowPrices for multiple-row pricing tables', () => {
  test('PRE-TAX pricing with portalMedicalSame set to `true`', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 5,
      table: 'customPG.prices.rec',
      rowIndex: 0,
      constMap,
      recTax: { percentage: 0.1, fixed: 2 },
      medTax: { percentage: 0.05, fixed: 1 },
      pricingScheme: 'pre',
      portalMedicalSame: true,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(6)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('2.50')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('5.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('7.50')
    // Calls arguments for updating medical prices
    expect(changeFormCalls[3][0]).toBe('customPG.prices.med[0].tax')
    expect(changeFormCalls[3][1]).toBe('1.25')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.med[0].pre')
    expect(changeFormCalls[4][1]).toBe('5.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.med[0].post')
    expect(changeFormCalls[5][1]).toBe('6.25')
  })

  test('PRE-TAX pricing with portalMedicalSame set to `false`', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10.99,
      table: 'customPG.prices.rec',
      rowIndex: 1,
      constMap,
      recTax: { percentage: 0.15, fixed: 2 },
      medTax: { percentage: 0.1, fixed: 1.5 },
      pricingScheme: 'pre',
      portalMedicalSame: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(3)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[0][1]).toBe('3.64')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[1][1]).toBe('10.99')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[2][1]).toBe('14.63')
  })

  test('POST-TAX pricing with portalMedicalSame set to `true`', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10,
      table: 'customPG.prices.rec',
      rowIndex: 0,
      constMap,
      recTax: { percentage: 0.2, fixed: 0 },
      medTax: { percentage: 0.04, fixed: 0.5 },
      pricingScheme: 'post',
      portalMedicalSame: true,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(6)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[0].tax')
    expect(changeFormCalls[0][1]).toBe('1.66')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[0].pre')
    expect(changeFormCalls[1][1]).toBe('8.34')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[0].post')
    expect(changeFormCalls[2][1]).toBe('10.00')
    // Calls arguments for updating medical prices
    expect(changeFormCalls[3][0]).toBe('customPG.prices.med[0].tax')
    expect(changeFormCalls[3][1]).toBe('0.83')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.med[0].pre')
    expect(changeFormCalls[4][1]).toBe('8.34')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.med[0].post')
    expect(changeFormCalls[5][1]).toBe('9.17')
  })

  test('POST-TAX pricing with portalMedicalSame set to `false`', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10.77,
      table: 'customPG.prices.rec',
      rowIndex: 1,
      constMap,
      recTax: { percentage: 0.15, fixed: 2.5 },
      medTax: { percentage: 0, fixed: 1.5 },
      pricingScheme: 'post',
      portalMedicalSame: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(3)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec[1].tax')
    expect(changeFormCalls[0][1]).toBe('3.57')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec[1].pre')
    expect(changeFormCalls[1][1]).toBe('7.20')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec[1].post')
    expect(changeFormCalls[2][1]).toBe('10.77')
  })
})

// Single-row pricing tables
describe('updateRowPrices for single-row pricing tables', () => {
  test('PRE-TAX pricing with portalMedicalSame set to `true` and no row index', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 5,
      table: 'customPG.prices.rec',
      constMap,
      recTax: { percentage: 0.1, fixed: 2 },
      medTax: { percentage: 0.05, fixed: 1 },
      pricingScheme: 'pre',
      portalMedicalSame: true,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(6)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec.tax')
    expect(changeFormCalls[0][1]).toBe('2.50')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec.pre')
    expect(changeFormCalls[1][1]).toBe('5.00')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec.post')
    expect(changeFormCalls[2][1]).toBe('7.50')
    // Calls arguments for updating medical prices
    expect(changeFormCalls[3][0]).toBe('customPG.prices.med.tax')
    expect(changeFormCalls[3][1]).toBe('1.25')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.med.pre')
    expect(changeFormCalls[4][1]).toBe('5.00')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.med.post')
    expect(changeFormCalls[5][1]).toBe('6.25')
  })

  test('PRE-TAX pricing with portalMedicalSame set to `false` and no row index', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10.99,
      table: 'customPG.prices.rec',
      constMap,
      recTax: { percentage: 0.15, fixed: 2 },
      medTax: { percentage: 0.1, fixed: 1.5 },
      pricingScheme: 'pre',
      portalMedicalSame: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(3)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec.tax')
    expect(changeFormCalls[0][1]).toBe('3.64')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec.pre')
    expect(changeFormCalls[1][1]).toBe('10.99')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec.post')
    expect(changeFormCalls[2][1]).toBe('14.63')
  })

  test('POST-TAX pricing with portalMedicalSame set to `true` and no row index', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10,
      table: 'customPG.prices.rec',
      constMap,
      recTax: { percentage: 0.2, fixed: 0 },
      medTax: { percentage: 0.04, fixed: 0.5 },
      pricingScheme: 'post',
      portalMedicalSame: true,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(6)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec.tax')
    expect(changeFormCalls[0][1]).toBe('1.66')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec.pre')
    expect(changeFormCalls[1][1]).toBe('8.34')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec.post')
    expect(changeFormCalls[2][1]).toBe('10.00')
    // Calls arguments for updating medical prices
    expect(changeFormCalls[3][0]).toBe('customPG.prices.med.tax')
    expect(changeFormCalls[3][1]).toBe('0.83')
    expect(changeFormCalls[4][0]).toBe('customPG.prices.med.pre')
    expect(changeFormCalls[4][1]).toBe('8.34')
    expect(changeFormCalls[5][0]).toBe('customPG.prices.med.post')
    expect(changeFormCalls[5][1]).toBe('9.17')
  })

  test('POST-TAX pricing with portalMedicalSame set to `false` and no row index', () => {
    const changeForm = jest.fn((fieldName, value) => `${fieldName}: ${value}`)
    updateRowPrices({
      changeForm,
      value: 10.77,
      table: 'customPG.prices.rec',
      constMap,
      recTax: { percentage: 0.15, fixed: 2.5 },
      medTax: { percentage: 0, fixed: 1.5 },
      pricingScheme: 'post',
      portalMedicalSame: false,
    })
    const changeFormCalls = changeForm.mock.calls
    // Total number of calls
    expect(changeFormCalls.length).toBe(3)
    // Calls arguments for updating recreational prices
    expect(changeFormCalls[0][0]).toBe('customPG.prices.rec.tax')
    expect(changeFormCalls[0][1]).toBe('3.57')
    expect(changeFormCalls[1][0]).toBe('customPG.prices.rec.pre')
    expect(changeFormCalls[1][1]).toBe('7.20')
    expect(changeFormCalls[2][0]).toBe('customPG.prices.rec.post')
    expect(changeFormCalls[2][1]).toBe('10.77')
  })
})
