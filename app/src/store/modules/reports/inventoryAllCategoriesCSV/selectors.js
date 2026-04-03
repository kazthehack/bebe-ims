//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'inventoryAllCategories') || {}
export const getStartDate = state => get(state, 'inventoryAllCategories.startDate')
export const getEndDate = state => get(state, 'inventoryAllCategories.endDate')
