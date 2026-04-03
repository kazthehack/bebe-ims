//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'transactionHistoryDetailCSV') || {}
export const getStartDate = state => get(state, 'transactionHistoryDetailCSV.startDate')
export const getEndDate = state => get(state, 'transactionHistoryDetailCSV.endDate')
