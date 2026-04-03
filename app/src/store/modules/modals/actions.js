//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import {
  stackActions,
} from 'redux-foundry'
import { ModalStackTypes } from './actionTypes'

export const ModalStackActions = stackActions(ModalStackTypes)

export const {
  push,
  pop,
  replace,
  clear,
  remove,
} = ModalStackActions
