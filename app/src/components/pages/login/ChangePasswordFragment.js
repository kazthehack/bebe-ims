import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { Row, Col } from 'react-styled-flexboxgrid'
import { withRouter, Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import { withNotifications, getNotification } from 'components/Notifications'
import {
  combineValidators,
  required,
} from 'utils/validators'
import { changePassword } from 'api/imsBridge'
import { getAccessToken, getDefaultAuthenticatedPath } from 'api/authSession'
import LoginButton from './components/LoginButton'
import LoginErrorMessage from './components/LoginErrorMessage'
import LoginInputGroup from './components/LoginInputGroup'

const passwordValidator = combineValidators(required)
const successToast = getNotification('success', 'Success', 'Password changed')

const ChangePasswordFragment = ({ history, addNotification }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!getAccessToken()) {
    return <Redirect to="/login" />
  }

  const onSubmit = ({ currentPassword, newPassword, confirmPassword }) => {
    setErrorMessage('')
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.')
      return null
    }
    setLoading(true)
    return changePassword({ currentPassword, newPassword })
      .then(() => {
        addNotification(successToast)
        history.push(getDefaultAuthenticatedPath())
      })
      .catch(({ message }) => {
        setErrorMessage(message || 'Failed to change password.')
        setLoading(false)
      })
  }

  return (
    <Col xs={12} sm={12} md={12} lg={12}>
      <Form
        onSubmit={onSubmit}
        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        render={({ handleSubmit }) => (
          <Fragment>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h3>Change password</h3>
                </Col>
              </Row>
              <LoginInputGroup
                id="current-password-input"
                type="password"
                label="Current"
                name="currentPassword"
                validate={passwordValidator}
              />
              <LoginInputGroup
                id="new-password-input"
                type="password"
                label="New"
                name="newPassword"
                validate={passwordValidator}
              />
              <LoginInputGroup
                id="confirm-password-input"
                type="password"
                label="Confirm"
                name="confirmPassword"
                validate={passwordValidator}
              />
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LoginErrorMessage>{errorMessage}</LoginErrorMessage>
                </Col>
              </Row>
              <Row middle="xs" center="xs" className="loginButtonContainer">
                <LoginButton style={{ width: 180 }} primary type="submit" disabled={loading}>
                  change password
                </LoginButton>
              </Row>
            </form>
          </Fragment>
        )}
      />
    </Col>
  )
}

ChangePasswordFragment.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
}

export default compose(
  withRouter,
  withNotifications,
)(ChangePasswordFragment)
