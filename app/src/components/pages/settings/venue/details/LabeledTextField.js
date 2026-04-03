//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 01/23/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import LabeledInput from './LabeledInput'

const LabeledTextField = (props) => {
  const { className, label, name, labelStyle, ...otherProps } = props

  return (
    <LabeledInput className={className} label={label} name={name} labelStyle={labelStyle}>
      <FormTextField type="text" name={name} {...otherProps} />
    </LabeledInput>
  )
}

LabeledTextField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
}

export default styled(LabeledTextField)`
  input {
    max-width: 320px;
  }
`
