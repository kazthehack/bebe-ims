//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getLoyaltyMemberPoints } from 'ops/loyaltyPoints/queries'

const withPointsSummary = () => compose(
  graphql(getLoyaltyMemberPoints, {
    name: 'loyaltyPoints',
    options: ({ match }) => ({
      variables: {
        memberID: match.params.id,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)

export default withPointsSummary
