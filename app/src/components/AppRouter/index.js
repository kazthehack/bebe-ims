//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, BrowserRouter, Route, Redirect, useLocation, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { trackPageView } from 'utils/google-analytics'
import ReactGA from 'react-ga'
import {
  HomePage,
  InventoryPage,
  EmployeesPage,
  ReportsPage,
  SettingsPage,
  LoginPage,
  UserProfilePage,
  AlertsPage,
  PackageLogsPage,
  ProductLogsPage,
  PriceGroupLogsPage,
  InventoryManifestPage,
  CrmPage,
  TryPage,
} from 'components/pages'
import { PageNotFound } from 'components/pages/ErrorPage'
import { withVenueID, withVenues } from 'components/Venue'
import { requireAuthentication } from 'utils/hoc'
import ScrollToTop from 'components/common/container/ScrollToTop'
import withAuthenticatedEmployee from 'components/common/display/withAuthenticatedEmployee'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import withLogoutHandler from '../Auth/withLogoutHandler'
import Page from '../pages/Page'

// AppRouter Routes
const withAuth = compose(
  requireAuthentication,
  withVenues,
  withRouter,
  withVenueID,
  withAuthenticatedEmployee,
)

const AuthRoutes = withAuth(({ authenticatedUserData }) => {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location)
  }, [location])

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      ReactGA.event({
        category: GATypes.eventCategories.browserTab,
        action: GATypes.eventActions.set,
        label: document.visibilityState === 'hidden' ? 'Other' : 'Bloom',
      })
    })
  }, [])

  return (
    <Page>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/daily" />} />
        <Route
          exact
          path="/daily"
          render={() => <HomePage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/inventory"
          render={() => <InventoryPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/employees"
          render={() => <EmployeesPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route exact path="/profile" component={UserProfilePage} />
        <Route exact path="/notifications" component={AlertsPage} />
        <Route
          path="/reports"
          render={() => <ReportsPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/crm"
          render={() => <CrmPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/settings"
          render={() => <SettingsPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/packagelogs"
          render={() => <PackageLogsPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/productlogs"
          render={() => <ProductLogsPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/pricegrouplogs"
          render={() => <PriceGroupLogsPage authenticatedUserData={authenticatedUserData} />}
        />
        <Route
          path="/inventorymanifest"
          render={() => <InventoryManifestPage authenticatedUserData={authenticatedUserData} />}
        />
        {/* If none of the above routes matches, show the 404 error page */}
        <Route component={PageNotFound(true, true)} />
      </Switch>
    </Page>
  )
})

AuthRoutes.propTypes = {
  authenticatedUserData: PropTypes.object, // TODO: use actual propTypes
}

const Routes = compose(
  withLogoutHandler,
  withRouter,
)(({ TestRoutes }) => (
  <ScrollToTop>
    <Switch>
      {/* non-auth routes */}
      <Route path="/login" component={LoginPage} />
      { APP_ENABLE_PUBLIC_DEMO_MODE && <Route path="/try" component={TryPage} /> }
      {TestRoutes && <Route path="/test" component={TestRoutes} />}
      {/* auth routes */}
      <Route path="/" component={AuthRoutes} />
      {/* If none of the above routes matches, show the 404 error page */}
      <Route component={PageNotFound(false)} />
    </Switch>
  </ScrollToTop>
))

const AppRouter = ({ store, client, TestRoutes = null }) => (
  <BrowserRouter>
    <Routes store={store} client={client} TestRoutes={TestRoutes} />
  </BrowserRouter>
)

AppRouter.propTypes = {
  store: PropTypes.object,
  client: PropTypes.object,
  TestRoutes: PropTypes.func,
}

export default AppRouter
