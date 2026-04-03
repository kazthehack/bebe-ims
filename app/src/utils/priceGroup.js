import { get, isObject } from 'lodash'
import BigNumber from 'bignumber.js'

const ZERO = new BigNumber('0.00')

/**
 * Calculate the tax amount given the base price and tax rules
 * Mimicks the behavior of the POS for more accurate estimates
 *
 * @param {BigNumber} basePrice: Required - The pre-tax price
 * @param {{percentage: String, fixed: String}} tax: Required - Applied taxes
 *
 * @return {BigNumber} Calculated tax in dollar amount
 */
const calculateTaxForBasePrice = (basePrice, tax) => basePrice
  .times(tax.percentage) // Calculate precentage tax in dollar amount
  .plus(tax.fixed) // Add fixed tax
  .dp(3) // Round to 3 decimaals using true rounding to get rid of .9999~ or .0001~ precision
  .dp(2, BigNumber.ROUND_DOWN) // Round DOWN to the nearest cent

/**
 * Calculate the base price given the final price and tax rules
 * Mimicks the behavior of the POS for more accurate estimates
 *
 * @param {BigNumber} finalPrice: Required - The post-tax price
 * @param {{percentage: String, fixed: String}} Required - Applied taxes
 *
 * @return {BigNumber} Base Price
 */
const calculateBasePrice = (finalPrice, tax) => finalPrice
  .minus(tax.fixed)
  .dividedBy(new BigNumber(tax.percentage).plus(1))
  .dp(3) // Round to 3 decimaals using true rounding to get rid of .9999~ or .0001~ precision
  .dp(2, BigNumber.ROUND_UP)

export const initializePriceRows = (priceGroup, taxObj, preScheme) => {
  const prices = get(priceGroup, 'prices', [])
  // This if doesn't catch when it should if the price group doesn't have any rows, which happens
  // only for old broken price groups. Not going to fix for now.
  if (get(prices, 'rec', []).length > 0) return priceGroup
  const medPrices = []
  const recPrices = []
  prices.forEach(({ customerType, price, ...rest }) => {
    // TODO: Make reusable util for this
    const currentTax = customerType === 'MEDICAL' ? taxObj.med : taxObj.rec
    let basePrice = ZERO
    let finalPrice = ZERO
    let taxAmount = ZERO
    if (preScheme) {
      basePrice = new BigNumber(price.amount) // Get Base Price
      taxAmount = calculateTaxForBasePrice(basePrice, currentTax)
      finalPrice = basePrice.plus(taxAmount).dp(2) // Just to be safe
    } else { // Post tax
      finalPrice = new BigNumber(price.amount) // Get Final Price
      basePrice = calculateBasePrice(finalPrice, currentTax)
      taxAmount = finalPrice.minus(basePrice).dp(2) // Just to be safe
    }
    const newPrice = {
      pre: basePrice.toFixed(2),
      post: finalPrice.toFixed(2),
      tax: taxAmount.toFixed(2),
      ...rest,
    }
    if (customerType === 'MEDICAL') {
      medPrices.push(newPrice)
    } else {
      recPrices.push(newPrice)
    }
  })
  return Object.assign(priceGroup, { prices: { rec: recPrices, med: medPrices } })
}

// Calculates the tax and prices for a given base OR final price
export const calculatePrices = ({
  value, // The edited value
  tax, // The tax used to calculate the edited value's tax
  pricingScheme,
}) => {
  if (!value || !isObject(tax)) {
    return {
      basePrice: undefined,
      newTax: undefined,
      finalPrice: undefined,
    }
  }
  const isPreTax = pricingScheme === 'pre'
  const isPostTax = pricingScheme === 'post'

  const newValue = new BigNumber(value)
  if (newValue.isNaN() || newValue.lt(ZERO) || (isPostTax && newValue.lt(tax.fixed))) {
    return {
      basePrice: isPreTax ? undefined : 'Invalid',
      newTax: 'Invalid',
      finalPrice: isPostTax ? undefined : 'Invalid',
    }
  }

  if (isPreTax) { // if pre tax pricing scheme
    const taxAmount = calculateTaxForBasePrice(newValue, tax)
    const finalPrice = newValue.plus(taxAmount).dp(2)
    return {
      basePrice: newValue.toFixed(2),
      newTax: taxAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    }
  }
  if (isPostTax) { // post tax pricing scheme
    const basePrice = calculateBasePrice(newValue, tax)
    const taxAmount = newValue.minus(basePrice).dp(2)
    return {
      basePrice: basePrice.toFixed(2),
      newTax: taxAmount.toFixed(2),
      finalPrice: newValue.toFixed(2),
    }
  }
  // If pricingScheme is neither `pre` nor `post`
  return {
    basePrice: undefined,
    newTax: undefined,
    finalPrice: undefined,
  }
}

// Updatea the price fields and taxes in the pricing table using the calculatePrices function
export const updateRowPrices = ({
  changeForm,
  value,
  table,
  rowIndex,
  constMap,
  recTax,
  medTax,
  pricingScheme,
  portalMedicalSame,
}) => {
  // find the table field name
  let tableField = typeof rowIndex === 'number' ? `${table}[${rowIndex}]` : table

  // Calculate the tax
  const {
    basePrice: recBasePrice,
    newTax: newRecTax,
    finalPrice: recFinalPrice,
  } = calculatePrices({
    value,
    tax: recTax,
    pricingScheme,
  })
  // Update the recreational pricing table
  changeForm(`${tableField}.${constMap.TAX}`, newRecTax)
  changeForm(`${tableField}.${constMap.PRE}`, recBasePrice)
  changeForm(`${tableField}.${constMap.POST}`, recFinalPrice)

  // Update the medical pricing table if medicalSame checkbox is checked
  if (portalMedicalSame) {
    tableField = typeof rowIndex === 'number' ? `${constMap.MED}[${rowIndex}]` : constMap.MED
    const {
      basePrice: medBasePrice,
      newTax: newMedTax,
      finalPrice: medFinalPrice,
    } = calculatePrices({
      value: recBasePrice,
      tax: medTax,
      pricingScheme: 'pre',
    })
    changeForm(`${tableField}.${constMap.TAX}`, newMedTax)
    changeForm(`${tableField}.${constMap.PRE}`, medBasePrice)
    changeForm(`${tableField}.${constMap.POST}`, medFinalPrice)
  }

  return pricingScheme === 'pre' ? recBasePrice : recFinalPrice
}

// Updates the estimated tax in pricing tables using the updateRowPrices function
export const updateTax = ({
  changeForm,
  tax,
  medTax,
  table,
  portalMedicalSame,
  constMap,
  flower,
  values,
  preScheme,
}) => {
  if (flower) {
    get(values, table).forEach((obj, index) => {
      updateRowPrices({
        changeForm,
        value: preScheme ? obj.pre : obj.post,
        table,
        rowIndex: index,
        constMap,
        recTax: tax,
        medTax,
        pricingScheme: preScheme ? 'pre' : 'post',
        portalMedicalSame,
      })
    })
  } else {
    updateRowPrices({
      changeForm,
      value: preScheme ? get(values, table).pre : get(values, table).post,
      table,
      constMap,
      recTax: tax,
      medTax,
      pricingScheme: preScheme ? 'pre' : 'post',
      portalMedicalSame,
    })
  }
}

// Update the prices in the medical pricing table according to the recreational prices
// when the medicalSame checkbox is checked
export const updateValuesOnMedicalSameChecked = ({
  changeForm,
  values,
  constMap,
  valuePath,
  tax,
  single,
}) => {
  if (single) { // If this is for a singleRowPricingTable
    changeForm('customPG.prices.med[0].quantityAmount', values.customPG.prices.rec[0].quantityAmount)
    // TODO: not sure if this line should be conditional on if the pricegroup is liquid
    changeForm('customPG.prices.med[0].volumeAmount', values.customPG.prices.rec[0].volumeAmount)
    updateRowPrices({
      changeForm,
      value: get(values, `${valuePath}.pre`),
      table: constMap.MED,
      constMap,
      recTax: tax,
      pricingScheme: 'pre',
    })
  } else { // Else this is for a regular pricing table
    values.customPG.prices.med.forEach((row, i) => {
      // Whether post or pre, when the box is checked we use the base price and move to final price
      updateRowPrices({
        changeForm,
        value: get(values, `${valuePath}.${i}.pre`),
        table: constMap.MED,
        rowIndex: i,
        constMap,
        recTax: tax,
        pricingScheme: 'pre',
      })
    })
  }
}

// Utility function to change price from format that FinalForm uses to a format that the back-end
// accepts used by both Price Group mutations and Product mutations
export const zipPriceRows = (preScheme, customPG) => {
  const zippedPrices = []
  customPG.prices.rec.forEach(({
    id,
    quantityAmount,
    pre,
    volumeAmount,
    post,
    portalActive,
  }) => {
    if (pre) {
      zippedPrices.push({
        ...(customPG.id !== '-1' && { id }),
        customerType: 'RECREATIONAL',
        quantityAmount,
        volumeAmount,
        price: preScheme ? pre : post,
        portalActive,
      })
    }
  })
  customPG.prices.med.forEach(({
    id,
    quantityAmount,
    pre,
    volumeAmount,
    post,
    portalActive,
  }) => {
    if (pre) {
      zippedPrices.push({
        ...(customPG.id !== '-1' && { id }),
        customerType: 'MEDICAL',
        quantityAmount,
        volumeAmount,
        price: preScheme ? pre : post,
        portalActive,
      })
    }
  })
  return zippedPrices
}

// This function returns the values of the non-fields in the correct format.
export const displayNonFields = (values, field) => {
  const value = get(values, field, '0.00')
  return value === 'Invalid' ? value : `$${value}`
}
