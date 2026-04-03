//  Copyright (c) 2021 First Foundry LLC. All rights reserved.

import { combineReducers } from 'redux'
import {
  SET_MESSAGE,
} from './actionTypes'

const alert = (state = {}, { payload = {}, type = '' }) => {
  switch (type) {
    case SET_MESSAGE: {
      return {
        ...state,
        msg: payload.msg,
      }
    }
    default: return state
  }
}

export default combineReducers({
  alert,
})
