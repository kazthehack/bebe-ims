//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { get } from 'lodash'
import { createDemoUser } from 'ops'
import { compose, withState } from 'recompose'
import { graphql } from 'api/operationCompat'
import styled from 'styled-components'
import { renderWhileLoading } from 'utils/hoc'
import { withState as withAuthState } from 'store/modules/auth'
import { withNotifications, getNotification } from 'components/Notifications'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import Spinner from 'components/common/display/Spinner'
import TryPagePure from './TryPagePure'

const SPINNER_PADDING_TIME = 1000
const USER_ALREADY_EXISTS_ERROR = 'User already exists'

const successToast = getNotification('success', 'Success:', 'Welcome to your new store! Your password has been sent to your email.')
const errorToast = (message = '') => getNotification('error', 'Error', message)

const SpinnerWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

const CreatingStoreMessage = styled.div`
  position: fixed;
  top: calc(50vh - 200px);
  width: 100vw;
  font-family: Roboto;
  font-size: 28px;
  letter-spacing: 0.9px;
  text-align: center;
  font-weight: 500;
`

const CreatingStoreSpinner = () => (
  <SpinnerWrapper>
    <CreatingStoreMessage>
      Creating Your Store...
    </CreatingStoreMessage>
    <Spinner />
  </SpinnerWrapper>
)

const tryPageHOC = compose(
  withNotifications,
  withAuthState,
  withState('createDemoStoreState', 'setCreateDemoStoreState', { loading: false }),
  graphql(createDemoUser, {
    props: ({ mutate, ownProps }) => ({
      onSubmitCreateDemoUser: ({ email, jobRole, firstName, businessName }) => {
        ownProps.setCreateDemoStoreState({ loading: true })
        return mutate({
          variables: {
            input: { email, jobRole, firstName, businessName },
          },
        })
          .then(({ data }) => { // After the promise is resolved. Is not called if there's an error.
            setTimeout(() => {
              const authToken = get(data, 'createDemoUser.authToken') || {}
              if (authToken) {
                ownProps.setAuthToken({ expires: authToken.expires })
                localStorage.setItem('refreshToken', authToken.refreshToken)
                sessionStorage.setItem('accessToken', authToken.accessToken)
              }
              ownProps.setCreateDemoStoreState({ loading: false })
              ownProps.addNotification(successToast)
              ownProps.history.push('/') // Redirect to the homepage
            }, SPINNER_PADDING_TIME)
          }, (error) => {
            setTimeout(() => {
              ownProps.setCreateDemoStoreState({ loading: false })
              const errorMessage = get(
                error,
                'graphQLErrors.0.message',
                'Failed to create store. Please contact our support team.',
              )
              if (errorMessage === USER_ALREADY_EXISTS_ERROR) {
                ownProps.history.push('/login')
                ownProps.addNotification(
                  errorToast('Account already exists. Please find your password in your email.'),
                )
              } else {
                ownProps.addNotification(errorToast(errorMessage))
              }
            }, SPINNER_PADDING_TIME)
            return error
          })
      },
    }),
  }),
  renderWhileLoading(() => <CreatingStoreSpinner />, 'createDemoStoreState'),
  withQueryErrorPageOnError('demoUserData', false, false),
)

export default tryPageHOC(TryPagePure)
