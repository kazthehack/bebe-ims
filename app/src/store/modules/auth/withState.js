//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getAuth,
  getAuthExpires,
  getExpiresDate,
} from './selectors'
import {
  setAuthToken,
  logout,
} from './actions'

const mapStateToProps = (state = {}) => ({
  auth: getAuth(state),
  authExpires: getAuthExpires(state),
  authExpiresDate: getExpiresDate(state),
})

export default compose(
  connect(mapStateToProps, {
    setAuthToken,
    logout,
  }),
)
