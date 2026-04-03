import PropTypes from 'prop-types'


// Used in compliance limits,
const Units = [
  { name: 'Grams', value: 'GRAMS' },
  { name: 'Each', value: 'EACH' },
  { name: 'Milliliters', value: 'MILLILITERS' },
  { name: 'Fluid Ounce', value: 'FLUID_OUNCES' },
]

export const unitsToSuffixMap = {
  GRAMS: 'g',
  EACH: 'ea',
  MILLILITERS: 'ml',
  FLUID_OUNCES: 'fl oz',
}

export const unitsDecimalRounding = {
  GRAMS: 2,
  EACH: 0,
}

export const updatedUnitOptions = [
  { name: 'Grams', value: 'g' },
  { name: 'Count', value: 'ea' },
]

export default Units

export const UnitsValues = Units.map(({ value }) => value)

export const UnitPropType = PropTypes.oneOf(UnitsValues)
