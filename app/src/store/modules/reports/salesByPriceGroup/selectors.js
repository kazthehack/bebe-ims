//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'salesByPriceGroup') || {}
export const getStartDate = state => get(state, 'salesByPriceGroup.startDate')
export const getEndDate = state => get(state, 'salesByPriceGroup.endDate')
