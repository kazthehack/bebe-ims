//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getRewardDetails } from 'ops/loyaltyPoints'
import { withVenueID } from 'components/Venue'

export default C => compose(
  withVenueID,
  graphql(getRewardDetails, {
    name: 'rewardDetails',
    options: ({ match }) => ({
      variables: {
        rewardID: match.params.id,
      },
    }),
  }),
)(C)
