//  Copyright (c) 2021 First Foundry Inc. All rights reserved.

import { get } from 'lodash'

// eslint-disable-next-line import/prefer-default-export
export const getMessage = state => get(state, 'alerts.alert.msg')
