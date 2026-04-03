import { op as operation } from 'api/operation'

export const getFilteredNotifications = operation`
  query GetFilteredNotifications {
    viewer {
      id
      notifications {
        id
        message
        seen
      }
    }
  }
`

export const getTotalUnseenCount = operation`
  query GetTotalUnseenCount {
    viewer {
      id
      notificationsUnseenCount
    }
  }
`

export const getPortalNotificationTypes = operation`
  query GetPortalNotificationTypes {
    viewer {
      id
      portalNotificationTypes
    }
  }
`
