//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getResult,
  getSearchTerm,
} from './selectors'
import {
  setPage,
  setSearchTerm,
  setSort,
  setResult,
} from './actions'

const mapStateToProps = (state = {}) => ({
  priceGroupsTable: getTable(state),
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
