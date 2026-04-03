//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import moment from 'moment-timezone'
import {
  SET_START_DATE,
  SET_END_DATE,
  SET_TRANSACTION_DATA,
  SET_PAGE,
  SET_SORT,
  SET_SEARCH_TERM,
  SET_RESULT,
  SET_NEXT_RECEIPT,
  SET_PREVIOUS_RECEIPT,
} from './actionTypes'

const getDefaultStartDate = () => moment.tz(new Date().setDate(new Date().getDate() - 7), 'America/Los_Angeles').toDate()
const getDefaultEndDate = () => moment.tz(new Date(), 'America/Los_Angeles').toDate()

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

const transactionData = (state = {}, { type, payload = {} }) => {
  switch (type) {
    case SET_TRANSACTION_DATA: {
      return payload
    }
    default: return state
  }
}

const nextReceipt = (state = {}, { type, payload = {} }) => {
  switch (type) {
    case SET_NEXT_RECEIPT: {
      return payload
    }
    default: return state
  }
}

const previousReceipt = (state = {}, { type, payload = {} }) => {
  switch (type) {
    case SET_PREVIOUS_RECEIPT: {
      return payload
    }
    default: return state
  }
}

const table = (state = {}, { payload = {}, type = '' }) => {
  switch (type) {
    case SET_PAGE: {
      return {
        ...state,
        page: payload.page,
      }
    }
    case SET_SORT: {
      return {
        ...state,
        sort: payload.sort,
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
    default: return state
  }
}

export default combineReducers({
  startDate,
  endDate,
  transactionData,
  table,
  nextReceipt,
  previousReceipt,
})
