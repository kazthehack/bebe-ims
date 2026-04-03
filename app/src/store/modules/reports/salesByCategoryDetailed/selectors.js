//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getStartDate = state => get(state, 'salesByCategoryDetailed.startDate')
export const getEndDate = state => get(state, 'salesByCategoryDetailed.endDate')
