//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { clearAuthSession } from 'api/authSession'
import { logout } from 'store/modules/auth'

const mapDispatchToProps = dispatch => ({
  logout: () => {
    clearAuthSession()
    dispatch(logout())
  },
})

const withLogout = connect(null, mapDispatchToProps)

export default withLogout
