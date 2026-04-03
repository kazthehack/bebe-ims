//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { compose, withProps } from 'recompose'
import { verifyPasswordEmailToken as verifyPasswordEmailTokenApi } from 'api/imsBridge'
import { withRouter } from 'react-router-dom'
import { getNotification } from 'components/Notifications'

const expiredTokenErrorToast = getNotification('info', 'Your reset password request has expired. If you still wish to reset your password, please click "Forgot Your Password?" to request a new password reset link.', '', 'infoLock')
const infoToast = getNotification('info', 'Your password must be updated. Please choose a new password.', '', 'infoLock')

const withVerifyPasswordEmailToken = compose(
  withRouter,
  withProps(ownProps => ({
    verifyPasswordEmailToken: passwordResetToken => (
      verifyPasswordEmailTokenApi({ passwordResetToken })
        .then(() => {
          ownProps.addNotification(infoToast)
        })
        .catch(() => {
          ownProps.history.push('/login')
          ownProps.addNotification(expiredTokenErrorToast)
        })
    ),
  })),
)

export default withVerifyPasswordEmailToken
