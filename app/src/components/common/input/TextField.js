//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import SanitizedString from 'utils/parsers'
import colors from 'styles/colors'
import { noop } from 'lodash'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const StyledInput = styled.input`
  width: ${props => ((props.prefix || props.suffix) ? 'calc(100% - 45px)' : '100%')};
  color: ${({ disabled }) => (
    disabled ? `${colors.grayLight};` : `${colors.grayDark2};`
  )}
  ::placeholder ${({ disabled }) => (
    `{
      color: ${disabled ? 'transparent' : colors.grayLight5};
      opacity: 1; /* Firefox */
    }`
  )};
  font-size: 16px;
  font-family: 'Roboto', sans-serif !important;
  height: 40px;
  border-width: 1px;
  border-style: solid;
  border: 1px solid ${colors.grayDark};
  border-color: ${({ meta, disabled, showError }) => {
    if (disabled) return colors.grayDark
    if ((meta && meta.touched && meta.error) || showError) return colors.red
    if (meta && meta.active) return colors.blue //
    return colors.grayDark
  }};
  border-radius: ${(props) => {
    if (props.suffix) return '2px 0 0 2px'
    if (props.prefix) return '0 2px 2px 0'
    return '2px'
  }};
  ${props => (props.prefix ? 'border-left: 0;' : '')}
  ${props => (props.suffix ? 'border-right: 0;' : '')}
  box-sizing: border-box;
  padding: 0 15px;
  outline: none;
  background: ${props => (props.readOnly || props.disabled ? colors.grayLight2 : colors.white)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'inherit')};
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  color: ${({ disabled }) => (
    disabled ? `${colors.grayLight};` : `${colors.grayDark2};`
  )}
  ::placeholder ${({ disabled }) => (
    `{
      color: ${disabled ? 'transparent' : colors.grayLight5};
      opacity: 1; /* Firefox */
    }`
  )};
  font-size: 16px;
  font-family: 'Roboto', sans-serif !important;
  height: 40px;
  border-width: 1px;
  border-style: solid;
  border: 1px solid ${colors.grayDark};
  border-color: ${({ meta, disabled, showError, isMandatory }) => {
    if (disabled) return colors.grayDark
    if ((meta && meta.touched && meta.error) || showError) return colors.red
    if (meta && meta.active && !isMandatory) {
      return colors.blue
    }
    if (isMandatory) {
      return colors.red
    }
    return colors.grayDark
  }};
  border-radius: ${(props) => {
    if (props.suffix) return '2px 0 0 2px'
    if (props.prefix) return '0 2px 2px 0'
    return '2px'
  }};
  ${props => (props.prefix ? 'border-left: 0;' : '')}
  ${props => (props.suffix ? 'border-right: 0;' : '')}
  box-sizing: border-box;
  padding: 0 15px;
  outline: none;
  background: ${props => (props.readOnly || props.disabled ? colors.grayLight2 : colors.white)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'inherit')};
`

const Decoration = styled.div`
  color: ${colors.white};
  background-color: ${({ meta, showError }) => {
    if ((meta && meta.touched && meta.error) || showError) return colors.red
    if (meta && meta.active) return colors.blue
    return colors.grayDark2
  }};
  height: 40px;
  min-width: 45px;
  max-width: 45px;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  line-height: 40px;
  border-radius: ${({ prefixed }) => (prefixed ? '2px 0 0 2px' : '0 2px 2px 0')};
  ${({ prefixed }) => (prefixed ? 'left: 1px;' : 'right: 1px;')}
  font-weight: bold;
  font-size: 18px;}
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  position: relative;
`

const Arrow = styled.div`
  outline: none;
  position: absolute;
  top: 16px;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  cursor: pointer;
`

const LeftArrow = styled(Arrow)`
  border-right: 4px solid ${colors.grayDark2};
  right: 44px;
  :focus {
    border-right: 4px solid ${colors.blue};
  }
`

const RightArrow = styled(Arrow)`
  right: 32px;
  border-left: 4px solid ${colors.grayDark2};
  :focus {
    border-left: 4px solid ${colors.blue};
  }
`

const TextField = ({ className, prefix, suffix, showError, meta = {}, ...props }) => (
  <Wrapper className={className}>
    { prefix && <Decoration prefixed meta={meta} showError={showError}>{prefix}</Decoration>}
    <StyledInput prefix={prefix} suffix={suffix} meta={meta} showError={showError} {...props} />
    { suffix && <Decoration meta={meta} showError={showError}>{suffix}</Decoration>}
  </Wrapper>
)

TextField.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  showError: PropTypes.string,
}

// To not duplicate all the styling code in multiple places, I chose to keep this here.
// Needs to be controlled.
export const LibDatePicker = ({
  className,
  prefix,
  suffix,
  showError,
  meta = {},
  leftArrowClick,
  rightArrowClick,
  isMandatory = false,
  ...props
}) => (
  <Wrapper className={className}>
    { prefix && <Decoration prefixed meta={meta} showError={showError}>{prefix}</Decoration>}
    <StyledDatePicker
      prefix={prefix}
      suffix={suffix}
      meta={meta}
      showError={showError}
      isMandatory={isMandatory}
      {...props}
    />
    {leftArrowClick && <LeftArrow tabIndex="0" onClick={leftArrowClick} />}
    {rightArrowClick && <RightArrow tabIndex="0" onClick={rightArrowClick} />}
    { suffix && <Decoration meta={meta} showError={showError}>{suffix}</Decoration>}
  </Wrapper>
)

LibDatePicker.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  showError: PropTypes.string,
  leftArrowClick: PropTypes.func,
  rightArrowClick: PropTypes.func,
  isMandatory: PropTypes.bool,
}

const ErrorSpan = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
  margin-top: 2px;
  margin-left: 24px;
  font-weight: normal;
  line-height: 14px;
`
const SubLabelDiv = styled.div`
  color: ${colors.grayDark2};
  margin-top: 2px;
  margin-bottom: -5px;
`

export const FormTextField = ({
  name,
  type = 'text',
  validate,
  onChange = noop,
  parse = SanitizedString,
  errorText = true,
  onBlur = noop,
  fieldContainerStyle,
  errorStyle,
  subFieldLabel,
  showError, // This field allows us to override normal error messages wih special ones
  ...props
}) => (
  <Field
    name={name}
    type={type}
    validate={validate}
    parse={parse}
    render={({ input, meta }) => (
      <div style={{ width: '100%', maxWidth: '320px', ...fieldContainerStyle }}>
        <TextField
          type={type}
          {...input}
          {...props}
          meta={meta}
          showError={showError}
          onChange={(e) => { input.onChange(e); onChange(e) }}
          onBlur={(e) => { input.onBlur(e); onBlur(e) }}
        />
        {subFieldLabel && (
          <SubLabelDiv>
            {subFieldLabel}
          </SubLabelDiv>
        )}
        {((errorText && meta.error && meta.touched) || (showError))
          && <ErrorSpan style={{ ...errorStyle }}>{showError || meta.error}</ErrorSpan>
        }
      </div>
    )}
  />
)

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  validate: PropTypes.func,
  onChange: PropTypes.func,
  parse: PropTypes.func,
  errorText: PropTypes.bool,
  onBlur: PropTypes.func,
  fieldContainerStyle: PropTypes.object,
  errorStyle: PropTypes.object,
  subFieldLabel: PropTypes.string,
  showError: PropTypes.string,
}

export default TextField
