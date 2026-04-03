//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getStartDate,
  getEndDate,
} from './selectors'
import {
  setStartDate,
  setEndDate,
  openBudtenderDetailedReportList,
} from './actions'

const mapStateToProps = (state = {}) => ({
  startDate: getStartDate(state),
  endDate: getEndDate(state),
})

export default compose(
  connect(mapStateToProps, {
    setStartDate,
    setEndDate,
    openBudtenderDetailedReportList,
  }),
)
