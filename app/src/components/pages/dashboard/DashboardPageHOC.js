import React from 'react'
import { compose } from 'recompose'
import { withVenues, withVenueSettings } from 'components/Venue'
import { withRouter } from 'react-router-dom'
import { graphql } from 'api/operationCompat'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { getDashboard } from 'ops'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import DashboardPage from './DashboardPagePure'

const dashboardPageHOC = compose(
  withVenues,
  withRouter,
  withVenueSettings({ name: 'venueSettings' }),
  graphql(getDashboard, {
    name: 'dashboardData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  renderWhileLoading(() => <Spinner />, 'dashboardData'),
  withQueryErrorPageOnError('dashboardData', false, false),
)

export default dashboardPageHOC(DashboardPage)
