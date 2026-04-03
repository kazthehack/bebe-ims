//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { associatePackageProduct, getProduct } from 'ops'
import { withNotifications, getNotification } from 'components/Notifications'
import { withConfirm, withModals, withCancelConfirmation } from 'components/Modal'
import { get, isEmpty } from 'lodash'

const successAssign = (name = 'Product') => getNotification('success', 'Success:', `${name} assigned to package`)
const SUCCESS_UNASSIGN = () => getNotification('success', 'Success:', 'Unassigned product')
const errorAssign = (message = '') => getNotification('error', 'Error', message)

const withAssignProductToPackage = C => compose(
  withNotifications,
  withConfirm(),
  withCancelConfirmation(),
  withModals,
  graphql(associatePackageProduct, {
    props: ({ mutate, ownProps }) => ({
      assignProductToPackage: (assign, { packageId, productId, oldProductId }) => {
        const variables = {
          input: {
            productId: assign ? productId : undefined,
            packageId,
          },
        }
        const refetchQueries = []
        if (productId) {
          refetchQueries.push({
            query: getProduct,
            variables: {
              productID: productId,
            },
          })
        }
        if (oldProductId) {
          refetchQueries.push({
            query: getProduct,
            variables: {
              productID: oldProductId,
            },
          })
        }
        mutate({
          variables,
          refetchQueries,
        })
          .then(({ data }) => { // After the promise is resolved. Is not called if there's an error.
            const assignedProduct = get(data, 'associatePackageProduct.package.product', {})
            if (!isEmpty(assignedProduct)) {
              ownProps.addNotification(successAssign())
            } else {
              ownProps.addNotification(SUCCESS_UNASSIGN())
            }
          }, (error) => {
            ownProps.addNotification(errorAssign(error.message))
            return error
          })
      },
    }),
  }),
)(C)

export default withAssignProductToPackage
