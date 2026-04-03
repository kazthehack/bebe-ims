import React from 'react'
import Button from 'components/common/input/Button'
import withChangePassword from 'components/pages/employees/modals/withChangePassword'
import { compose } from 'recompose'
import { withNotifications } from 'components/Notifications'
import PropTypes from 'prop-types'

/** this is a test page that can be used for setting up API HOCs before they are implemented
 * into the actual UI as a quick place to test an API HOC implementation.
 */

const APITest = ({ changePassword }) => (
  <div>
    <h1>API</h1>
    <h2>Employee Endpoints</h2>
    <Button
      style={{ width: 300 }}
      onClick={() => changePassword({
        employeeId: 'RW1wbG95ZWU6Mw==', // joey-dev@example.com
        currentPassword: '8qTJwBZWG0fb7Uep',
        newPassword: '8qTJwBZWG0fb7Uep',
      })}
    >
    authenticatedResetPassword
    </Button>
  </div>
)

APITest.propTypes = {
  changePassword: PropTypes.func.isRequired,
}

const APITestHOC = compose(
  withNotifications,
  withChangePassword(), // changePassword =>
)(APITest)

export default APITestHOC
