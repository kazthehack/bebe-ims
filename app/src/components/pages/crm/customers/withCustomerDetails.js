//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getCustomerDetails } from 'ops/loyaltyPoints'
import { withVenueID } from 'components/Venue'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

export default C => compose(
  withVenueID,
  graphql(getCustomerDetails, {
    name: 'customerDetails',
    options: ({ match }) => ({
      variables: {
        memberID: match.params.id,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
  }),
)(C)
