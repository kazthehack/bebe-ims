//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getMessage,
} from './selectors'
import {
  setMessage,
} from './actions'

const mapStateToProps = (state = {}) => ({
  message: getMessage(state),
})

export default compose(
  connect(mapStateToProps, {
    setMessage,
  }),
)
