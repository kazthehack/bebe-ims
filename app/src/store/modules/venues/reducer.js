//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import { SET_LIST, SELECT } from './actionTypes'

const list = (venueList = [], { type, payload }) => {
  switch (type) {
    case SET_LIST: {
      return payload
    }
    default: return venueList
  }
}

const selectedId = (id = null, { type, payload }) => {
  switch (type) {
    case SELECT: {
      return payload
    }
    default: return id
  }
}

export default combineReducers({
  list,
  selectedId,
})
