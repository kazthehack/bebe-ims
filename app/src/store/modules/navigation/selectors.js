//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getNavigation = state => get(state, 'navigation') || {}
export const getCurrentDestination = state => get(state, 'navigation.currentDestination')
