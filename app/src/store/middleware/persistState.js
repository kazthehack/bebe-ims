//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { matchesMeta } from 'redux-foundry'
import { isPlainObject } from 'lodash'
import { sessionStore, localStore } from '../storage'

export const PERSIST = '@@persist'

export const persistAction = (action) => {
  const { meta = {} } = action
  const nextMeta = isPlainObject(meta) ? meta : { ownMeta: meta }
  return {
    ...action,
    meta: { ...nextMeta, [PERSIST]: true },
  }
}

// Application-specific redux state persistence middleware.  Will handle any action
// with a PERSIST=true flag attached as metadata by saving JSON encoded redux state to storage.
// Keeping this simple as possible for now, since we only need a few things persisted for Auth
// and Venue context state atm.  We can expand this to make easier to use if we need more redux
// state synced with local|sessionStorage.
//
// TODO: I usually write this sort of app-specific logic into an "Epic" function, but not
// sure I'm ready to add both redux-observable and rxjs as dependencies to bloom-portal
// since we'll be relying on Apollo for the most part for similar things, and only using
// redux for minimal global client-side state management and local storage.
// We may also want to consider switching entirely to apollo-link-state for similar
// unctionality, but we may want to wait until after React releases new "hooks" api to see if
// this changes implementation details or anything regarding best practices in Apollo.
const persistState = ({ getState }) => next => (action = {}) => {
  if (action.meta && matchesMeta(action, { [PERSIST]: true })) {
    const result = next(action)
    const state = getState()
    sessionStore.saveState(state)
    localStore.saveState(state)
    return result
  }

  return next(action)
}

export default persistState
