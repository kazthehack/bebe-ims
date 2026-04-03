import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { Field } from 'react-final-form'
import { noop } from 'lodash'

const ToggleButton = styled.input`
  appearance: none;
  width: 44px;
  height: 22px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 32px;
  background-color: ${props => (props.disabled ? colors.grayLight3 : colors.grayDark)};
  display: inline-flex;
  align-items: center;
  user-select: none;
  position: relative;
  box-shadow: inset 0 1px 4px 0 ${colors.trans.black30};
  ::after {
    content: "";
    position: absolute;
    width: 20px;
    background: ${colors.grayLight3};
    height: 18px;
    border-radius: 20px;
    left: 2px;
    transition: left 0.15s ease;
    box-shadow: 1px 2px 4px 0 ${colors.trans.black20}
  }
  :checked{
    background-color: ${(props) => {
    if (props.disabled) {
      if (props.greenBackground) return colors.green
      return colors.blueLight
    }
    return (props.greenBackground ? colors.green : colors.blue)
  }};
    box-shadow: inset 1px 2px 4px 0 ${colors.trans.black15};
    ::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 18px;
      border-radius: 20px;
      background: #f7f7f7;
      left: 22px;
      transition: left 0.15s ease;
    }
  }
`

const LabelTextDiv = styled.div`
  line-height: 28px;
  color: ${colors.grayDark2};
  padding-right: 20px;
`

const StatusTextDiv = styled.div`
  width: ${props => (props.statusTextWidth ? props.statusTextWidth : '30px')};
  margin-left: 20px;
  line-height: 28px;
`

const ToggleAndStatusDiv = styled.div`
  display: flex;
`
const Label = styled.label`
  font-size: 16px;
  color: ${colors.grayDark2};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: space-between;
  user-select: none;
  width: min-content;
`

/**
 * Stateless Toggle component. Alternately skinned checkbox, designed to work with react-final-form.
 * Must be inside a React Form component. To designate a default value, use the Form's
 * initialValues or use the ControlledToggle component.
 */
export const UncontrolledToggle = ({
  statusText,
  statusTextWidth,
  label,
  labelStyle,
  className,
  disabled,
  ...props
}) => (
  <Label style={labelStyle} disabled={disabled}>
    { label && <LabelTextDiv>{label}</LabelTextDiv> }
    <ToggleAndStatusDiv className={className} >
      <ToggleButton disabled={disabled} {...props} type="checkbox" />
      { statusText &&
        <StatusTextDiv statusTextWidth={statusTextWidth}>{statusText}</StatusTextDiv>
      }
    </ToggleAndStatusDiv>
  </Label>
)

UncontrolledToggle.propTypes = {
  statusText: PropTypes.string,
  statusTextWidth: PropTypes.string,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  greenBackground: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

/**
 * Controlled-value, stateful implementation of the Toggle component.
 */
export class StatefulToggle extends Component {
  constructor(...args) {
    super(...args)
    this.updateValue = this.updateValue.bind(this)
    this.state = {
      checked: this.props.value || this.props.checked || false,
    }
  }

  updateValue(e) {
    if (typeof this.state.checked === 'undefined') {
      this.setState({ checked: true })
    } else {
      this.setState({ checked: !this.state.checked })
    }
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  render() {
    const {
      checked,
      checkedStatusText,
      uncheckedStatusText,
      statusTextWidth,
      noStatusText,
      value,
      onChange,
      ...props
    } = this.props
    let statusText = this.state.checked ? checkedStatusText : uncheckedStatusText
    if (noStatusText) statusText = null
    return (
      <UncontrolledToggle
        onClick={this.updateValue}
        checked={this.state.checked}
        statusText={statusText}
        readOnly
        {...props}
      />
    )
  }
}

StatefulToggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  checkedStatusText: PropTypes.string,
  uncheckedStatusText: PropTypes.string,
  statusTextWidth: PropTypes.string,
  noStatusText: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  greenBackground: PropTypes.bool,
}

StatefulToggle.defaultProps = {
  checkedStatusText: 'ON',
  uncheckedStatusText: 'OFF',
}

export default StatefulToggle

export const FormToggle = ({
  name,
  noStatusText,
  onChange = noop,
  checkedStatusText = noStatusText ? null : 'ON',
  uncheckedStatusText = noStatusText ? null : 'OFF',
  ...props
}) => (
  <Field
    name={name}
    type="checkbox"
    render={({ input, meta }) => (
      // using UncontrolledToggle uses form state instead of react state - allows reset
      <UncontrolledToggle
        statusText={input.value ? checkedStatusText : uncheckedStatusText}
        checked={input.value}
        {...input}
        {...props}
        onChange={(e) => { input.onChange(e); onChange(e) }}
        meta={meta}
      />
    )}
  />
)

FormToggle.propTypes = {
  name: PropTypes.string.isRequired,
  checkedStatusText: PropTypes.string,
  uncheckedStatusText: PropTypes.string,
  noStatusText: PropTypes.bool,
  onChange: PropTypes.func,
}
