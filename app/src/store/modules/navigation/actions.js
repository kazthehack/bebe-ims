//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { SIDE_NAVIGATION_TRIGGERED } from './actionTypes'

// eslint-disable-next-line import/prefer-default-export
export const sideNavigationTriggered = (destination = {}) => ({
  type: SIDE_NAVIGATION_TRIGGERED,
  payload: destination,
})
