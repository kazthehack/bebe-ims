//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import {
  SET_START_DATE,
  SET_END_DATE,
  OPEN_SALES_BY_PACKAGE_CSV_REPORT,
} from './actionTypes'

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})

export const openSalesByPackageReport = () => ({
  type: OPEN_SALES_BY_PACKAGE_CSV_REPORT,
})
