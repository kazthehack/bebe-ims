//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'products.table.page', 0)
export const getSort = state => get(state, 'products.table.sort')
export const getSearchTerm = state => get(state, 'products.table.searchTerm')
export const getResult = state => get(state, 'products.table.result')
export const getTable = state => get(state, 'products.table', {})
export const getFilters = state => get(state, 'products.table.filters')
