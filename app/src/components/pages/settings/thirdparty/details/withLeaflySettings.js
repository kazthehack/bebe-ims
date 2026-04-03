//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { withVenueID } from 'components/Venue'
import { getLeaflySettings } from 'ops/thirdPartySettings'

const withLeaflySettings = () => compose(
  withVenueID,
  graphql(getLeaflySettings, {
    name: 'leaflySettings',
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)

export default withLeaflySettings
