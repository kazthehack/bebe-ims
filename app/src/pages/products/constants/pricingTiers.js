export const PRICING_TIER_OPTIONS = [
  { value: 'regular_100', label: 'Regular - 100', displayLabel: 'Regular', defaultPrice: 100 },
  { value: 'special_150', label: 'Special 1 - 100', displayLabel: 'Special 1', defaultPrice: 100 },
  { value: 'special_200', label: 'Special 2 - 100', displayLabel: 'Special 2', defaultPrice: 100 },
  { value: 'premium_250', label: 'Premium 1 - 100', displayLabel: 'Premium 1', defaultPrice: 100 },
  { value: 'premium_300', label: 'Premium 2 - 100', displayLabel: 'Premium 2', defaultPrice: 100 },
  { value: 'premium_custom', label: 'Premium - 100', displayLabel: 'Premium (Custom)', defaultPrice: 100 },
  { value: 'discount_custom', label: 'Discount - 100', displayLabel: 'Discount (Custom)', defaultPrice: 100 },
]

export const defaultPriceForTier = (tierValue) => {
  const tier = PRICING_TIER_OPTIONS.find(option => option.value === tierValue)
  return tier ? tier.defaultPrice : null
}

export const displayLabelForTier = (tierValue) => {
  const tier = PRICING_TIER_OPTIONS.find(option => option.value === tierValue)
  return tier ? tier.displayLabel : (tierValue || 'N/A')
}
