//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getTax } from 'ops/tax'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

export default ({ name = 'taxData', ...config } = {}) => (
  graphql(getTax, {
    name,
    ...config,
    options: props => ({
      variables: {
        taxID: props.taxId,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    props: ({ [name]: taxData, ...props }) => ({
      [name]: taxData,
      ...props,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  })
)
