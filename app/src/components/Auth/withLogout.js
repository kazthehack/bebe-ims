//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { logout } from 'store/modules/auth'

const withLogout = connect(null, { logout })

export default withLogout
