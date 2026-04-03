import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { Field } from 'react-final-form'
/* eslint no-confusing-arrow: 0 */

const StyledRadio = styled.input`
  width: 20px;
  height: 20px;
  border: solid 2px ${({ disabled }) => (disabled ? colors.grayDark : colors.grayDark2)};
  border-radius: 13px;
  appearance: none;
  background-color: ${colors.white};
  margin: 0;
  position: relative;
  outline: none;
  margin-right: 24px;
  transition: all 300ms;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ::after{
    transition: all 300ms;
    position: absolute;
    content: "";
    width: 12px;
    height: 12px;
    background-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.blue)};
    border-radius: 13px;
    top: 2px;
    left: 2px;
    opacity: 0;
  }
  :checked{
    border-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.blue)};
    ::after{
      opacity: 1;
    }
  }
`
const StyledLabel = styled.label`
  font-size: 16px;
  color: ${colors.grayDark2};
  display: flex;
  margin-bottom: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`
export const RadioButton = ({
  labelStyle, label, input, disabled, onChangeValue, ...props
}, context) => {
  const { onRadioChange, radioValue } = context // These lines make it so RadioButton MUST be
  const checked = radioValue === props.value
  // conrolled by RadioButtonGroup to be //  used. Should be refactored to be
  const onClick = () => onRadioChange(props.value)
  // able to be uncontrolled.

  if (props.checked && !checked && onChangeValue) {
    onChangeValue()
  }
  return (
    <StyledLabel style={labelStyle} disabled={disabled}>
      <StyledRadio checked={checked} type="radio" onClick={onClick} {...input} disabled={disabled} {...props} />
      {label}
    </StyledLabel>
  )
}

RadioButton.contextTypes = {
  onRadioChange: PropTypes.func.isRequired,
  radioValue: PropTypes.string.isRequired,
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
  labelStyle: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  onChangeValue: PropTypes.func,
}

export const FormRadioButton = ({ name, value, disabled, ...props }) => (
  <Field
    name={name}
    type="radio"
    value={value}
    render={({ input, meta }) =>
      <RadioButton {...input} disabled={disabled} {...props} meta={meta} />
    }
  />
)

FormRadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export class RadioButtonGroup extends Component {
  constructor(...args) {
    super(...args)
    this.updateValue = this.updateValue.bind(this)
    this.state = {
      value: this.props.defaultValue,
    }
  }

  getChildContext() {
    return {
      onRadioChange: this.updateValue,
      radioValue: this.state.value || '',
    }
  }

  updateValue(value) {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    return (
      <div style={this.props.style} >
        {this.props.children}
      </div>
    )
  }
}

RadioButtonGroup.childContextTypes = {
  onRadioChange: PropTypes.func.isRequired,
  radioValue: PropTypes.string.isRequired,
}

RadioButtonGroup.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
}

RadioButtonGroup.defaultProps = {
  onChange: () => null,
}
