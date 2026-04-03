//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'taxes.table.page') || {}
export const getSort = state => get(state, 'taxes.table.sort')
export const getSearchTerm = state => get(state, 'taxes.table.searchTerm')
export const getResult = state => get(state, 'taxes.table.result')
export const getTable = state => get(state, 'taxes.table') || {}
