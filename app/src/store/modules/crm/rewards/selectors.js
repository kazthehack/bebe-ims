//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'rewards.table.page') || 0
export const getSort = state => get(state, 'rewards.table.sort')
export const getSearchTerm = state => get(state, 'rewards.table.searchTerm')
export const getResult = state => get(state, 'rewards.table.result')
export const getTable = state => get(state, 'rewards.table') || {}
