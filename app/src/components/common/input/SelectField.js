import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { Field } from 'react-final-form'

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 320px;
`

const Triangle = styled.div`
  display: inline-block;
  position: absolute;
  top: 16px;
  right: ${props => (props.suffix ? '55px' : '10px')};
  height: 0;
  width: 0;
  border-left: 6px solid transparent;
  border-right:  6px solid transparent;
  border-top: 6px solid ${colors.trans.gray72};
  pointer-events: none;
`

const StyledSelect = styled.select`
  width: ${props => ((props.prefix || props.suffix) ? 'calc(100% - 45px)' : '100%')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: inline-block;
  background: ${props => (props.readOnly || props.disabled ? colors.grayLight2 : colors.white)};
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
  border: 1px solid #c7c7c7;
  border-radius: ${(props) => {
    if (props.suffix) return '2px 0 0 2px'
    if (props.prefix) return '0 2px 2px 0'
    return '2px'
  }};
  ${props => (props.prefix ? 'border-left: 0;' : '')}
  ${props => (props.suffix ? 'border-right: 0;' : '')}
  border-color: ${({ active, disabled, touched, error }) => {
    if (disabled) return colors.grayDark
    else if (touched && error) return colors.red
    else if (active) return colors.blue //
    return colors.grayDark
  }};
  box-sizing: border-box;
  padding: 0 15px;
  outline: none;
  appearance: none;
`

const StyledInput = styled.input`
  width: ${props => ((props.prefix || props.suffix) ? 'calc(100% - 45px)' : '100%')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: inline-block;
  background: ${props => (props.readOnly || props.disabled ? colors.grayLight2 : colors.white)};
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
  border: 1px solid #c7c7c7;
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
  appearance: none;
`

const ErrorSpan = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
  margin-top: 2px;
  margin-left: 24px;
  font-weight: normal;
  line-height: 14px;
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

// TODO: rename this. This name is very confusing. Combo field has nothing to do with this?
export const FormSelectTextComboField = ({ name, onChange = () => {}, ...props }) => (
  <Field
    name={name}
    render={({ input, meta }) => (
      <SelectField
        name={name}
        {...input}
        {...props}
        onChange={(e) => { input.onChange(e); onChange(e) }}
        {...meta}
      />
    )}
  />
)

FormSelectTextComboField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  errorText: PropTypes.bool,
}

export const FormSelectField = ({
  name,
  errorText = false,
  onChange = () => {},
  comboBox,
  fieldContainerStyle,
  ...props
}) => (
  <Field
    validate={props.validate}
    errorText={props.errorText}
    name={name}
    render={({ input, meta }) => (
      <Fragment>
        <div style={{ width: '100%', maxWidth: '320px', ...fieldContainerStyle }}>
          {
            comboBox ?
              <ComboBoxField
                name={name}
                {...input}
                {...props}
                onChange={(e) => {
                  input.onChange(e)
                  onChange(e)
                }}
                {...meta}
              />
            :
              <SelectField
                name={name}
                {...input}
                {...props}
                onChange={(e) => {
                  input.onChange(e)
                  onChange(e)
                }}
                {...meta}
              />
          }
          {errorText && meta.error && meta.touched && <ErrorSpan>{meta.error}</ErrorSpan>}
        </div>
      </Fragment>
    )}
  />
)

FormSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  comboBox: PropTypes.bool,
  validate: PropTypes.func,
  errorText: PropTypes.bool,
  fieldContainerStyle: PropTypes.object,
}

const SelectField = ({
  name,
  options,
  style,
  disabled,
  placeHolder,
  prefix,
  suffix,
  meta,
  ...otherProps
}) => {
  const optionElements = options.map(
    opt => <option key={opt.name} value={opt.value}>{opt.name}</option>,
  )
  return (
    <StyledDiv>
      { prefix && <Decoration prefixed meta={meta}>{prefix}</Decoration>}
      <StyledSelect
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        {...otherProps}
      >
        {placeHolder && <option disabled key="placeholder" value="">{placeHolder}</option>}
        {optionElements}
      </StyledSelect>
      {disabled ? '' : <Triangle suffix={suffix} />}
      { suffix && <Decoration meta={meta}>{suffix}</Decoration>}
    </StyledDiv>
  )
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  style: PropTypes.object,
  placeHolder: PropTypes.string,
  disabled: PropTypes.bool,
  comboBox: PropTypes.bool,
}

SelectField.defaultProps = {
  style: {},
  placeHolder: '',
}

const ComboBoxField = ({
  name,
  options,
  style,
  disabled,
  placeHolder,
  prefix,
  suffix,
  meta,
  ...otherProps
}) => {
  const optionElements = options.map(
    opt => <option key={opt.key || name + opt.value} value={opt.value} />,
  )
  return (
    <StyledDiv>
      { prefix && <Decoration prefixed meta={meta}>{prefix}</Decoration>}
      <StyledInput
        list={name}
        disabled={disabled}
        {...otherProps}
      />
      <datalist id={name}>
        {optionElements}
      </datalist>
      { suffix && <Decoration meta={meta}>{suffix}</Decoration>}
    </StyledDiv>
  )
}

ComboBoxField.propTypes = {
  name: PropTypes.string.isRequired,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
  })).isRequired,
  style: PropTypes.object,
  placeHolder: PropTypes.string,
  disabled: PropTypes.bool,
  comboBox: PropTypes.bool,
}

ComboBoxField.defaultProps = {
  style: {},
  placeHolder: '',
}

export default SelectField
