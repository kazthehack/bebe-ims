import PropTypes from 'prop-types'

const CustomerTypes = [
  { name: 'Recreational', value: 'RECREATIONAL' },
  { name: 'Medical', value: 'MEDICAL' },
]

export default CustomerTypes

export const CustomerTypesValues = CustomerTypes.map(({ value }) => value)

export const CustomerTypePropType = PropTypes.oneOf(CustomerTypesValues)
