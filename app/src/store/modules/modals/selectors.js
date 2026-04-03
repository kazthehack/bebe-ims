//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { createSelector } from 'reselect'
import { get } from 'lodash'

export const getModals = state => get(state, 'modals') || []

export const isModalOpen = id => createSelector(
  modals => modals,
  (modals = []) => {
    const len = modals.length
    const last = modals[len - 1]
    return last === id
  },
)

export const isModalInStack = id => createSelector(
  modals => modals,
  (modals = []) => modals.indexOf(id) !== -1,
)
