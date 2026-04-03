//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'inventoryCategoryDetail') || {}
export const getStartDate = state => get(state, 'inventoryCategoryDetail.startDate')
export const getEndDate = state => get(state, 'inventoryCategoryDetail.endDate')
