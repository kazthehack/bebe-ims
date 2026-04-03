//  Copyright (c) 2021 First Foundry LLC. All rights reserved.

import { combineReducers } from 'redux'
import moment from 'moment-timezone'
import {
  SET_START_DATE,
  SET_END_DATE,
} from './actionTypes'

const currentDate = new Date()
const defaultStartDate = moment.tz(currentDate.setDate(currentDate.getDate() - 7), 'America/Los_Angeles').toDate()
const startDate = (date = defaultStartDate, { type, payload }) => {
  switch (type) {
    case SET_START_DATE: {
      return payload
    }
    default: return date
  }
}

const defaultEndDate = moment.tz(new Date(), 'America/Los_Angeles').toDate()
const endDate = (date = defaultEndDate, { type, payload }) => {
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
