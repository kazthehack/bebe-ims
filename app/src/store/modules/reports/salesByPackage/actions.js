//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import {
  SET_PAGE,
  SET_SEARCH_TERM,
  SET_SORT,
  SET_RESULT,
  SET_START_DATE,
  SET_END_DATE,
  OPEN_SALES_BY_PACKAGE_REPORT_LIST,
} from './actionTypes'

export const openSalesByPackageReportList = () => ({
  type: OPEN_SALES_BY_PACKAGE_REPORT_LIST,
})

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})

export const setPage = ({ page }) => ({
  type: SET_PAGE,
  payload: {
    page,
  },
})

export const setSearchTerm = ({ searchTerm }) => ({
  type: SET_SEARCH_TERM,
  payload: {
    searchTerm,
  },
})

export const setSort = ({ sort }) => ({
  type: SET_SORT,
  payload: {
    sort,
  },
})

export const setResult = ({ result }) => ({
  type: SET_RESULT,
  payload: {
    result,
  },
})
