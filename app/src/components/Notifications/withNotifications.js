import React from 'react'
import { NotificationsContext } from 'components/Notifications'

const { Consumer } = NotificationsContext

/**
 * comsumes NotificationsContext value as component props
 *
 * @param {React.SFC|React.ComponentClass} C component to decorate
 * @return {React.SFC|React.ComponentClass}
 */
const withNotifications = C => ({ ...props }) => (
  <Consumer>
    {({ ...notificationsProps } = {}) => (
      <C {...props} {...notificationsProps} />
    )}
  </Consumer>
)

export default withNotifications
