//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { graphql } from 'api/operationCompat'
import { op as operation } from 'api/operation'
import { compose } from 'recompose'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
/* eslint-disable graphql/template-strings */

// This query errors on purpose. Add an incorrect field for a networkError; the lack of a storeID
// will cause an internal server error if there is no networkError
const ErrorExample =
compose(
  graphql(
    operation`
      query getProducts($storeID: ID!) {
        store(id: $storeID) {
          id,
          products {
            edges {
              node {
                name
              }
            }
          }
        }
      }`, {
      name: 'productsData',
      options: () => ({
        variables: {
          storeID: '',
        },
      }),
    },
  ),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '200px' }} />, 'productsData'),
  withQueryErrorPageOnError('productsData', false),
)(() => (
  <div>{'hey, how\'d you get here?'}</div>
))

ErrorExample.propTypes = {
  productsData: PropTypes.object,
  history: PropTypes.object,
}

export default ErrorExample
