//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'budtender.table.page') || 0
export const getSort = state => get(state, 'budtender.table.sort')
export const getSearchTerm = state => get(state, 'budtender.table.searchTerm')
export const getTable = state => get(state, 'budtender.table') || {}
export const getResult = state => get(state, 'budtender.table.result') || []
export const getStartDate = state => get(state, 'budtender.startDate')
export const getEndDate = state => get(state, 'budtender.endDate')
