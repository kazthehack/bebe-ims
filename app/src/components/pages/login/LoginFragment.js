//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { compose } from 'recompose'
import { Row, Col } from 'react-styled-flexboxgrid'
import { Form } from 'react-final-form'
import { withProps } from 'recompose'
import styled from 'styled-components'
import { withNotifications, getNotification } from 'components/Notifications'
import mapErrorMessage from 'utils/mapErrorMessage'
import {
  combineValidators,
  required,
  sanitizedStringValidator,
} from 'utils/validators'
import { withState as withAuthState } from 'store/modules/auth'
import { withVenueID } from 'components/Venue'
import { authLogin } from 'api/imsBridge'
import LoginButton from './components/LoginButton'
import LoginErrorMessage from './components/LoginErrorMessage'
import LoginInputGroup from './components/LoginInputGroup'

const compositeEmailValidator = combineValidators(
  required,
  sanitizedStringValidator,
)

const Overlay = styled(({ loading, ...props }) => <div {...props} />)`
  position: fixed;
  z-index: 9999;
  opacity: 0.3;
  background: #000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: ${props => (props.loading ? 'block' : 'none')};
`

const Show = styled.div`
  height: 46px;
  position: relative;
  span {
    display: none;
  }
  :hover {
    span {
      display: block;
    }
  }
`

const Smirk = styled.span`
  text-decoration: none;
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`

const LOGIN_SUCCESS = getNotification('success', 'Success', 'Successfully logged in')

const initialValuesMap = {
  // true if new form with no emp
  email: '',
  password: '',
}
const LoginFragmentPure = ({
  loading,
  history,
  onLogin,
  errorMessage,
}) => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Form
      onSubmit={onLogin}
      initialValues={initialValuesMap}
      render={({ handleSubmit }) => (
        <Fragment>
          <form onSubmit={handleSubmit}>
            <Overlay loading={loading} />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <h3>Log in</h3>
              </Col>
            </Row>
            <LoginInputGroup
              id="email-input"
              label="Username"
              placeholder="admin | site1 | site2 | site3"
              name="email"
              validate={compositeEmailValidator}
            />
            <LoginInputGroup
              id="password-input"
              type="password"
              label="Password"
              name="password"
              placeholder="password"
              validate={required}
            />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <LoginErrorMessage>
                  {errorMessage}
                </LoginErrorMessage>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row middle="xs" center="xs" className="loginButtonContainer">
                  <LoginButton
                    style={{ width: 123 }}
                    primary
                    type="submit"
                  >login
                  </LoginButton>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row middle="xs" center="xs">
                  <div style={{ paddingBottom: '42px' }}>
                    <Show>
                      <Smirk>
                        <span role="img" aria-label="smirk">
                          &#x1F60F;
                        </span>
                      </Smirk>
                    </Show>
                  </div>
                </Row>
              </Col>
            </Row>
          </form>
        </Fragment>
      )}
    />
  </Col>
)

LoginFragmentPure.propTypes = {
  loading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
}

const LoginFragmentManager = ({
  login,
  history,
  addNotification,
  onEmailChange,
  onPasswordChange,
  setAuthToken,
}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailState, setEmail] = useState()
  const [passwordState, setPassword] = useState()

  const onLogin = ({ email, password }) => {
    setEmail(email)
    setPassword(password)
    setErrorMessage('')
    setLoading(true)

    return login(email, password)
      .then(({ authToken }) => {
        setAuthToken({ expires: authToken.expires })
        localStorage.setItem('refreshToken', authToken.refreshToken)
        sessionStorage.setItem('accessToken', authToken.accessToken)
        addNotification(LOGIN_SUCCESS)
        history.push('/daily')
      })
      .catch(({ message }) => {
        setErrorMessage(get(mapErrorMessage, message, message || 'an unknown error occurred'))
        setLoading(false)
      })
  }
  return (
    <LoginFragmentPure
      errorMessage={errorMessage}
      loading={loading}
      email={emailState}
      password={passwordState}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
      onLogin={onLogin}
      history={history}
    />
  )
}

LoginFragmentManager.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  login: PropTypes.func.isRequired,
  addNotification: PropTypes.func,
  setAuthToken: PropTypes.func,
  onEmailChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
}

export default compose(
  withAuthState,
  withVenueID,
  withProps(() => ({
    login: (email, password) => authLogin(email, password),
  })),
  withNotifications,
)(LoginFragmentManager)
