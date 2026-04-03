//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 01/23/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  width: 150px;
  color: ${colors.grayDark2};
`

const containerStyle = {
  padding: 0,
}

const LabeledInput = (props) => {
  const { className, label, name, labelStyle, style: styleProp, children } = props
  const style = { ...containerStyle, ...styleProp }

  return (
    <div className={className} style={style}>
      { typeof label !== 'undefined' ? <StyledLabel htmlFor={name} style={labelStyle}>{label}</StyledLabel> : null }
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}

LabeledInput.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
}

LabeledInput.defaultProps = {
  style: {},
}

export default styled(LabeledInput)`
  display: flex;
`
