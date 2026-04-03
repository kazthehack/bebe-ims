//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'customers.table.page') || 0
export const getSort = state => get(state, 'customers.table.sort')
export const getSearchTerm = state => get(state, 'customers.table.searchTerm')
export const getResult = state => get(state, 'customers.table.result')
export const getTable = state => get(state, 'customers.table') || {}
