//  Copyright (c) 2020 First Foundry LLC. All rights reserved.

import { combineReducers } from 'redux'
import {
  SET_PAGE,
  SET_SEARCH_TERM,
  SET_FILTERS,
  SET_SORT,
  SET_RESULT,
} from './actionTypes'

const table = (state = {}, { payload = {}, type = '' }) => {
  switch (type) {
    case SET_PAGE: {
      return {
        ...state,
        page: payload.page,
      }
    }
    case SET_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: payload.searchTerm,
      }
    }
    case SET_FILTERS: {
      return {
        ...state,
        filters: payload.filters,
      }
    }
    case SET_RESULT: {
      return {
        ...state,
        result: payload.result,
      }
    }
    case SET_SORT: {
      return {
        ...state,
        sort: payload.sort,
      }
    }
    default: return state
  }
}

export default combineReducers({
  table,
})
