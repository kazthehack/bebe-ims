//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'salesByPackageCSV') || {}
export const getStartDate = state => get(state, 'salesByPackageCSV.startDate')
export const getEndDate = state => get(state, 'salesByPackageCSV.endDate')
