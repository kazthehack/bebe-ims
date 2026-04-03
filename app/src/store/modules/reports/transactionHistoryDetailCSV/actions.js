//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import {
  SET_START_DATE,
  SET_END_DATE,
  OPEN_TRANSACTION_DETAIL_CSV_REPORT,
} from './actionTypes'

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})

export const openTransactionHistoryDetail = () => ({
  type: OPEN_TRANSACTION_DETAIL_CSV_REPORT,
})
