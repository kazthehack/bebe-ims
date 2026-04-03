import React from 'react'
import PropTypes from 'prop-types'
import { Line } from 'rc-progress'
import colors from 'styles/colors'
import styled from 'styled-components'
import { unitsDecimalRounding } from 'constants/Units'

const Wrap = styled.div`
  text-align: center;
`

const BarLabel = styled.span`
  text-align: center;
  font-size: 12px;
  color: ${colors.grayDark2};
  width: 100%;
  float: right;
  clear: both;
`

const FillBar = ({
  amount = 0,
  total = 1,
  unit = 'g',
  strokeWidth = 3,
  strokeColor = colors.blue,
  trailWidth = 3,
  trailColor = colors.grayLight2,
  style,
  ...props
}) => {
  let finalUnit = unit
  if (finalUnit === 'GRAMS') finalUnit = 'g'
  if (finalUnit === 'EACH') finalUnit = 'ea'
  const decimalsRounded = unitsDecimalRounding[unit]
  const label = finalUnit && `${amount.toFixed(decimalsRounded)} ${finalUnit} / ${total.toFixed(decimalsRounded)} ${finalUnit}`
  let fillPercent = (amount / total) * 100
  fillPercent = Math.min(fillPercent, 100) // if fill percent is greater than 100 cap it at 100
  fillPercent = Math.max(fillPercent, 0) // if fill percent is less than 0 cap it at 0
  return (
    <Wrap style={style}>
      <Line
        percent={fillPercent}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        trailWidth={trailWidth}
        trailColor={trailColor}
        {...props}
      />
      <BarLabel>{label}</BarLabel>
    </Wrap>
  )
}

FillBar.propTypes = {
  ...Line.propTypes,
  amount: PropTypes.number,
  total: PropTypes.number,
  units: PropTypes.string,
  style: PropTypes.object,
}

export default FillBar
