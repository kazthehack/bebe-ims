//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getResult,
  getSearchTerm,
  getPage,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setSort,
  setResult,
  openAssignProduct,
} from './actions'

const mapStateToProps = (state = {}) => ({
  assignProductTable: getTable(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
  tablePage: getPage(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setSort,
    setResult,
    openAssignProduct,
  }),
)
