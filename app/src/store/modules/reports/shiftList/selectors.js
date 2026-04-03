//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'shiftList') || {}
export const getStartDate = state => get(state, 'shiftList.startDate')
export const getEndDate = state => get(state, 'shiftList.endDate')
