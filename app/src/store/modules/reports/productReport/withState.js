//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getSearchTerm,
  getResult,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setSort,
  setResult,
} from './actions'

const mapStateToProps = (state = {}) => ({
  productReportTable: getTable(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setSort,
    setResult,
  }),
)
