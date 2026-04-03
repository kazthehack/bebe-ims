//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

/* import { graphql } from 'api/operationCompat'
import { getPortalNotificationTypes } from 'ops' */

const alertTypeActions = {
  metrc_disconnected: '/', // No FAQ yet
  bloom_disconnected: '/', // No FAQ yet
  software_update: '/', // No release notes yet
  tax_reports: '/reports/tax',
  products: '/inventory',
  product_update: '/inventory/products/edit/:',
  packages: '/inventory/packages',
  package_update: '/inventory/packages/:',
  settings: '/settings',
  tax_update: '/settings/taxes/:/edit',
  terminal_update: '/settings/hardware',
  adjustment_negative: '/inventory/packages/:',
}

export default alertTypeActions

// This code isn't necessary because the only thing you get from the back-end is the names of the
// types, which we need to hard-code with their actions anyway, so there isn't a point at the moment
/* export default C =>
  graphql(getPortalNotificationTypes, {
    name: 'alertTypes',
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })(C) */
