//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { isString, pick, conformsTo, isFunction } from 'lodash'

/**
 * configureStorage
 * utility method for dealing with persisted redux state using either
 * localStorage or sessionStorage.  implementation assumes:
 * - all selected paths of redux state to persist are JSON serializable.
 * - redux store uses plain JS object for state (i.e. no Immutable.js).
 * - HTML5 "Web Storage" API is available; won't fallbak to "cookie" storage.
 *
 * TODO: Only offer a very basic API for simple, flexible state persistence and
 * hydration.  More complete implementations of this exist as thirdparty libs
 * that we may want to research in the future (e.g. redux-storage,
 * redux-localstorage, redux-persist, etc).
 *
 * @param {Object} config - configuration object
 * @param {Storage} config.storage - storage object (session or local)
 *   https://developer.mozilla.org/en-US/docs/Web/API/Storage
 * @param {string} config.paths - paths in redux to persist. paths are
 *   dot-seperated strings mapping to branches/slices of state in redux store.
 * @param {string} config.stateKey - storage item key for serialized state
 * @param {string} config.tokenKey - storage item key to use as basic invalidation token
 * @param {string} config.token - invalidation token value
 */
export default function configureStorage({
  storage,
  paths = [],
  stateKey = 'state',
  tokenKey = 'token',
  token,
}) {
  // uses lodash conformsTo so that this check can work with mocked interface
  // when running in test environment.
  // TODO: would be nice to find a way to use a simpler `instanceof Storage`
  // check here (or Flow/Typescript), but will require refactor.
  if (!conformsTo(storage, {
    getItem: isFunction,
    setItem: isFunction,
    removeItem: isFunction,
    key: isFunction,
    clear: isFunction,
  })) {
    throw new Error(`
      makeReduxStorage requires 'storage' option to implement 'Storage' interface:
      https://developer.mozilla.org/en-US/docs/Web/API/Storage
    `)
  }

  /**
   * loadState
   * loads state from configured Storage
   *
   * @returns {Object|undefined} parsed state object from Storage or undefined
   */
  const loadState = () => {
    try {
      const serializedState = storage.getItem(stateKey)
      if (!isString(serializedState)) {
        return undefined
      }
      return JSON.parse(serializedState)
    } catch (err) {
      // if any errors, just return undefined so that we don't supply initial
      // redux state with any persisted data (will use default state defined by
      // the reducer functions' default values).
      return undefined
    }
  }

  /**
   * saveState
   * loads state from configured Storage
   *
   * @param {Object} state - top level redux state, returned by store.getState()
   */
  const saveState = (state = {}) => {
    try {
      const pickedState = pick(state, ...paths)
      const serializedState = JSON.stringify(pickedState)
      storage.setItem(stateKey, serializedState)
    } catch (err) {
      // ignore write errors
      // TODO: error handling? or maybe just allow error to be thrown for write errors
    }
  }

  /**
   * clearState
   * clears all persisted state managed by Storage configuration
   */
  const clearState = () => {
    try {
      // only remove values from sessionStorage that we manage with our helper
      // other npm libs may use sessionStorage as well (like for persisting
      // router history for dev tools integration).
      storage.removeItem(stateKey)
    } catch (err) {
      // ignore write errors
      // TODO: may want to find good way to handle errors if necessary
    }
  }

  const persistedToken = storage.getItem(tokenKey)
  if (token && token !== persistedToken) {
    clearState()
    storage.setItem(tokenKey, token)
  }

  return {
    loadState,
    saveState,
    clearState,
  }
}
