//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import {
  SET_START_DATE,
  SET_END_DATE,
  OPEN_BUDTENDER_DETAILED_REPORT_LIST,
} from './actionTypes'

export const openBudtenderDetailedReportList = () => ({
  type: OPEN_BUDTENDER_DETAILED_REPORT_LIST,
})

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})
