//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { withNotifications } from 'components/Notifications'
import { withConfirm, withCancelConfirmation } from 'components/Modal'
import { withSalesTypes, defaultGroupings } from 'components/SalesTypes'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import Spinner from 'components/common/display/Spinner'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withVenueSettings } from 'components/Venue'
import { renderWhileLoading } from 'utils/hoc'
import { withPrinterAddress } from 'components/pages/settings/venue/withPrinterAddress'
import withMetrcSettings from 'components/pages/settings/thirdparty/details/withMetrcSettings'
import PackageDetailPure from './PackageDetail'
import withPackageDetails from './withPackageDetails'
import withAdjustQuantity from './withAdjustQuantity'
import withUpdatePackage from './withUpdatePackage'
import withHarvestModal from './withHarvestModal'
import withFilteredPackageIDs from '../withFilteredPackageIDs'

const UpdatePackageDetails = compose(
  withRouter, // Adds 'history' prop, used to navigate back to discount page after submission.
  withNotifications,
  withAuthenticatedEmployee, // authenticatedUserData
  withVenueSettings(), // venueSettings
  withMetrcSettings(),
  withPermissions('INVENTORY'), // userPermissions
  withConfirm(),
  withCancelConfirmation('/inventory/packages'),
  withAdjustQuantity(),
  withUpdatePackage(),
  withHarvestModal,
  withSalesTypes(defaultGroupings), // salesTypeData
  withPrinterAddress, // printer address data
  withPackageDetails(),
  withFilteredPackageIDs,
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['packageDetailsData', 'salesTypeData', 'storeStrains', 'storeBrands', 'venueSettings'], 'selectedVenueId'),
  withQueryErrorPageOnError(['packageDetailsData', 'salesTypeData', 'storeStrains', 'storeBrands', 'venueSettings'], true),
)(PackageDetailPure)

export default UpdatePackageDetails
