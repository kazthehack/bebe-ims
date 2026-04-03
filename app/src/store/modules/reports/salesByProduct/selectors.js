//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'salesByProduct') || {}
export const getStartDate = state => get(state, 'salesByProduct.startDate')
export const getEndDate = state => get(state, 'salesByProduct.endDate')
