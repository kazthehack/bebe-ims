//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { compose } from 'recompose'
import { withVenues, withVenueSettings } from 'components/Venue'
import { getTodaysMetrics } from 'ops'
import { withRouter } from 'react-router-dom'
import { graphql } from 'api/operationCompat'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import moment from 'moment-timezone'
import { createSelector } from 'reselect'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import HomePage from './HomePagePure'

export const getReportTimeRange = (timezone, runReportsAt, nowMoment = moment()) => {
  // server provides runReportsAt as a string in form /^\d\d:\d\d:\d\d$/
  // TODO: i think? we should verify behavior and move this parsing
  // to a common util in case server ever needs to change spec.
  const [hours = 0, minutes = 0, seconds = 0] = runReportsAt
    .split(':')
    .map(d => Number(d) || 0)

  const localTime = moment.tz(nowMoment, timezone)

  // set startDate to previous day if is < at hour run_reports_at
  const reportTime = localTime
    .clone()
    .hours(hours)
    .minutes(minutes)
    .seconds(seconds)

  const startDate = localTime.isBefore(reportTime)
    ? reportTime.subtract(1, 'days')
    : reportTime

  // set startDate hour, minutes, & seconds
  const startTime = startDate
    .hours(hours)
    .minutes(minutes)
    .seconds(seconds)
    .milliseconds(0)
    .utc()
    .format()

  // set endDate
  const endTime = startDate
    .add(1, 'day')
    .utc()
    .format()

  // return range
  return { startTime, endTime }
}

const selectOptions = createSelector(
  ({ selectedVenueId }) => selectedVenueId,
  ({ venueSettings }) => venueSettings,
  (selectedVenueId, venueSettings) => {
    const store = (venueSettings && venueSettings.store) || {}
    const settings = store.settings || {}
    const timezone = settings.timezone || store.timezone || 'America/Los_Angeles'
    const runReportsAt = settings.runReportsAt || '00:00:00'
    const timeRange = getReportTimeRange(timezone, runReportsAt)
    return {
      variables: {
        storeID: selectedVenueId,
        ...timeRange,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }
  },
)

const homePageHOC = compose(
  withVenues,
  withRouter,
  withVenueSettings({ name: 'venueSettings' }),
  graphql(getTodaysMetrics, {
    name: 'metricsData',
    options: selectOptions,
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  renderWhileLoading(() => <Spinner />, 'metricsData'),
  withQueryErrorPageOnError('metricsData', false, false),
)

export default homePageHOC(HomePage)
