//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getStartDate,
  getEndDate,
  getSearchTerm,
  getResult,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setSort,
  setResult,
  setStartDate,
  setEndDate,
  openBudtenderReportList,
} from './actions'

const mapStateToProps = (state = {}) => ({
  budtenderTable: getTable(state),
  startDate: getStartDate(state),
  endDate: getEndDate(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setSort,
    setResult,
    setStartDate,
    setEndDate,
    openBudtenderReportList,
  }),
)
