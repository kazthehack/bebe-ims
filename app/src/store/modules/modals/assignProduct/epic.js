//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'
import { OPEN_ASSIGN_PRODUCT } from './actionTypes'
import { setSearchTerm, setResult } from './actions'

const resetSearchTerm = actions$ => actions$.pipe(
  ofType(OPEN_ASSIGN_PRODUCT),
  mergeMap(() => of(
    setSearchTerm(''),
    setResult({ result: undefined }),
  )),
)

export default combineEpics(
  resetSearchTerm,
)
