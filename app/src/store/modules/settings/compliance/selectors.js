//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getSort = state => get(state, 'compliance.table.sort')
export const getResult = state => get(state, 'compliance.table.result')
export const getSearchTerm = state => get(state, 'compliance.table.searchTerm')
export const getTable = state => get(state, 'compliance.table') || {}
