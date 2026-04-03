import { compose, lifecycle } from 'recompose'
import withNotifications from './withNotifications'

const normalizeNotification = (notification, data = {}) => (
  typeof notification === 'function' ? notification(data) : notification
)

// Default condition is for any "success" API response
const defaultCondition = (prevData, data) => {
  const { loading: prevLoading } = prevData || {}
  const { error, loading } = data || {}
  return prevLoading && !loading && !error
}

/**
 * Decorates generic apollo-graphql-connected HOC to leverage
 * the application speicific "toast" notifications system.
 * Can configure this HOC to customize how and when notifications
 * are triggered, as well as their content and appearence.
 * See 3rd party docs for more info:
 *  https://github.com/igorprado/react-notification-system
 *
 * @param {React.SFC|React.ComponentClass} C component to decorate
 * @return {React.SFC|React.ComponentClass}
 */
const withApiResponse = (
  dataProp = 'data',
  notification = {},
  predicate = defaultCondition,
) => compose(
  withNotifications,
  lifecycle({
    componentDidUpdate(prevProps = {}) {
      const { addNotification } = this.props
      const prevData = prevProps[dataProp]
      const data = this.props[dataProp]

      if (predicate(prevData, data)) {
        const n = normalizeNotification(notification, data)
        addNotification({
          level: 'success',
          ...n,
        })
      }
    },
  }),
)

export default withApiResponse
