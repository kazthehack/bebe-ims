//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

export const getStartDate = state => get(state, 'budtenderDetailed.startDate')
export const getEndDate = state => get(state, 'budtenderDetailed.endDate')
