//  Copyright (c) 2020 First Foundry LLC. All rights reserved.

import { combineReducers } from 'redux'
import moment from 'moment-timezone'
import {
  SET_PAGE,
  SET_SEARCH_TERM,
  SET_SORT,
  SET_RESULT,
  SET_START_DATE,
  SET_END_DATE,
} from './actionTypes'

const getDefaultStartDate = () => moment.tz(new Date().setDate(new Date().getDate() - 7), 'America/Los_Angeles').toDate()
const getDefaultEndDate = () => moment.tz(new Date(), 'America/Los_Angeles').toDate()

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
    case SET_SORT: {
      return {
        ...state,
        sort: payload.sort,
      }
    }
    default: return state
  }
}

const startDate = (date = getDefaultStartDate(), { type, payload }) => {
  switch (type) {
    case SET_START_DATE: {
      return payload
    }
    default: return date
  }
}

const endDate = (date = getDefaultEndDate(), { type, payload }) => {
  switch (type) {
    case SET_END_DATE: {
      return payload
    }
    default: return date
  }
}

export default combineReducers({
  table,
  startDate,
  endDate,
})
