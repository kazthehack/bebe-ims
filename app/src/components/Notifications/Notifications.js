import React, { Component, Fragment } from 'react'
import NotificationSystem from 'react-notification-system'
import colors from 'styles/colors'
import styled, { keyframes, css } from 'styled-components'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { setMessage, withState as withAlertsState } from 'store/modules/alerts'
import { compose } from 'recompose'
import { isEmpty, get } from 'lodash'

const noop = () => {}

const levelColor = {
  error: colors.red,
  info: colors.blue,
  success: colors.green,
  warning: colors.yellow,
  loading: colors.blue,
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const StyledProductIcon = styled(ProductIcon)`
  position: absolute;
  top: 20px;
  left: 16px;
  font-size: 36px;
  color: ${props => (levelColor[props.type] || colors.gray)};
  
  ${props => props.type === 'loading' && css`
    animation: ${rotate} 2s linear infinite;
  `}
`

export const getNotificationIcon = (level, icon) => (<StyledProductIcon type={icon || level} />)

export const getNotification = (level = 'info', title = '', message = '', icon = '', autoDismiss = 10, dismissible = 'button') => ({
  title,
  level,
  message,
  children: getNotificationIcon(level, icon),
  autoDismiss,
  dismissible,
})

const notificationStyle = {
  Containers: {
    DefaultStyle: {
      marginTop: '64px',
      marginRight: '30px',
      width: 'auto',
      maxWidth: '40%',
    },
  },
  NotificationItem: {
    DefaultStyle: {
      width: 'auto',
      minWidth: '328px',
      minHeight: '78px',
      height: 'auto',
      color: colors.grayLight,
      backgroundColor: colors.white,
      fontSize: '12px',
      letterSpacing: '0.4px',
      border: 'none',
      boxShadow: '0 5px 7px 0 rgba(0, 0, 0, 0.06)',
    },
  },
  Title: {
    DefaultStyle: {
      fontSize: '16px',
      color: colors.grayDark2,
      fontWeight: 'normal',
      letterSpacing: '0.6px',
      margin: '9px 70px 5px 62px',
    },
  },
  MessageWrapper: {
    DefaultStyle: {
      marginLeft: '62px',
      marginRight: '70px',
    },
  },
  Dismiss: {
    DefaultStyle: {
      width: '70px',
      fontWeight: 'normal',
      fontSize: '30px',
      lineHeight: '78px',
      color: colors.trans.grayDark22,
      backgroundColor: colors.white,
      top: '0px',
      right: '0px',
      borderLeft: `1px solid ${colors.trans.gray95}`,
      borderRadius: 'none',
    },
  },
}

export const NotificationsContext = React.createContext({
  add: noop,
  remove: noop,
  edit: noop,
  clear: noop,
})

const { Provider } = NotificationsContext

/**
 * provides NotificationsContext along with context api
 * to allow access to notification-system's singleton
 * instance in VDOM.
 *
 * @class
 * @extends React.Component
 */
class Notifications extends Component {
  state = {
    ready: false,
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(get(prevProps, 'message'))) {
      const toastMessage = getNotification('error', get(prevProps, 'message'))
      this.notify.addNotification(toastMessage)
      setMessage('')
    }
  }

  setRef = (ref) => {
    this.notify = ref
    this.setState({ ready: true })
  }

  addNotification = n => this.notify.addNotification(n)
  removeNotification = n => this.notify.removeNotification(n)
  editNotification = (n, newProps) => this.notify.editNotification(n, newProps)
  clearNotifications = () => this.notify.clearNotifications()

  notify = undefined

  render() {
    const {
      props = {},
      addNotification,
      removeNotification,
      editNotification,
      clearNotifications,
    } = this
    const { children } = props
    return (
      <Fragment>
        <Provider
          value={{
            addNotification,
            removeNotification,
            editNotification,
            clearNotifications,
          }}
        >
          {this.state.ready && children}
        </Provider>
        <NotificationSystem ref={this.setRef} style={notificationStyle} />
      </Fragment>
    )
  }
}

export default compose(withAlertsState)(Notifications)
