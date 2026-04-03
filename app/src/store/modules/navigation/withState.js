//  Copyright (c) 2019 First Foundry Inc. All rights reserved.
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { sideNavigationTriggered } from './actions'
import { getCurrentDestination } from './selectors'

const mapStateToProps = (state = {}) => ({
  currentDestination: getCurrentDestination(state),
})

export default compose(
  connect(mapStateToProps, {
    sideNavigationTriggered,
  }),
)
