//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'
import moment from 'moment-timezone'
import { OPEN_SALES_BY_PRODUCT_REPORT } from './actionTypes'
import { setStartDate, setEndDate } from './actions'

const resetDatesEpic = actions$ => actions$.pipe(
  ofType(OPEN_SALES_BY_PRODUCT_REPORT),
  mergeMap(() => {
    const currentDate = moment.tz({}, 'America/Los_Angeles')
    const newEndDate = currentDate.toDate()
    const newStartDate = currentDate.clone().days(-7).toDate()
    return of(
      setStartDate(newStartDate),
      setEndDate(newEndDate),
    )
  }),
)

export default combineEpics(
  resetDatesEpic,
)
