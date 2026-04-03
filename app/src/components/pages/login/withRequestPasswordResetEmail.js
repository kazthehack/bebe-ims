//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { compose, withProps } from 'recompose'
import { sendResetPasswordEmail } from 'api/imsBridge'
import { withNotifications, getNotification } from 'components/Notifications'
import { humanReadableError } from 'utils/mapErrorMessage'

const successToast = getNotification('success', 'Success:', 'Password reset email sent')
const errorToast = (message = '') => getNotification('error', 'Error', message)

const withSendPasswordResetEmail = compose(
  withNotifications,
  withProps(ownProps => ({
    onSubmitPasswordReset: ({ email }) => (
      sendResetPasswordEmail({ employeeEmail: email })
        .then(() => {
          ownProps.addNotification(successToast)
          ownProps.history.push('/')
        })
        .catch((error) => {
          ownProps.addNotification(errorToast(humanReadableError(error)))
          return error
        })
    ),
  })),
)

export default withSendPasswordResetEmail
