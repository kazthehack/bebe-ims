import React, { Fragment } from 'react'
import { v4 } from 'uuid'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import { NotificationsContext, getNotification } from 'components/Notifications'

const Item = styled.li`
  margin: 5px 5px 5px 5px;
`

const { Consumer } = NotificationsContext

// Mock notification objects & utls to fiddle with

const withUID = (obj = {}) => ({
  ...obj,
  uid: v4(),
})

const SUCCESS = getNotification('success', 'Success!', 'foobar')

const ERROR = getNotification('error', 'Error!')

const WARNING = getNotification('warning', 'Warning!')

const INFO = getNotification('info', 'Info!')

const LOADING = getNotification('success', 'Loading!!!', '', 'loading', 0, 'none')

const REPLACEABLE = withUID({
  title: 'Removable!',
  level: 'warning',
})

// Example documentative use-case

const NotificationsExample = () => (
  <Fragment>
    <Consumer>
      {({ addNotification, clearNotifications, removeNotification } = {}) => (
        <Fragment>
          <ul>
            <Item>
              <Button primary onClick={() => { addNotification(SUCCESS) }}>
                Test <b>Success</b> notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => { addNotification(ERROR) }}>
                Test <b>Error</b> notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => { addNotification(WARNING) }}>
                Test <b>Warning</b> notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => { addNotification(INFO) }}>
                Test <b>Info</b> notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => { addNotification(LOADING) }}>
                Loading notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => addNotification(REPLACEABLE)}>
                Add <b>Removable</b> notification
              </Button> &nbsp;
              <Button primary onClick={() => removeNotification(REPLACEABLE.uid)}>
                Remove <b>Removable</b> notification
              </Button>
            </Item>
            <Item>
              <Button primary onClick={() => { clearNotifications() }}>
                Clear All Notifications
              </Button>
            </Item>
          </ul>
        </Fragment>
      )}
    </Consumer>
  </Fragment>
)

// TODO: tests/examples with apollo and other async errors

export default NotificationsExample
