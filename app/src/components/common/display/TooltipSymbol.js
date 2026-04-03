import React from 'react'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import { Icon } from 'components/common/display'

const TooltipSymbol = ({ color = colors.black, icon = 'bloom-information' }) => (
  <Icon name={icon} aria-hidden="true" style={{ color }} />
)

TooltipSymbol.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
}

export default TooltipSymbol
