//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { withProps } from 'recompose'
import { setNotificationsSeen as setNotificationsSeenApi } from 'api/imsBridge'

const withSetNotificationsSeen = withProps(() => ({
  setNotificationsSeen: ({ totalUnseen }) => (
    setNotificationsSeenApi().then(() => {
      if (totalUnseen) {
        totalUnseen.refetch()
      }
    })
  ),
}))

export default withSetNotificationsSeen
