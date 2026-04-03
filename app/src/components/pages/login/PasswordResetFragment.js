import React, { Component } from 'react'
import { compose, withPropsOnChange } from 'recompose'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Row, Col } from 'react-styled-flexboxgrid'
import { Form } from 'react-final-form'
import { get, every } from 'lodash'
import {
  required,
  combineValidators,
  passwordValidator,
  stringMatchValidator,
} from 'utils/validators'
import PasswordRequirements, { checkRequirements } from 'components/common/password/PasswordRequirements'
import { FormTextField } from 'components/common/input/TextField'
import LoginButton from './components/LoginButton'
import LoginErrorMessage from './components/LoginErrorMessage'
import { FormLoginInput } from './components/LoginInputGroup'
import withResetPassword from './withResetPassword'

// TODO: Refactor this page to use simpler styling, i.e. less Col and Rows since there isn't
// a spec how this should work
class PasswordResetFragment extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.verifyPasswordEmailToken(this.props.initialValues.resetPasswordToken)
  }

  render() {
    const { errorMessage, onSubmitPasswordReset, initialValues } = this.props
    return (
      <Form
        initialValues={initialValues}
        onSubmit={onSubmitPasswordReset}
        render={({ handleSubmit, values }) => {
          const requirements = checkRequirements(values.newPassword, values.retypedPassword)
          return (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <h3>Reset your password</h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <FormLoginInput
                      id="password-input"
                      name="newPassword"
                      label="Password"
                      type="password"
                      placeholder="password"
                      md={4}
                      lg={4}
                      validate={combineValidators(required, passwordValidator)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div style={{ position: 'relative' }}>
                      <FormLoginInput
                        id="password-retype-input"
                        name="retypedPassword"
                        type="password"
                        label="Retype password"
                        placeholder="retype password"
                        md={4}
                        lg={4}
                        validate={stringMatchValidator('newPassword', 'Passwords must match')}
                      />
                      {/* Hidden Token Field */}
                      <FormTextField
                        id="resetPasswordToken"
                        name="resetPasswordToken"
                        style={{ display: 'none' }}
                      />
                      <PasswordRequirements
                        requirements={requirements}
                        contentStyle={{ transform: 'translate(0,-59.5%)', right: '-185px' }}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <LoginErrorMessage>
                      {errorMessage}
                    </LoginErrorMessage>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Row middle="xs" center="xs">
                      <LoginButton
                        label="submit"
                        type="submit"
                        primary
                        disabled={!every(requirements, 'criteriaMet')}
                      >reset
                      </LoginButton>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </form>
          )
        }}
      />
    )
  }
}

PasswordResetFragment.propTypes = {
  errorMessage: PropTypes.string,
  onSubmitPasswordReset: PropTypes.func,
  verifyPasswordEmailToken: PropTypes.func,
  initialValues: PropTypes.shape({
    resetPasswordToken: PropTypes.string,
    newPassword: PropTypes.string,
    retypedPassword: PropTypes.string,
  }),
}

export default compose(
  withResetPassword,
  withPropsOnChange(['location'], ({ location }) => ({
    initialValues: {
      resetPasswordToken: get(qs.parse(get(location, 'search'), { ignoreQueryPrefix: true }), 'token'),
      newPassword: '',
      retypedPassword: '',
    },
  })),
)(PasswordResetFragment)
