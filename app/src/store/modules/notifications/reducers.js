//  Copyright (c) 2020 First Foundry LLC. All rights reserved.

import { combineReducers } from 'redux'
import {
  SET_PAGE,
  SET_RESULT,
  SET_UNSEEN,
  SET_SEARCH_TERM,
  SET_FILTER,
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
    case SET_RESULT: {
      return {
        ...state,
        result: payload.result,
      }
    }
    case SET_FILTER: {
      return {
        ...state,
        level: payload.level,
      }
    }
    default: return state
  }
}

const count = (state = {}, { payload = {}, type = '' }) => {
  switch (type) {
    case SET_UNSEEN: {
      return {
        ...state,
        count: payload.count,
      }
    }
    default: return state
  }
}

export default combineReducers({
  table,
  count,
})
