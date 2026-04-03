import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormTextField } from 'components/common/input/TextField'

const StyledFormTextField = styled(FormTextField)`
  width: 320px;
  margin-left: 16px;
  margin-top: 5px;
`

const StyledDiv = styled.div`
  margin-top: 20px;
`

const OptionalInput = ({
  checkName,
  name,
  label,
  disabled,
  suffix,
  checked,
  validate,
  placeholder,
  tooltip,
  ...props
}) => {
  const conditionalText = (
    <StyledFormTextField
      name={name}
      type="text"
      suffix={suffix}
      disabled={disabled}
      validate={validate}
      placeholder={placeholder}
      {...props}
    />
  )

  return (
    <StyledDiv>
      <FormCheckbox
        label={label}
        name={checkName || `${name}Checked`}
        tooltip={tooltip}
        disabled={disabled}
      />
      <div style={{ marginLeft: '40px' }}>
        {checked && conditionalText}
      </div>
    </StyledDiv>
  )
}

OptionalInput.propTypes = {
  checkName: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  suffix: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  validate: PropTypes.func,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tooltip: PropTypes.node,
}

export default OptionalInput
