//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { get, set, findIndex } from 'lodash'
import { getProducts, archiveProduct } from 'ops'
import { withVenueID } from 'components/Venue'
import { getNotification } from 'components/Notifications'
import { withConfirm, withAlert } from 'components/Modal'
import moment from 'moment-timezone'

const archiveProductSuccessToast = name => getNotification('success', 'Product deleted', name)
const archiveProductErrorToast = (message = 'Error deleting product') => getNotification('error', 'Error', message)

const withArchiveProduct = compose(
  withVenueID,
  withConfirm(),
  withAlert(),
  graphql(archiveProduct, {
    props: ({ mutate, ownProps }) => {
      const productId = get(ownProps, 'productData.node.id')
      const productName = get(ownProps, 'productData.node.name')
      const active = get(ownProps, 'productData.node.posActive')
      const associatedPackages = get(ownProps, 'productData.node.packages', [])
      const currentStock = get(ownProps, 'productData.node.managedInventoryLevels.currentStock', 0)
      return ({
        archiveProduct: () => {
          let warningMsg = ''
          if (active) {
            warningMsg += 'Active products cannot be deleted. Please deactivate the product, save, and try again.'
          }
          if (associatedPackages) {
            const numPackages = associatedPackages.length
            warningMsg += active ? '\n\n' : ''
            // eslint-disable-next-line max-len
            warningMsg += `Products associated with one or more packages cannot be deleted. Please remove the${numPackages > 1 ? ` ${numPackages}` : ''} associated package${numPackages > 1 ? 's' : ''}, save, and try again.`
          }
          if (currentStock !== 0) {
            warningMsg += active ? '\n\n' : ''
            warningMsg += 'Products with a non-zero inventory count cannot be deleted. Please adjust the inventory count to 0, save, and try again.'
          }
          if (warningMsg) {
            return ownProps.alert({
              title: 'Product cannot be deleted',
              message: warningMsg,
            })
          }
          const input = {
            productId,
            when: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
          }
          return ownProps.confirm({
            title: 'Are you sure?',
            message: 'Are you sure you want to delete this product?',
          }).then((confirmed) => {
            if (!confirmed) return undefined
            return mutate({
              variables: { input },
              update: (cache) => {
                const variables = {
                  storeID: ownProps.selectedVenueId,
                  filter: {
                    archived: false,
                  },
                }
                const data = cache.readQuery({ query: getProducts, variables })
                const prevProductList = get(data, 'store.products.edges', [])
                prevProductList.splice(findIndex(prevProductList, elt => get(elt, 'node.id') === productId), 1)
                const newProductList = prevProductList
                set(data, 'store.products.edges', newProductList)
                return cache.writeQuery({
                  query: getProducts,
                  variables,
                  data,
                })
              },
            }).then(() => { // After the promise is resolved. Is not called if there's an error.
              ownProps.history.push('/inventory') // Redirects to products list page
              ownProps.addNotification(archiveProductSuccessToast(productName))
            }, (error) => {
              ownProps.addNotification(archiveProductErrorToast(error.message))
              return error
            })
          })
        },
      })
    },
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withArchiveProduct
