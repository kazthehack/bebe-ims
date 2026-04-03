//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { combineReducers } from 'redux'
import { matchesType } from 'redux-foundry'
import { get } from 'lodash'
import { AUTH_TOKEN } from './actionTypes'

const authTokenAttr = (name, ...types) => (state = null, action) => {
  if (matchesType(action, AUTH_TOKEN, ...types)) {
    return get(action, `payload.${name}`, null)
  }
  return state
}

const expires = authTokenAttr('expires')

export default combineReducers({
  expires,
})
