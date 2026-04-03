//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'salesByPackage.table.page') || 0
export const getSort = state => get(state, 'salesByPackage.table.sort')
export const getSearchTerm = state => get(state, 'salesByPackage.table.searchTerm')
export const getResult = state => get(state, 'salesByPackage.table.result')
export const getTable = state => get(state, 'salesByPackage.table') || {}
export const getSalesByPackage = state => get(state, 'salesByPackage') || {}
export const getStartDate = state => get(state, 'salesByPackage.startDate')
export const getEndDate = state => get(state, 'salesByPackage.endDate')
