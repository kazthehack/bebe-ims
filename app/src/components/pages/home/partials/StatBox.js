//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 01/23/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Box from 'components/common/container/Box'
import colors from 'styles/colors'

const StyledBox = styled(Box)`
  color: ${colors.blue};
  font-size: 30px;
  font-weight: 300;
  letter-spacing: 1px;
  height: 35px;
  margin: 5px;
`

const defaultBoxStyle = {
  height: '144px',
  width: '191px',
  textAlign: 'center',
  padding: 0,
}

const titleStyle = {
  margin: '22px 0 29px',
  padding: 0,
}

const StyledNumberFormat = styled(NumberFormat)`
  display: inline-block;
  height: 35px;
  line-height: 35px;
  letter-spacing: 1.1px;
`

const StatBox = ({ label, isMoney, value, className, innerBoxStyle }) => (
  <div className={className}>
    <StyledBox
      title={label}
      titleStyle={titleStyle}
      boxStyle={innerBoxStyle || defaultBoxStyle}
      subheaderTextSizeOption={2}
      subheaderColor={colors.blueishGray}
    >
      <StyledNumberFormat
        displayType="text"
        prefix={isMoney ? '$' : ''}
        value={value}
        thousandSeparator
        decimalScale={Number.isInteger(parseFloat(value)) ? 0 : 2}
      />
    </StyledBox>
  </div>
)

StatBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isMoney: PropTypes.bool,
  className: PropTypes.string,
  innerBoxStyle: PropTypes.object,
}

StatBox.defaultProps = {
  isMoney: true,
}

export default StatBox
