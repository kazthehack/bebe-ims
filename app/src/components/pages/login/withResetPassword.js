//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { compose, withProps } from 'recompose'
import { withNotifications, getNotification } from 'components/Notifications'
import { withRouter } from 'react-router-dom'
import { resetPassword } from 'api/imsBridge'
import withVerifyPasswordEmailToken from './withVerifyPasswordEmailToken'

const successToast = getNotification('success', 'Success:', 'Your password has been reset.')
const errorToast = (message = '') => getNotification('error', 'Error', message)

const withResetPassword = compose(
  withNotifications,
  withVerifyPasswordEmailToken,
  withRouter,
  withProps(ownProps => ({
    onSubmitPasswordReset: ({ resetPasswordToken, newPassword }) => (
      resetPassword({ resetPasswordToken, newPassword })
        .then(() => {
          ownProps.addNotification(successToast)
          ownProps.history.push('/')
        })
        .catch((error) => {
          ownProps.addNotification(errorToast())
          return error
        })
    ),
  })),
)

export default withResetPassword
