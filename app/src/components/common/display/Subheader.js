//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/21/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import PropTypes from 'prop-types'

const fontSize = (textSizeOption) => {
  switch (textSizeOption) {
    default:
    case 1: return '26px'
    case 2: return '14px'
    case 3: return '13px'
    case 4: return '12px'
  }
}

const StyledSubheader = styled.div`
  box-sizing: border-box;
  padding: 0.8rem 1.6rem 0.8rem 0px;
  margin-top: 1.6rem;
  margin-bottom: 0.8rem;

  font-family: Roboto, sans-serif;
  font-size: ${props => fontSize(props.textSizeOption)};
  font-weight: ${props => (props.textSizeOption === 2 ? 'bold' : 500)};
  letter-spacing: ${props => (props.textSizeOption === 4 ? '0.9px' : '1px')};
  color: ${props => props.color};
  text-transform: ${props => (
    props.textSizeOption === 2 || props.textSizeOption === 3 ?
      'uppercase' : 'none'
  )};
`

const Subheader = ({ children, textSizeOption, color, style, className }) => (
  <StyledSubheader
    textSizeOption={textSizeOption}
    color={color}
    className={className}
    style={style}
  >
    {children}
  </StyledSubheader>
)

Subheader.propTypes = {
  children: PropTypes.node,
  // Size 1 is the largest, 4 is the smallest
  textSizeOption: PropTypes.oneOf([1, 2, 3, 4]),
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
}

Subheader.defaultProps = {
  children: null,
  textSizeOption: 1,
  color: colors.grayDark2,
  style: {},
}

export default Subheader
