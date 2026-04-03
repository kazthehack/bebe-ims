//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { withVenueID } from 'components/Venue'
import { getMetrcSettings } from 'ops/thirdPartySettings'

const withMetrcSettings = () => compose(
  withVenueID,
  graphql(getMetrcSettings, {
    name: 'metrcSettings',
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)

export default withMetrcSettings
