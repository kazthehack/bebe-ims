//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import moment from 'moment-timezone'
import {
  SET_START_DATE,
  SET_END_DATE,
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


export default combineReducers({
  startDate,
  endDate,
})
