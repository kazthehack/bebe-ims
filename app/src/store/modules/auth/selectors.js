//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { createSelector } from 'reselect'
import { get } from 'lodash'

export const getAuth = state => get(state, 'auth') || {}
export const getAuthExpires = state => get(state, 'auth.expires')
export const getExpiresDate = state => new Date(getAuthExpires(state))

export const selectAuthToken = createSelector(
  getAuthExpires,
  expires => ({
    expires,
  }),
)
