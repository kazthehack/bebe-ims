//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { requirePermissions } from 'utils/hoc'
import { STORE_PERMISSIONS } from 'utils/permissions'
import { PageNotFound } from 'components/pages/ErrorPage'
import { compose } from 'recompose'
import withAuthenticatedEmployee from 'components/common/display/withAuthenticatedEmployee'
import withFixedPageWidth from 'components/common/container/withFixedPageWidth'
import PageContent from '../PageContent'
import CustomersTab from './customers/CustomersTab'
import CustomerDetail from './customers/CustomerDetail'
import RewardsTab from './rewards/RewardsTab'
import RewardSubtotal from './rewards/details/RewardSubtotal'
import DiscountsTab from './discounts/DiscountsTab'
import { EditDiscountItemForm, NewDiscountItemForm, NewDiscountSubtotalForm } from './discounts/details/DiscountItemFormHOC'

const CrmPage = () => (
  <PageContent>
    <Switch>
      <Route exact path="/crm" component={CustomersTab} />
      <Route exact path="/crm/customer/:id" component={CustomerDetail} />
      <Route exact path="/crm/discounts" component={DiscountsTab} />
      <Route
        exact
        path="/crm/discounts/new/lineitem"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewDiscountItemForm)}
      />
      <Route
        exact
        path="/crm/discounts/new/subtotal"
        component={compose(
          withAuthenticatedEmployee,
          requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS]),
          withFixedPageWidth,
        )(NewDiscountSubtotalForm)}
      />
      <Route
        exact
        path="/crm/discounts/:id/edit"
        component={withFixedPageWidth(EditDiscountItemForm)}
      />
      <Route exact path="/crm/rewards" component={RewardsTab} />
      {/* Removed fo the 0.12 release */}
      {/* <Route
        exact
        path="/crm/rewards/new/lineitem"
        component={RewardSubtotal}
      /> */}
      <Route
        exact
        path="/crm/rewards/new/subtotal"
        component={RewardSubtotal}
      />
      <Route
        exact
        path="/crm/rewards/:id/edit"
        component={RewardSubtotal}
      />
      <Route component={PageNotFound(true)} />
    </Switch>
  </PageContent>
)

export default requirePermissions([STORE_PERMISSIONS.WRITE_BASIC_SETTINGS])(CrmPage)
