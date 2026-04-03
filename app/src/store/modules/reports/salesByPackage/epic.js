//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'
import moment from 'moment-timezone'
import { OPEN_SALES_BY_PACKAGE_REPORT_LIST } from './actionTypes'
import { setStartDate, setEndDate } from './actions'

const getDefaultStartDate = () => moment.tz(new Date().setDate(new Date().getDate() - 7), 'America/Los_Angeles').toDate()
const getDefaultEndDate = () => moment.tz(new Date(), 'America/Los_Angeles').toDate()

const resetDatesEpic = actions$ => actions$.pipe(
  ofType(OPEN_SALES_BY_PACKAGE_REPORT_LIST),
  mergeMap(() => of(
    setStartDate(getDefaultEndDate()),
    setEndDate(getDefaultStartDate()),
  )),
)

export default combineEpics(
  resetDatesEpic,
)
