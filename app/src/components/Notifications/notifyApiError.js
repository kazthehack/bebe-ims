import { get } from 'lodash'
import notifyApiResponse from './notifyApiResponse'

const errorNotification = data => ({
  title: 'Error!',
  message: get(data, 'error.message'),
  level: 'error',
})

const errorCondition = (prevData, data) => {
  const { error: prevError } = prevData || {}
  const { error } = data || {}
  return error && prevError !== error
}

/**
 * Decorates generic apollo-graphql-connected HOC to issue
 * an "error" toast notification any time the configured apollo
 * network request fails.
 * This is an Ease-of-use helper for a common case, uses
 * `notifyApiResponse` internally, just preconfigured.
 *
 * @param {React.SFC|React.ComponentClass} C component to decorate
 * @return {React.SFC|React.ComponentClass}
 */
const notifyApiError = (dataProp = 'data') => notifyApiResponse(
  dataProp, errorNotification, errorCondition,
)

export default notifyApiError
