//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import withFixedPageWidth from 'components/common/container/withFixedPageWidth'
import { NewRecreationalCompliance, NewMedicalCompliance, EditCompliance } from 'components/pages/settings/compliance/details/ComplianceDetailsHOC'
import { compose } from 'recompose'
import { requirePermissions } from 'utils/hoc'
import { STORE_PERMISSIONS } from 'utils/permissions'
import withAuthenticatedEmployee from 'components/common/display/withAuthenticatedEmployee'
import { PageNotFound } from 'components/pages/ErrorPage'
import Compliance from './compliance/Compliance'
import { Hardware } from './hardware/Hardware'
import PageContent from '../PageContent'
import Taxes from './taxes/Taxes'
import { VenueTab } from './venue/VenueTab'
import ThirdPartyTab from './thirdparty/ThirdPartyTab'
import ThirdPartyMetrc from './thirdparty/details/ThirdPartyMetrc'
import ThirdPartyPaybotic from './thirdparty/details/ThirdPartyPaybotic'
import ThirdPartyLeafly from './thirdparty/details/ThirdPartyLeafly'
import ThirdPartyBloomMenu from './thirdparty/details/ThirdPartyBloomMenu'
import withThirdPartySettings from './thirdparty/withThirdPartySettings'
import {
  EditTax,
  NewLineItemTax,
  NewSubtotalTax,
} from './taxes/details/TaxFormHOC'

const SettingsPage = () => (
  <PageContent>
    <Switch>
      <Route exact path="/settings" component={withFixedPageWidth(VenueTab)} />
      <Route
        exact
        path="/settings/taxes"
        component={Taxes}
      />
      <Route
        exact
        path="/settings/taxes/new/lineitem"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewLineItemTax)}
      />
      <Route
        exact
        path="/settings/taxes/new/subtotal"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewSubtotalTax)}
      />
      <Route exact path="/settings/taxes/:id/edit" component={withFixedPageWidth(EditTax)} />
      <Route exact path="/settings/compliance" component={Compliance} />
      <Route
        exact
        path="/settings/thirdparty"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_ADMIN_SETTINGS]),
          withFixedPageWidth,
        )(ThirdPartyTab)}
      />
      <Route
        exact
        path="/settings/thirdparty/metrc"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(ThirdPartyMetrc)}
      />
      <Route
        exact
        path="/settings/thirdparty/paybotic"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
          withThirdPartySettings(),
        )(ThirdPartyPaybotic)}
      />
      <Route
        exact
        path="/settings/thirdparty/leafly"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(ThirdPartyLeafly)}
      />
      <Route
        exact
        path="/settings/thirdparty/bloom-menu"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(ThirdPartyBloomMenu)}
      />
      <Route
        exact
        path="/settings/compliance/new/medical"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewMedicalCompliance)}
      />
      <Route
        exact
        path="/settings/compliance/new/recreational"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewRecreationalCompliance)}
      />
      <Route exact path="/settings/compliance/details/:id" component={withFixedPageWidth(EditCompliance)} />
      <Route exact path="/settings/hardware" component={Hardware} />
      {/* If none of the above routes matches, show the 404 error page */}
      <Route component={PageNotFound(true)} />
    </Switch>
  </PageContent>
)

// <Route path="/settings/apps" component={withFixedPageWidth(ConnectedApps)} />

export default requirePermissions([STORE_PERMISSIONS.READ_BASIC_SETTINGS])(SettingsPage)
