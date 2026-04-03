import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import ApiNotifications from './ApiNotifications'
import Notifications from './Notifications'

const NotificationRoutes = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/api`} component={ApiNotifications} />
    <Route path={match.url} component={Notifications} />
  </Switch>
)

NotificationRoutes.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
}

export default withRouter(NotificationRoutes)
