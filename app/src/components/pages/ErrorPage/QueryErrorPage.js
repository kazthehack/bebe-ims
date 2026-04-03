//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { withProps } from 'recompose'
import { get } from 'lodash'
import { QUERY_ERROR_MESSAGE } from 'constants/Settings'
import ErrorPage from './ErrorPage'

const QueryErrorPage = withProps(
  ({ data, ...rest }) => {
    const { error } = data
    const { networkError, graphQLErrors } = error
    if (networkError) {
      const response = get(networkError, 'response')
      const statusText = get(response, 'statusText', 'Unknown error')
      const status = get(response, 'status')
      const message = QUERY_ERROR_MESSAGE
      return {
        status,
        statusText,
        message,
        ...rest,
      }
    } else if (graphQLErrors.length > 0) {
      const firstError = graphQLErrors[0]
      const statusText = 'Internal server error'
      const status = 500
      const message = get(firstError, 'message')
      return { // TODO: if graphQLErrors
        status,
        statusText,
        message,
        ...rest,
      }
    } // This should never happen, but we should handle it
    const statusText = 'Unknown'
    const status = 999
    const message = 'Unknown error'
    return {
      status,
      statusText,
      message,
      ...rest,
    }
  },
)(
  props => (
    <ErrorPage {...props} />
  ),
)

export default QueryErrorPage
