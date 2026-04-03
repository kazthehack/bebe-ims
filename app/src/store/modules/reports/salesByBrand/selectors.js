//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'salesByBrand') || {}
export const getStartDate = state => get(state, 'salesByBrand.startDate')
export const getEndDate = state => get(state, 'salesByBrand.endDate')
