//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { withVenueID } from 'components/Venue'
import { getBloomMenuSettings } from 'ops/thirdPartySettings'

const withBloomMenuSettings = () => compose(
  withVenueID,
  graphql(getBloomMenuSettings, {
    name: 'bloomMenuSettings',
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)

export default withBloomMenuSettings
