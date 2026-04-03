//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { persistAction } from '../../middleware'
import { AUTH_TOKEN, LOGOUT } from './actionTypes'

/**
 * provides authToken object to redux store
 * Instead of using Apollo/GQL "client-side" state management, redux seemed a bit
 * simpler.  We can reconsider later on after we have more experience with gql &
 * apollo, but leveraging redux to manage global, client-side state in an Apollo
 * application still doesn't seem like a terrible idea to me :).  I still think we
 * should limit our use of redux in this application to small things like this, but
 * we can also use newer React Component features now (like Context providers) for
 * things as well.  Good rule of thumb is if the state needs to be global, and we
 * may want to consider localStorage, then use redux.  Otherwise, use Apollo or React
 * Component state.
 * @param {{}} authToken
 * @param {string} authToken.accessToken
 * @param {string} authToken.refreshToken
 * @param {string} authToken.expires // e.g. 2018-12-08T00:58:37.615373
 */
export const setAuthToken = token => persistAction({
  type: AUTH_TOKEN,
  payload: token,
})

export const logout = () => ({
  type: LOGOUT,
})
