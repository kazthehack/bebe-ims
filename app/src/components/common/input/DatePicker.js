import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import { ProductIcon } from 'components/common/display/ProductIcon'
import colors from 'styles/colors'
import TextField, { FormTextField, LibDatePicker } from './TextField'

// TODO - find a library for datetime - or wait for firefox to support it >.<

const Container = styled.div`
  height: 40px;
  input {
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const StyledLabel = styled.label`
  width: 136px;
  height: 40px;
  display: inline-block;
`

// TODO: refactor this to clean up and simplify this component
const DatePicker = ({
  view = 'date',
  label = '',
  labelStyle = {},
  inputStyle = {},
  disabled = false,
  className,
  ...props
}) => {
  let type = ''
  let iconType = 'calendar'
  switch (view) {
    case 'year':
      type = 'number'
      break
    case 'date':
      type = 'date'
      break
    case 'time':
      type = 'time'
      iconType = 'clock'
      break
    default:
      type = 'date'
      break
  }
  const Label = (
    <StyledLabel style={labelStyle} >{label}</StyledLabel>
  )
  return (
    <Container className={className} >
      {label ? Label : null}
      <TextField
        suffix={<ProductIcon type={iconType} />}
        disabled={disabled}
        type={type}
        style={inputStyle}
        {...props}
      />
    </Container>
  )
}

DatePicker.propTypes = {
  view: PropTypes.oneOf(['year', 'date', 'time']),
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  className: PropTypes.string,
}

const StyledDiv = styled.div`
  input {
    width: 105px;
    &::-webkit-clear-button {
      display: none;
    }
    &::-webkit-inner-spin-button {
      display: none;
    }
    $::-webkit-calendar-picker-indicator {
      display: none;
    }
  }
`

export const FormTimeField = ({ name, placeholder = '23:00', validate, disabled, className, ...props }) => (
  <StyledDiv>
    <FormTextField
      suffix={<ProductIcon type="clock" />}
      disabled={disabled}
      validate={validate}
      placeholder={placeholder}
      name={name}
      {...props}
      type="time"
    />
  </StyledDiv>
)

FormTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  validate: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

const ErrorSpan = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
  margin-top: 2px;
  margin-left: 24px;
  font-weight: normal;
  line-height: 14px;
  display: 'block';
`

export const FormDatePicker = ({
  name,
  validate,
  errorText = false,
  leftArrowClick,
  rightArrowClick,
  isMandatory = false,
  fieldContainerStyle,
  ...props
}) => (
  <Field
    name={name}
    validate={validate}
    render={({ input, meta }) => (
      <div style={{ width: '100%', maxWidth: '320px', ...fieldContainerStyle }}>
        <LibDatePicker
          meta={meta}
          selected={input.value}
          leftArrowClick={leftArrowClick}
          rightArrowClick={rightArrowClick}
          isMandatory={isMandatory}
          {...input}
          {...props}
        />
        {errorText && meta.error && meta.touched && <ErrorSpan>{meta.error}</ErrorSpan>}
      </div>
    )}
  />
)

FormDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.func,
  errorText: PropTypes.bool,
  leftArrowClick: PropTypes.func,
  rightArrowClick: PropTypes.func,
  isMandatory: PropTypes.bool,
  fieldContainerStyle: PropTypes.object,
}

export default DatePicker
