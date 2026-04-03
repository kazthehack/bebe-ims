import PropTypes from 'prop-types'

// TODO: find better place for common PropTypes like these?
export const appliesToPropType = PropTypes.oneOf(['SUBTOTAL', 'ITEM'])
export const amountTypePropType = PropTypes.oneOf(['PERCENTAGE', 'FIXED'])
export const customerTypePropType = PropTypes.oneOf(['ANY', 'MEDICAL', 'RECREATIONAL'])

// TODO: maybe organize this with other "sales" or "sales type" functionality?
export const SalesTypeModel = PropTypes.shape({
  name: PropTypes.string,
})

export const TaxModel = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  amount: PropTypes.string,
  appliesTo: appliesToPropType,
  amountType: amountTypePropType,
  customerType: customerTypePropType,
  salesTypes: PropTypes.arrayOf(SalesTypeModel),
})
