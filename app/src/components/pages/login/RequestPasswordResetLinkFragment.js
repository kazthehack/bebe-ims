import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-styled-flexboxgrid'
import { Form } from 'react-final-form'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import Spinner from 'components/common/display/Spinner'
import {
  sanitizedStringValidator,
  combineValidators,
  required,
  emailValidator,
} from 'utils/validators'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import withSendResetPasswordEmail from './withRequestPasswordResetEmail'
import LoginErrorMessage from './components/LoginErrorMessage'
import LoginInputGroup from './components/LoginInputGroup'


const SubmitButton = styled(Button)`
  margin-top: 0 !important;
  margin-bottom: 40px !important;
  div > span {
    font-weight: 500 !important;
  }
  width: 123px;
`

const compositeEmailValidator = combineValidators(
  required,
  sanitizedStringValidator,
  emailValidator,
)
const RequestPasswordResetLinkFragmentPure = ({ errorMessage, onSubmitPasswordReset }) => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Row>
      <Col xs={12} sm={12} md={12} lg={12}>
        <h3>Request a password reset link</h3>
      </Col>
    </Row>
    <Form
      onSubmit={onSubmitPasswordReset}
      keepDirtyOnReinitialize
      render={({ handleSubmit, submitting, pristine }) => (
        <Fragment>
          {submitting && <Spinner wrapStyle={{ position: 'absolute' }} />}
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <LoginInputGroup
                  style={{ marginLeft: 30 }}
                  id="password-reset"
                  name="email"
                  label={<label style={{ marginLeft: 25 }} htmlFor={'password-retype-input'}>Email</label>}
                  placeholder="email@example.com"
                  validate={compositeEmailValidator}
                />
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
                  <SubmitButton
                    label="submit"
                    type="submit"
                    primary
                    disabled={pristine}
                  >
                    SUBMIT
                  </SubmitButton>
                </Row>
              </Col>
            </Row>
          </form>
        </Fragment>
        )}
    />
  </Col>
)

RequestPasswordResetLinkFragmentPure.propTypes = {
  errorMessage: PropTypes.string,
  onSubmitPasswordReset: PropTypes.func.isRequired,
}

const RequestPasswordResetLinkFragment = compose(
  withRouter, // Adds 'history' prop, used to navigate back to discount page after submission.
  withSendResetPasswordEmail,
)(RequestPasswordResetLinkFragmentPure)

export default RequestPasswordResetLinkFragment
