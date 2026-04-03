//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'employees.table.page') || 0
export const getSort = state => get(state, 'employees.table.sort')
export const getSearchTerm = state => get(state, 'employees.table.searchTerm')
export const getResult = state => get(state, 'employees.table.result')
export const getTable = state => get(state, 'employees.table') || {}
