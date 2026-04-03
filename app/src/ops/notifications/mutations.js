import { op as operation } from 'api/operation'

export const setNotificationDismissal = operation`
  mutation SetNotificationDismissal($input: SetNotificationDismissalInput!) {
    setNotificationDismissal(input: $input) {
      success
    }
  }
`

export const dismissAllNotifications = operation`
  mutation DismissAllNotifications($input: DismissAllNotificationsInput!) {
    dismissAllNotifications(input: $input) {
      success
    }
  }
`

export const setNotificationsSeen = operation`
  mutation SetNotificationsSeen($input: SetNotificationsSeenInput!) {
    setNotificationsSeen(input: $input) {
      success
    }
  }
`
