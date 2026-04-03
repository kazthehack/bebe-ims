//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import {
  SET_START_DATE,
  SET_END_DATE,
  OPEN_INVENTORY_CATEGORY_DETAIL_CSV_REPORT,
} from './actionTypes'

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})

export const openInventoryCategoryDetailReport = () => ({
  type: OPEN_INVENTORY_CATEGORY_DETAIL_CSV_REPORT,
})
