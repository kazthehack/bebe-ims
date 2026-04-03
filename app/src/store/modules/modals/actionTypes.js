//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import {
  stackActionTypes,
} from 'redux-foundry'

export const PATH = 'modals'
export const ModalStackTypes = stackActionTypes(t => `${PATH}/${t.toUpperCase()}`)
