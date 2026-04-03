//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getSearchTerm,
  getResult,
  getFilters,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setFilters,
  setSort,
  setResult,
} from './actions'

const mapStateToProps = (state = {}) => ({
  packagesTable: getTable(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
  tableFilters: getFilters(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setFilters,
    setSort,
    setResult,
  }),
)
