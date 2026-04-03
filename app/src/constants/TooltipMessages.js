import React from 'react'

export const pricingScheme = (
  <div>
    Pricing scheme defines the pre-tax or post-tax price for products.
    <br /><br />
    Changing this should only be done
    if the user has complete understanding of how this affects pricing.
    <br /><br />
    If set to post and switched to pre-tax,
    your base price is now represented by the post-tax price.
    If set to pre-tax and switched to post-tax,
    base price is now the post-tax price.
  </div>
)

export const estimatedTax = 'The tax value might end up being a cent off in an actual sale due to partial cents.'
export const estimatedBasePrice = 'The base price value might end up being a cent off in an actual sale due to partial cents.'
export const estimatedFinalPrice = 'The amount that the customer pays might end up being a cent off in an actual sale due to partial cents.'
export const customPricing = 'You can set custom price breaks at certain pre-defined increments otherwise the price will be set by the previous price per gram rate.'
export const recreationalPricing = 'Recreational customer pricing is affected by recreational taxes for the selected sales type.'
export const medicalPricing = 'Medical patient pricing is the pricing for a medical customer. It\'s affected by medical taxes for the selected sales type.'
export const medicalSame = 'If checked, medical prices will be calculated using the base prices defined above.'
export const sourceProducer = 'Law requires labels to include the entity which a product was retrieved from if not the original source.'
export const packageCost = 'Package cost is the value used to calculate the package\'s ROI.'
