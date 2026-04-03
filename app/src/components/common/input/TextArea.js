import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { Field } from 'react-final-form'

const TextArea = styled.textarea.attrs({
  type: 'text',
})`
  width: 100%;
  max-width: 320px;
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
  flex: 9 0 90%;
  height: 40px;
  border-width: 1px;
  border-style: solid;
  border: 1px solid ${colors.grayDark};
  border-color: ${({ meta }) => ((meta && meta.touched && meta.error) ? colors.red : colors.grayDark)};
  border-radius: 2px;
  box-sizing: border-box;
  padding: 0 15px;
  margin: 0px;
  outline: none;
  resize: none;
  ${props => (props.readOnly || props.disabled ? 'background: transparent' : '')}
`

const ErrorSpan = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
  margin-top: 2px;
  margin-left: 24px;
  font-weight: normal;
  line-height: 14px;
  display: block;
`

TextArea.propTypes = {
  className: PropTypes.string,
}

export const FormTextArea = ({
  name,
  validate,
  errorText = false,
  fieldContainerStyle,
  ...props
}) => (
  <Field
    name={name}
    validate={validate}
    render={({ input, meta }) => (
      <div style={{ width: '100%', maxWidth: '320px', ...fieldContainerStyle }}>
        <TextArea
          meta={meta}
          {...input}
          {...props}
        />
        {errorText && meta.error && meta.touched && <ErrorSpan>{meta.error}</ErrorSpan>}
      </div>
    )}
  />
)

FormTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.func,
  errorText: PropTypes.bool,
  fieldContainerStyle: PropTypes.object,
}

export default TextArea
