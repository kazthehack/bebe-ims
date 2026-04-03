//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'discounts.table.page') || 0
export const getSort = state => get(state, 'discounts.table.sort')
export const getSearchTerm = state => get(state, 'discounts.table.searchTerm')
export const getResult = state => get(state, 'discounts.table.result')
export const getTable = state => get(state, 'discounts') || {}
