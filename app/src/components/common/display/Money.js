import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'
import React from 'react'

const Money = ({ value }) => (
  <NumberFormat value={value} decimalScale={2} thousandSeparator prefix="$" displayType="text" />
)

Money.propTypes = {
  value: PropTypes.number.isRequired,
}

export default Money
