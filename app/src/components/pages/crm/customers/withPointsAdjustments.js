//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getLoyaltyPointAdjustments } from 'ops/loyaltyPoints'
import { withVenueID } from 'components/Venue'

export default C => compose(
  withVenueID,
  graphql(getLoyaltyPointAdjustments, {
    name: 'pointAdjustments',
    options: ({ match }) => ({
      variables: {
        memberID: match.params.id,
      },
    }),
  }),
)(C)
