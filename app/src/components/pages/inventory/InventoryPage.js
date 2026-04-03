//  Copyright (c) 2017-2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { PageNotFound } from 'components/pages/ErrorPage'
import withFixedPageWidth from 'components/common/container/withFixedPageWidth'
import PageContent from 'components/pages/PageContent'
import { requirePermissions } from 'utils/hoc'
import { STORE_PERMISSIONS } from 'utils/permissions'
import Packages from './packages/Packages'
import Products from './products/Products'
import { EditProductDetails, NewProductDetails } from './products/details/ProductDetailsHOC'
import { EditPriceGroupForm, NewPriceGroupForm } from './priceGroups/details/PriceGroupFormHOC'
import PriceGroups from './priceGroups/PriceGroups'
import { POSCategoriesHOC } from './posCategories/POSCategoriesHOC'
import UpdatePackageDetails from './packages/detail/PackageDetailsHOC'
import FixPackageDetail from './packages/detail/FixPackage'

const NewProductDetailsEnhanced = withFixedPageWidth(NewProductDetails)
const EditProductDetailsEnhanced = withFixedPageWidth(EditProductDetails)
const UpdatePackageDetailsEnhanced = withFixedPageWidth(UpdatePackageDetails)
const NewPriceGroupFormEnhanced = withFixedPageWidth(NewPriceGroupForm)
const EditPriceGroupFormEnhanced = withFixedPageWidth(EditPriceGroupForm)

const InventoryPage = () => (
  <PageContent>
    <Switch>
      <Route exact path="/inventory/products" component={Products} />
      <Route exact path="/inventory/products/new/:grouping" component={NewProductDetailsEnhanced} />
      <Route exact path="/inventory/products/edit/:id" component={EditProductDetailsEnhanced} />
      <Route exact path="/inventory/packages" component={Packages} />
      <Route path="/inventory/packages/fix/:id" component={FixPackageDetail} />
      <Route path="/inventory/packages/:id" component={UpdatePackageDetailsEnhanced} />
      <Route exact path="/inventory/price-groups/new/" component={NewPriceGroupFormEnhanced} />
      <Route exact path="/inventory/price-groups/edit/:id" component={EditPriceGroupFormEnhanced} />
      <Route exact path="/inventory/price-groups" component={PriceGroups} />
      <Route exact path="/inventory/pos-categories" component={POSCategoriesHOC} />
      <Route exact path="/inventory" render={() => <Redirect to="/inventory/products" />} />
      {/* If none of the above routes matches, show the 404 error page */}
      <Route component={PageNotFound(true)} />
    </Switch>
  </PageContent>
)

// TODO: find place to redirect user if they are not allowed to read inventory
export default requirePermissions([STORE_PERMISSIONS.READ_INVENTORY])(InventoryPage)
