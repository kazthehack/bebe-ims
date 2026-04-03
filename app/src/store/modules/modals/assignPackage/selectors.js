//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'assignPackage.table.page') || 0
export const getSort = state => get(state, 'assignPackage.table.sort')
export const getSearchTerm = state => get(state, 'assignPackage.table.searchTerm')
export const getTable = state => get(state, 'assignPackage.table') || {}
export const getResult = state => get(state, 'assignPackage.table.result') || []
