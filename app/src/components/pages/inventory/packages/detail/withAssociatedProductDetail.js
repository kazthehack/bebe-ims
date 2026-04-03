import { graphql } from 'api/operationCompat'
import { getAssociatedProduct } from 'ops'
import { get } from 'lodash'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'

const withAssociatedProductDetail = C => (
  graphql(getAssociatedProduct, {
    name: 'productData',
    options: ({ product }) => ({
      variables: {
        productID: get(product, 'id'),
      },
      pollInterval: PAGE_POLL_INTERVAL,
      fetchPolicy: 'network-only', // TODO: in the future, we should use strategic refetches to make this unnecesssary
    }),
    skip: ({ product }) => !get(product, 'id'),
  })
)(C)

export default withAssociatedProductDetail
