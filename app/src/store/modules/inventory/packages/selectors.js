//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'packages.table.page') || 0
export const getSort = state => get(state, 'packages.table.sort')
export const getSearchTerm = state => get(state, 'packages.table.searchTerm')
export const getFilters = state => get(state, 'packages.table.filters')
export const getResult = state => get(state, 'packages.table.result')
export const getTable = state => get(state, 'packages.table') || {}
