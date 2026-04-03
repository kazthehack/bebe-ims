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
  openAssignPackage,
} from './actions'

const mapStateToProps = (state = {}) => ({
  assignPackageTable: getTable(state),
  assignPackageResult: getResult(state),
  assignPackageSearchTerm: getSearchTerm(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setSearchTerm,
    setSort,
    setResult,
    openAssignPackage,
  }),
)
