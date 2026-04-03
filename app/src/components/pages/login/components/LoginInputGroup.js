import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-styled-flexboxgrid'
import colors from 'styles/colors'
import { Field } from 'react-final-form'
import SanitizedString from 'utils/parsers'
import { FormTextField } from 'components/common/input/TextField'

const StyledFormTextField = styled(FormTextField)`
  width: 100%;
  max-width: none;
`

const StyledSpanIcon = styled.span`
  float: right;
  margin-top: -27px;
  padding-right: 5px;
  position: relative;
  opacity: 0.6;
  cursor: pointer;
`

const ICON_EYE = 'icon-eye'
const ICON_EYE_CROSSED = 'icon-eye-crossed'

const onClickIcon = (id) => {
  const obj = document.getElementById(id)
  const icon = document.getElementById(ICON_EYE)
  if (obj.type === 'password') {
    icon.classList.toggle(ICON_EYE)
    icon.classList.add(ICON_EYE_CROSSED)
    obj.type = 'text'
  } else {
    icon.classList.toggle(ICON_EYE_CROSSED)
    icon.classList.add(ICON_EYE)
    obj.type = 'password'
  }
}

const LoginInput = ({
  innerRef,
  label,
  className,
  id,
  xs,
  sm,
  md,
  lg,
  type,
  ...rest
}) => (
  <Row ref={innerRef} middle="xs" start="xs" className={className}>
    <Col xs={xs} sm={sm} md={md} lg={lg} style={{ maxWidth: '30%', marginRight: 0 }}>
      <label style={{ color: colors.grayDark2, marginLeft: 45 }} htmlFor={id}>{label}</label>
    </Col>
    <Col>
      <StyledFormTextField
        id={id}
        type={type}
        {...rest}
      />
      { type === 'password' &&
        <StyledSpanIcon
          id="icon-eye"
          className="icon-eye"
          onClick={() => onClickIcon(id)}
        />
      }
    </Col>
  </Row>
)

LoginInput.propTypes = {
  innerRef: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  type: PropTypes.oneOf(['text', 'password']),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
}

LoginInput.defaultProps = {
  type: 'text',
  xs: 12,
  sm: 12,
  md: 3,
  lg: 3,
}

const StyledLoginInput = styled(LoginInput)`
  margin: 17px;
`

export default StyledLoginInput

export const FormLoginInput = ({
  name, type, validate, ...props
}) => (
  <div>
    <Field
      name={name}
      type={type}
      validate={validate}
      parse={SanitizedString}
      render={({ input, meta }) => (
        <StyledLoginInput {...input} {...props} meta={meta} type={type} />
      )}
    />
  </div>
)

FormLoginInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validate: PropTypes.func,
}
