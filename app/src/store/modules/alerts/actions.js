//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import {
  SET_MESSAGE,
} from './actionTypes'

// eslint-disable-next-line import/prefer-default-export
export const setMessage = msg => ({
  type: SET_MESSAGE,
  payload: {
    msg,
  },
})
