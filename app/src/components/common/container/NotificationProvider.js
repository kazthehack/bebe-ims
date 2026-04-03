import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NotificationSystem from 'react-notification-system'
import styled from 'styled-components'
import colors from 'styles/colors'

const defaultWidth = 350

/*
 * Styles
 * Reference: https://github.com/igorprado/react-notification-system/blob/master/src/styles.js
 */
const Container = styled.div`
  min-height: 100vh;

  .notifications-wrapper {

    > .notifications-tl {
      top: 0;
      bottom: auto;
      left: 0;
      right: auto;
    }

    > .notifications-tr {
      top: 0;
      bottom: auto;
      left: auto;
      right: 0;
    }

    > .notifications-tc {
      top: 0;
      bottom: auto;
      margin: 0 auto;
      left: 50%;
      margin-left: -${defaultWidth / 2}px;
    }

    > .notifications-bl {
      top: auto;
      bottom: 0;
      left: 0;
      right: auto;
    }

    > .notifications-br {
      top: auto;
      bottom: 0;
      left: auto;
      right: 0;
    }

    > .notifications-bc {
      top: auto;
      bottom: 0;
      margin: 0 auto;
      left: 50%;
      margin-left: -${defaultWidth / 2}px;
    }

    > div {
      font-family: inherit;
      position: fixed;
      width: ${defaultWidth}px;
      padding: 0 10px 10px 10px;
      z-index: 9998;
      box-sizing: border-box;
      height: auto;

      > .notification.notification-visible {
        opacity: 1;
      }

      > .notification-hidden {
        opacity: 0;
      }

      > .notification {
        position: relative;
        width: 100%;
        cursor: pointer;
        border-radius: 2px;
        font-size: 13px;
        margin: 10px 0 0;
        padding: 0;
        display: block;
        box-sizing: border-box;
        opacity: 0;
        transition: 0.3s ease-in-out;
        transform: translate3d(0, 0, 0);
        will-change: transform, opacity;
        color: ${colors.grayDark2};
        font-family: Roboto, sans-serif;
        box-shadow: 0 5px 7px 0 rgba(0, 0, 0, 0.06);

        ::after {
          content: " ";
          display: block;
          height: 0;
          clear: both;
        }

        > .notification-title {
          font-size: 14px;
          margin: 0 0 5px 0;
          padding: 0;
          font-weight: bold;
        }

        > .notification-message {
          margin: 0;
          padding: 0;
          border-right: solid 1px #dededf;
          font-family: Roboto, sans-serif;
          font-weight: normal;
          font-size: 16px;
          letter-spacing: 0.3px;
          float: left;
          width: 78%;

          > div {
            padding: 20px;
          }
        }

        > .notification-dismiss {
          position: absolute;
          top: calc(50% - 20px);
          right: calc(10% - 20px);
          width: 40px;
          height: 40px;
          font-family: Arial, sans-serif;
          font-size: 40px;
          line-height: 40px;
          font-weight: normal;
          text-align: center;
        }
      }

      .notification-success {
        background-color: ${colors.success};
        color: ${colors.white};
        > .notification-dismiss {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .notification-warning {
        background-color: ${colors.warning};
        color: ${colors.black};
        > .notification-message {
          border-right-color: rgba(0, 0, 0, 0.5);
        }
        > .notification-dismiss {
          color: rgba(0, 0, 0, 0.5);
        }
      }
      .notification-error {
        background-color: ${colors.red};
        color: ${colors.white};
        > .notification-dismiss {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .notification-info {
        background-color: ${colors.white};
        color: ${colors.grayDark2};
        > .notification-dismiss {
          color: #d8d8d8;
        }
      }
    }
  }
`

/*
 * <NotificationProvider/>
 */
class NotificationProvider extends Component {
  constructor(...args) {
    super(...args)
    this.addNotification = this.addNotification.bind(this)
    this.success = options => this.addNotification(options, 'success')
    this.warning = options => this.addNotification(options, 'warning')
    this.error = options => this.addNotification(options, 'error')
    this.info = options => this.addNotification(options, 'info')
  }

  // TODO: Remove the context type when integrated with Redux
  getChildContext() {
    return {
      notification: {
        success: this.success,
        warning: this.warning,
        error: this.error,
        info: this.info,
      },
    }
  }

  addNotification(options, level = 'info') {
    const notificationOpts = {
      ...options,
      level,
      uid: options.uid || Date.now(),
    }
    if (notificationOpts.message) {
      notificationOpts.children = (
        <div className="notification-message">
          <div>{notificationOpts.message}</div>
        </div>
      )
      delete notificationOpts.message
    }
    this.notificationSystem.addNotification(notificationOpts)
    return notificationOpts
  }

  render() {
    const { ref, children } = this.props
    return (
      <Container ref={ref}>
        <NotificationSystem
          ref={(c) => { this.notificationSystem = c }}
          style={false} // eslint-disable-line react/style-prop-object
        />
        {children}
      </Container>
    )
  }
}

NotificationProvider.childContextTypes = {
  notification: PropTypes.shape({
    success: PropTypes.func.isRequired,
    warning: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
  }),
}

NotificationProvider.propTypes = {
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  children: PropTypes.node,
}

export default NotificationProvider
