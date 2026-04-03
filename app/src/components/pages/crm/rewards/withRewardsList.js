//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose, withProps } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getRewards } from 'ops/loyaltyPoints'
import { get } from 'lodash'
import { withVenueID } from 'components/Venue'

export default C => compose(
  withVenueID,
  graphql(getRewards, {
    name: 'rewardsList',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withProps(({ storeData, ...props }) => ({
    totalCustomers: get(storeData, 'store.rewards.totalCount', 0),
    ...props,
  })),
)(C)

