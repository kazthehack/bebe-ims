//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getPage = state => get(state, 'notifications.table.page') || 0
export const getLevel = state => get(state, 'notifications.table.level') || undefined
export const getResult = state => get(state, 'notifications.table.result')
export const getSearchTerm = state => get(state, 'notifications.table.searchTerm')
export const getTable = state => get(state, 'notifications.table') || {}
export const getCount = state => get(state, 'notifications.count') || {}

