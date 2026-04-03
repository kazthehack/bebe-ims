//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import {
  SET_START_DATE,
  SET_END_DATE,
  OPEN_TRANSACTION_REPORT_LIST,
  SET_TRANSACTION_DATA,
  SET_PAGE,
  SET_SORT,
  SET_SEARCH_TERM,
  SET_RESULT,
  SET_NEXT_RECEIPT,
  SET_PREVIOUS_RECEIPT,
} from './actionTypes'

export const openTransactionReportList = () => ({
  type: OPEN_TRANSACTION_REPORT_LIST,
})

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})

export const setTransactionData = props => ({
  type: SET_TRANSACTION_DATA,
  payload: props,
})

export const setNextReceipt = props => ({
  type: SET_NEXT_RECEIPT,
  payload: props,
})

export const setPreviousReceipt = props => ({
  type: SET_PREVIOUS_RECEIPT,
  payload: props,
})

export const setPage = ({ page }) => ({
  type: SET_PAGE,
  payload: {
    page,
  },
})

export const setSort = ({ sort }) => ({
  type: SET_SORT,
  payload: {
    sort,
  },
})

export const setSearchTerm = ({ searchTerm }) => ({
  type: SET_SEARCH_TERM,
  payload: {
    searchTerm,
  },
})

export const setResult = ({ result }) => ({
  type: SET_RESULT,
  payload: {
    result,
  },
})
