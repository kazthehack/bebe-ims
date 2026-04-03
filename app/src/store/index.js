//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { createStore, compose, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import reducer, { epic } from 'store/modules'
import {
  persistStateMiddleware,
} from './middleware'

export * from './storage'

export { default as reducer } from 'store/modules'

const epicMiddleware = createEpicMiddleware()

const middleware = [
  persistStateMiddleware,
  epicMiddleware,
]

function configureStore(initialState = {}) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
    : compose

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  )

  epicMiddleware.run(epic)

  return store
}

export default configureStore
