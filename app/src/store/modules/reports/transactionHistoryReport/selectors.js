//  Copyright (c) 2019 First Foundry Inc. All rights reserved.
import { get } from 'lodash'

export const getReports = state => get(state, 'transactionHistoryReport') || {}
export const getStartDate = state => get(state, 'transactionHistoryReport.startDate')
export const getEndDate = state => get(state, 'transactionHistoryReport.endDate')
export const getTransactionData = state => get(state, 'transactionHistoryReport.transactionData')
export const getPage = state => get(state, 'transactionHistoryReport.table.page') || 0
export const getSort = state => get(state, 'transactionHistoryReport.table.sort')
export const getTable = state => get(state, 'transactionHistoryReport.table') || {}
export const getSearchTerm = state => get(state, 'transactionHistoryReport.table.searchTerm')
export const getResult = state => get(state, 'transactionHistoryReport.table.result') || []
export const getNextReceipt = state => get(state, 'transactionHistoryReport.nextReceipt')
export const getPreviousReceipt = state => get(state, 'transactionHistoryReport.previousReceipt')
