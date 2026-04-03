//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { getThirdPartySettings } from 'ops/thirdPartySettings/queries'
import { withVenueID } from 'components/Venue'


const withThirdPartySettings = () => compose(
  withVenueID,
  graphql(getThirdPartySettings, {
    name: 'thirdPartySettings',
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)

export default withThirdPartySettings
