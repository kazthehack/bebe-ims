//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import { SIDE_NAVIGATION_TRIGGERED } from './actionTypes'

const currentDestination = (initialState = null, { type, payload }) => {
  switch (type) {
    case SIDE_NAVIGATION_TRIGGERED: {
      return payload
    }
    default: return initialState
  }
}

export default combineReducers({
  currentDestination,
})
