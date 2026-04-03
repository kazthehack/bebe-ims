//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getStartDate,
  getEndDate,
  getReports,
} from './selectors'
import {
  setStartDate,
  setEndDate,
  openTransactionHistoryDetail,
} from './actions'

const mapStateToProps = (state = {}) => ({
  startDate: getStartDate(state),
  endDate: getEndDate(state),
  reports: getReports(state),
})

export default compose(
  connect(mapStateToProps, {
    setStartDate,
    setEndDate,
    openTransactionHistoryDetail,
  }),
)
