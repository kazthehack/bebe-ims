//  Copyright (c) 2019 First Foundry Inc. All rights reserved.
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getStartDate,
  getEndDate,
  getReports,
  getTransactionData,
  getTable,
  getSearchTerm,
  getResult,
  getNextReceipt,
  getPreviousReceipt,
} from './selectors'
import {
  setStartDate,
  setEndDate,
  openTransactionReportList,
  setTransactionData,
  setPage,
  setSort,
  setResult,
  setSearchTerm,
  setNextReceipt,
  setPreviousReceipt,
} from './actions'

const mapStateToProps = (state = {}) => ({
  startDate: getStartDate(state),
  endDate: getEndDate(state),
  reports: getReports(state),
  transactionData: getTransactionData(state),
  transactionHistoryReportTable: getTable(state),
  tableSearchTerm: getSearchTerm(state),
  tableResult: getResult(state),
  nextReceipt: getNextReceipt(state),
  previousReceipt: getPreviousReceipt(state),
})

export default compose(
  connect(mapStateToProps, {
    setStartDate,
    setEndDate,
    openTransactionReportList,
    setTransactionData,
    setPage,
    setSort,
    setResult,
    setSearchTerm,
    setNextReceipt,
    setPreviousReceipt,
  }),
)
