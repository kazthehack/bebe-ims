//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { withProps } from 'recompose'
import { setNotificationDismissal } from 'api/imsBridge'

const withDismissAlert = withProps(() => ({
  dismissAlert: ({
    notificationId,
    dismissDate,
  }) => setNotificationDismissal({ notificationId, when: dismissDate }),
  })
)

export default withDismissAlert
