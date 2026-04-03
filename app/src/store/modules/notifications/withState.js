//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  getTable,
  getResult,
  getLevel,
  getCount,
  getSearchTerm,
  getPage,
} from './selectors'
import {
  setPage,
  setResult,
  setFilter,
  setNotificationsUnseen,
  setSearchTerm,
} from './actions'

const mapStateToProps = (state = {}) => ({
  notificationsTable: getTable(state),
  tableResult: getResult(state),
  tableSearchTerm: getSearchTerm(state),
  tableFilter: getLevel(state),
  notificationsUnseen: getCount(state),
  tablePage: getPage(state),
})

export default compose(
  connect(mapStateToProps, {
    setPage,
    setResult,
    setFilter,
    setNotificationsUnseen,
    setSearchTerm,
  }),
)
