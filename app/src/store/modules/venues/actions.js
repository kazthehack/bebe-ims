//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { persistAction } from '../../middleware'

import { SET_LIST, SELECT } from './actionTypes'

export const setList = newVenueList => ({
  type: SET_LIST,
  payload: newVenueList,
})

export const select = newVenueId => persistAction({
  type: SELECT,
  payload: newVenueId,
})
