//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { withRouter } from 'react-router'
import { clearAuthSession } from 'api/authSession'

const mapStateToProps = () => ({
  accessToken: sessionStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
})

// basic logout handler to react to authtoken removal from local/session storage
// by clearing local|sessionStorage & redirecting to login.
const withLogoutHandler = compose(
  withRouter,
  connect(mapStateToProps),
  lifecycle({
    componentDidUpdate(prevProps = {}) {
      const { refreshToken, history } = this.props
      const prevRefreshToken = prevProps.refreshToken
      const currentPath = history.location.pathname
      if ((!refreshToken && prevRefreshToken)) {
        clearAuthSession()
        if (currentPath !== '/login') history.push('/login')
      }
    },
  }),
)

export default withLogoutHandler
