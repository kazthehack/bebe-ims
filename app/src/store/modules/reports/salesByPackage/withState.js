//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getResult,
  getSearchTerm,
  getStartDate,
  getEndDate,
  getSalesByPackage,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setSort,
  setResult,
  setStartDate,
  setEndDate,
  openSalesByPackageReportList,
} from './actions'

const mapStateToProps = (state = {}) => ({
  salesByPackageTable: getTable(state),
  getSalesByPackage: getSalesByPackage(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
  startDate: getStartDate(state),
  endDate: getEndDate(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setSort,
    setResult,
    setStartDate,
    setEndDate,
    openSalesByPackageReportList,
  }),
)
