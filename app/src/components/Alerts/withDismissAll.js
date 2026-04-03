//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { withProps } from 'recompose'
import { dismissAllNotifications } from 'api/imsBridge'

const withDismissAll = withProps(({ selectedVenueId }) => ({
  dismissAll: (dismissDate) => (
    dismissAllNotifications({
      storeId: selectedVenueId,
      when: dismissDate,
    })
  ),
  })
)

export default withDismissAll
