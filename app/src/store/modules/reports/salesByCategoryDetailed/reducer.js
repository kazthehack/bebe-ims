//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import {
  SET_START_DATE,
  SET_END_DATE,
} from './actionTypes'

const startDate = (date = new Date(), { type, payload }) => {
  switch (type) {
    case SET_START_DATE: {
      return payload
    }
    default: return date
  }
}

const endDate = (date = new Date(), { type, payload }) => {
  switch (type) {
    case SET_END_DATE: {
      return payload
    }
    default: return date
  }
}

export default combineReducers({
  startDate,
  endDate,
})
