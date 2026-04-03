import PropTypes from 'prop-types'
import { CustomerTypePropType } from 'constants/CustomerTypes'
import { UnitPropType } from 'constants/Units'

const ComplianceModel = PropTypes.shape({
  name: PropTypes.string,
  id: PropTypes.string,
  customerType: CustomerTypePropType,
  limitQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: UnitPropType,
})

export default ComplianceModel
