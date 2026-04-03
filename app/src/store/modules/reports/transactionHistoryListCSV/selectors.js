//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getReports = state => get(state, 'transactionHistoryListCSV') || {}
export const getStartDate = state => get(state, 'transactionHistoryListCSV.startDate')
export const getEndDate = state => get(state, 'transactionHistoryListCSV.endDate')
