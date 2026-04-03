//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import configureStorage from 'utils/reduxStorage'

export const localStore = configureStorage({
  storage: localStorage,
  paths: [],
  stateKey: 'state',
  token: 'v1',
})

export const sessionStore = configureStorage({
  storage: sessionStorage,
  paths: [
    'venues.selectedId',
  ],
  stateKey: 'state',
  token: 'v1',
})
