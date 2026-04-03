//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import {
  SET_PAGE,
  SET_RESULT,
  SET_UNSEEN,
  SET_SEARCH_TERM,
  SET_FILTER,
} from './actionTypes'

export const setPage = ({ page }) => ({
  type: SET_PAGE,
  payload: {
    page,
  },
})

export const setFilter = ({ level }) => ({
  type: SET_FILTER,
  payload: {
    level,
  },
})

export const setResult = ({ result }) => ({
  type: SET_RESULT,
  payload: {
    result,
  },
})

export const setSearchTerm = ({ searchTerm }) => ({
  type: SET_SEARCH_TERM,
  payload: {
    searchTerm,
  },
})

export const setNotificationsUnseen = ({ count }) => ({
  type: SET_UNSEEN,
  payload: {
    count,
  },
})
