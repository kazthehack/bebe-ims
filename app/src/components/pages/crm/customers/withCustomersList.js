//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose, withProps } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getLoyaltyMembers } from 'ops/loyaltyPoints'
import { get } from 'lodash'
import { withVenueID } from 'components/Venue'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

export default C => compose(
  withVenueID,
  graphql(getLoyaltyMembers, {
    name: 'customersList',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(({ storeData, ...props }) => ({
    totalCustomers: get(storeData, 'store.loyaltyMembers.totalCount', 0),
    ...props,
  })),
)(C)

