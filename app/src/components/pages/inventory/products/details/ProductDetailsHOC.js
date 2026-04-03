//  Copyright (c) 2017-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { withVenueSettings } from 'components/Venue'
import { graphql } from 'api/operationCompat'
import { compose, withProps, branch } from 'recompose'
import moment from 'moment-timezone'
import { v4 } from 'uuid'
import {
  getProduct,
  updateProduct,
  addProduct,
  associatePackageProduct as associatePackageProductMutation,
  getFilteredProducts,
} from 'ops'
import { getSalesTypes } from 'ops/salesTypes'
import { capitalize, keyBy, clone, get, set, isEmpty } from 'lodash'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { withSalesTypes, defaultGroupings, findGrouping, salesTypes } from 'components/SalesTypes'
import withTaxList from 'components/pages/settings/taxes/withTaxList'
import { withCancelConfirmation } from 'components/Modal'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { addManagedInventoryEventOptions } from 'constants/Report'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import findTaxes from 'utils/aggregateTaxesForPriceTables'
import { withNotifications, getNotification } from 'components/Notifications'
import { initializePriceRows, zipPriceRows } from 'utils/priceGroup'
import withPriceGroups from 'components/pages/inventory/priceGroups/withPriceGroups'
import { withQueryErrorPageOnError, PageNotFound } from 'components/pages/ErrorPage'
import { withPrinterAddress } from 'components/pages/settings/venue/withPrinterAddress'

import ProductDetails from './ProductDetails'
import withAdjustInventory from './withAdjustInventory'
import withArchiveProduct from './withArchiveProduct'

// helper function to make blank values 0
const makeZero = (val) => {
  if (val === '' || typeof val === 'undefined') return 0
  return val
}

const placeholderMap = {
  flower: "Devil's Lettuce",
  'noninfused-preroll': 'Joint',
  edible: 'Brownie',
  concentrate: 'Dabs',
  other: 'Salve',
  plant: 'Clone',
  merchandise: 'T-shirt',
  usableHemp: 'Hempy McHemperson',
  hempConcentrate: 'Hempy McHemperson',
  hempCannabinoidProduct: 'Hempy McHemperson',
}

const updateProductSuccessToast = name => getNotification('success', 'Product saved', name)
const addProductSuccessToast = name => getNotification('success', 'Product created', name)
const updateProductErrorToast = (message = 'Error saving product') => getNotification('error', 'Error', message)
const addProductErrorToast = (message = 'Error creating product') => getNotification('error', 'Error', message)

// helper function to prepare the query variables needed for cache update
const getQueryOptions = (selectedVenueId, priceGroupId, data) => {
  const queryOptions = {
    query: getFilteredProducts,
    variables: {
      storeId: selectedVenueId,
      filter: {
        priceGroupId,
        archived: false,
      },
    },
  }
  if (data) queryOptions.data = data
  return queryOptions
}

// Update the cache with the new associations between products and price groups
const updateAssociatedPriceGroups = (cache, newProduct, initialValues, selectedVenueId) => {
  const { priceGroup: { id: newPGId, shared: newPGShared } } = newProduct
  const { selectedPG: { id: initialPGId, shared: initialPGShared } } = initialValues
  if (newPGId !== initialPGId) {
    // Dissociate the product from the initial price group
    if (initialPGShared) {
      let productsCacheData
      try {
        productsCacheData = cache.readQuery(getQueryOptions(selectedVenueId, initialPGId))
      } catch {
        // This is needed since Apollo throws an error instead of
        // returning `null` or `undefined` when the data does not exist in cache
      }
      // If data exists in cache
      if (productsCacheData) {
        const productsList = get(productsCacheData, 'store.products.edges')
        productsList.splice(productsList.map(product => product.node.id).indexOf(newProduct.id), 1)
        set(productsCacheData, 'store.products.edges', productsList)
        cache.writeQuery(getQueryOptions(selectedVenueId, initialPGId, productsCacheData))
      }
    }
    // Add the product to the new shared price group (if any)
    if (newPGShared) {
      let productsCacheData
      try {
        productsCacheData = cache.readQuery(getQueryOptions(selectedVenueId, newPGId))
      } catch {
        // This is needed since Apollo throws an error instead of
        // returning `null` or `undefined` when the data does not exist in cache
      }
      // If data exists in cache
      if (productsCacheData) {
        const productsList = get(productsCacheData, 'store.products.edges')
        productsList.push({
          node: {
            id: newProduct.id,
            medicalOnly: newProduct.medicalOnly,
            name: newProduct.name,
            packages: newProduct.packages,
            posActive: newProduct.posActive,
            inventoryId: newProduct.inventoryId,
            salesType: newProduct.salesType,
            __typename: 'Product',
          },
          __typename: 'ProductConnection',
        })
        set(productsCacheData, 'store.products.edges', productsList)
        cache.writeQuery(getQueryOptions(selectedVenueId, newPGId, productsCacheData))
      }
    }
  }
}

export const withProduct = C => (
  graphql(getProduct, {
    name: 'productData',
    options: ({ match: { params: { id } } }) => ({
      variables: {
        productID: id,
      },
      pollInterval: PAGE_POLL_INTERVAL,
      fetchPolicy: 'network-only', // TODO: in the future, we should use strategic refetches to make this unnecesssary
    }),
  }))(C)

// TODO: merge the props part of this and createProduct to reduce reused code
const withUpdateProduct = C => (
  graphql(updateProduct, {
    props: ({ mutate, ownProps: {
      history,
      associate,
      selectedVenueId,
      adjustInventory,
      addNotification,
      venueSettings: { store: { settings: { pricingScheme } } },
      initialValues,
    } }) => ({
      onSubmit: ({
        name,
        posActive,
        medicalOnly,
        preventDiscount,
        notes,
        selectedPG,
        customPG,
        id,
        assignedPackages,
        packages,
        queuedAdjustment,
        managedInventoryLevels,
        combined,
        combinedSalesTypes,
        combinedBreakdownPricing,
      }, groupingValue) => { // TODO: turn this custom price checking logic into reusable util
        const description = notes !== undefined ? notes : ''
        // TODO: rethink this logic
        const preScheme = pricingScheme === 'PRE_TAX'
        let variableObj = {}
        /* set default Price Object values for merchandise item to temporarily */
        /* prevent the POS from crashing */
        if (groupingValue === 'merchandise') {
          set(customPG, 'prices.med[0].post', customPG.prices.rec[0].post)
          set(customPG, 'prices.med[0].pre', customPG.prices.rec[0].pre)
          set(customPG, 'prices.med[0].tax', customPG.prices.rec[0].tax)
          set(customPG, 'prices.med[0].quantityAmount', customPG.prices.rec[0].quantityAmount)
        }
        if (
          (groupingValue === 'flower' || groupingValue === 'usableHemp')
          && (selectedPG.shared && (selectedPG.id !== '-1'))
        ) {
          variableObj = { priceGroupId: selectedPG.id }
        } else {
          variableObj = { prices: zipPriceRows(preScheme, customPG) }
        }
        const input = {
          input: {
            productId: id,
            product: {
              name,
              posActive,
              medicalOnly,
              preventDiscount,
              priceGroupId: customPG.id !== '-1' ? customPG.id : undefined,
              notes: description,
              portalMedicalSame: customPG.portalMedicalSame,
              combinedBreakdownPricing,
              combinedSalesTypes: combined ? combinedSalesTypes.map(cst => (
                { salesTypeId: cst.id, quantityAmount: makeZero(cst.quantityAmount) }))
                : undefined,
              ...variableObj,
            },
          },
        }
        mutate({
          variables: input,
          update: (cache, { data: { updateProduct: { product: newProduct } } }) => (
            updateAssociatedPriceGroups(cache, newProduct, initialValues, selectedVenueId)
          ),
          refetchQueries: [
            { // TODO: manually update the query instead of refetching
              query: getSalesTypes,
              variables: {
                storeID: selectedVenueId,
              },
            },
          ],
        }).then(() => {
          history.push('/inventory') // Redirects to products list page
          addNotification(updateProductSuccessToast(name))
          associate({ packages, id, assignedPackages })
          if (queuedAdjustment) adjustInventory({ queuedAdjustment, managedInventoryLevels, id })
        }, (error) => {
          addNotification(updateProductErrorToast(error.message))
        })
      },
    }),
  }))(C)

// TODO: merge the props part of this and updateProduct to reduce reused code
const withAddProduct = C => (
  graphql(addProduct, {
    props: ({ mutate, ownProps: {
      history,
      selectedVenueId,
      associate,
      addNotification,
      venueSettings: { store: { settings: { pricingScheme } } },
    } }) => ({
      onSubmit: ({
        type,
        name,
        inventoryId,
        posActive,
        medicalOnly,
        notes,
        preventDiscount,
        selectedPG,
        customPG,
        assignedPackages,
        packages,
        combined,
        combinedSalesTypes,
        combinedBreakdownPricing,
      }, groupingValue) => { // TODO: turn this custom price checking logic into reusable util
        const preScheme = pricingScheme === 'PRE_TAX'
        let variableObj = {}
        /* set default Price Object values for merchandise item to temporarily */
        /* prevent the POS from crashing */
        if (groupingValue === 'merchandise') {
          set(customPG, 'prices.med[0].post', customPG.prices.rec[0].post)
          set(customPG, 'prices.med[0].pre', customPG.prices.rec[0].pre)
          set(customPG, 'prices.med[0].tax', customPG.prices.rec[0].tax)
          set(customPG, 'prices.med[0].quantityAmount', customPG.prices.rec[0].quantityAmount)
        }
        if (
          (groupingValue === 'flower' || groupingValue === 'usableHemp')
          && (selectedPG.shared && (selectedPG.id !== '-1'))
        ) {
          variableObj = { priceGroupId: selectedPG.id }
        } else {
          variableObj = { prices: zipPriceRows(preScheme, customPG) }
        }
        const input = {
          input: {
            product: {
              salesTypeId: type,
              name,
              inventoryId,
              posActive,
              medicalOnly,
              notes,
              preventDiscount,
              portalMedicalSame: customPG.portalMedicalSame,
              combined,
              combinedBreakdownPricing,
              combinedSalesTypes: combined
                ? combinedSalesTypes.map(cst => (
                  { salesTypeId: cst.id, quantityAmount: makeZero(cst.quantityAmount) }))
                : undefined,
              ...variableObj,
            },
            storeId: selectedVenueId,
          },
        }
        mutate({ variables: input }).then((response) => {
          history.push('/inventory') // Redirects to products list page
          addNotification(addProductSuccessToast(name))
          associate({ assignedPackages, packages, id: response.data.addProduct.product.id })
        }, (error) => {
          addNotification(addProductErrorToast(error.message))
        })
      },
    }),
  }))(C)

// This might be specific to product, due to the different structure in props.
const withAssociatePackageProductForProduct = () => compose(
  graphql(associatePackageProductMutation, {
    props: ({ mutate, ownProps: { addNotification, productData } }) => ({
      associate: ({ assignedPackages, id, packages, name }) => {
        // function that actually runs the mutation. associate might call this several times.
        const executeMutation = (input) => {
          mutate({
            variables: input,
          }).then(() => {
            if (productData) productData.refetch()
            if (name) {
              addNotification(updateProductSuccessToast(name))
            }
          }, (error) => {
            addNotification(updateProductSuccessToast(error.message))
          })
        }

        // get assigned package IDs
        const assignedIds = Object.entries(assignedPackages)
        // get package IDs that started assigned
        const startingIds = packages.map(pack => pack.id)
        // For each package ID that's assigned,
        assignedIds.forEach((keyVal) => {
          // Check to see value of key-value pair wasn't false
          if (keyVal[1]) {
            // Only assign it if it did not start assigned.
            if (!startingIds.includes(keyVal[0])) {
              const input = {
                input: {
                  productId: id,
                  packageId: keyVal[0],
                },
              }
              // adding package
              executeMutation(input)
            }
          }
        })
        startingIds.forEach((item) => {
          let exists = false
          // Unassign package if it started assigned and did not end assigned.
          assignedIds.forEach((keyVal) => {
            // Check that the value of key-value pair wasn't false
            if (keyVal[1]) {
              if (item === keyVal[0]) exists = true
            }
          })
          if (!exists) {
            const input = {
              input: {
                packageId: item,
              },
            }
            // removing package
            executeMutation(input)
          }
        })
      },
    }),
  }),
)

const portalActive = false

const startingRows = customerType => ([{
  portalActive: true,
  quantityAmount: 1,
  customerType,
}, {
  portalActive,
  quantityAmount: 2,
  customerType,
}, {
  portalActive,
  quantityAmount: 3.5,
  customerType,
}, {
  portalActive,
  quantityAmount: 7,
  customerType,
}, {
  portalActive,
  quantityAmount: 14,
  customerType,
}, {
  portalActive,
  quantityAmount: 28,
  customerType,
}])

const initialValuesMap = ({
  product: {
    salesType,
    medicalOnly = false,
    priceGroup,
    notes,
    packages = [],
    managedInventoryLevels,
    combined,
    combinedSalesTypes,
    inventoryId = v4(),
    ...rest
  },
  typeOptions,
  taxList,
  grouping,
  preScheme,
  printerAddressData,
  salesTypeData,
  timezone,
}) => {
  const tax = findTaxes(
    taxList,
    grouping ? typeOptions[0] : salesType,
  )
  const startingPriceGroup = priceGroup
    ? initializePriceRows(Object.assign({}, priceGroup), tax, preScheme)
    : {
      id: '-1',
      shared: false,
      portalMedicalSame: true,
      prices: {
        rec: startingRows('RECREATIONAL'),
        med: startingRows('MEDICAL'),
      },
    }
  const custom = priceGroup && !startingPriceGroup.shared
  const assignedPackages = keyBy(packages, item => (item.id))
  const currentStock = get(managedInventoryLevels, 'currentStock')

  const budsST = get(
    salesTypeData.find(c => c.id === 'flower'),
    'salesTypes',
    [],
  ).find(st => st.portalTag === salesTypes.Buds)

  const extractST = get(
    salesTypeData.find(c => c.id === 'concentrate'),
    'salesTypes',
    [],
  ).find(st => st.portalTag === salesTypes.Extract)

  const concentrateST = get(
    salesTypeData.find(c => c.id === 'concentrate'),
    'salesTypes',
    [],
  ).find(st => st.portalTag === salesTypes.Concentrate)

  const defaultCombinedSalesTypes = combined ? combinedSalesTypes.map(
    ({ quantityAmount, salesType: { id, name } }) => ({ quantityAmount, name, id }),
  ) : [{
    id: get(budsST, 'id'),
    quantityAmount: undefined,
    name: get(budsST, 'name'),
  }, {
    id: get(extractST, 'id'),
    quantityAmount: undefined,
    name: get(extractST, 'name'),
  }, {
    id: get(concentrateST, 'id'),
    quantityAmount: undefined,
    name: get(concentrateST, 'name'),
  }]
  return ({
    managedInventoryLevels,
    posActive: true,
    name: undefined,
    type: salesType ? salesType.id : get(typeOptions[0], 'id'),
    inventoryId,
    notes,
    medicalOnly,
    customPG: custom ? startingPriceGroup : {
      name: 'Custom Price Group',
      id: '-1',
      hidden: true,
      shared: false,
      portalMedicalSame: !medicalOnly, // Fixes bug with medicalOnly and medicalSame being true
      prices: startingPriceGroup.prices,
    },
    selectedPG: !grouping ? startingPriceGroup : {},
    originalAssignedPackages: assignedPackages, // Used for checkboxes in edit packages modal
    assignedPackages, // used to track assignedPackages between both the modal and table
    packages: packages || [], // packages for associated package table. This copy isn't edited
    copyPackages: clone(packages) || [], // Edited copy of packages for associated package table
    liquid: salesType ? salesType.liquid : get(typeOptions[0], 'liquid'), // storing for reference
    tax, // storing for reference
    combined,
    combinedSalesTypes: defaultCombinedSalesTypes,
    adjustInventory: {
      modalDate: new Date(moment.tz(new Date(), timezone)),
      modalReport: addManagedInventoryEventOptions[0].value,
      modalCurrentQuantity: currentStock,
      modalNewQuantity: currentStock,
      modalAmount: undefined,
    },
    queuedAdjustment: undefined,
    printerAddress: printerAddressData,
    grouping,
    ...rest,
  })
}

const withProductDetailsProps = withProps(({
  match: { params: { grouping, id } },
  salesTypeData,
  venueSettings: { store: { timezone, settings: { pricingScheme } } },
  productData,
  taxListData,
  priceGroupData,
  printerAddressData,
}) => {
  const priceGroups = get(priceGroupData, 'store.priceGroups.edges', [])
  const product = grouping ? {} : get(productData, 'node', {})
  if (!product) {
    return false
  }
  const preScheme = pricingScheme === 'PRE_TAX'
  const groupingValue = grouping || get(findGrouping(get(product, 'salesType.portalTag'), get(salesTypeData, 'salesTypes', [])), 'id')
  const typeOptions = get(get(salesTypeData, 'salesTypes', []).find(el => (el.id === groupingValue)), 'salesTypes', [])
    .map(type => ({ value: type.id, ...type }))
  const taxList = get(taxListData, 'store.taxes.edges')
  const groupName = get(get(salesTypeData, 'salesTypes', []).find(group => group.id === groupingValue), 'name')

  const initialValues = initialValuesMap({
    product,
    typeOptions,
    taxList,
    grouping,
    preScheme,
    printerAddressData: get(printerAddressData, 'store.settings.labelPrinterAddress'),
    salesTypeData: get(salesTypeData, 'salesTypes', []),
  })
  const flower = (groupingValue === 'flower' || groupingValue === 'usableHemp')
  const canna = groupingValue !== 'merchandise'
  const placeholder = placeholderMap[groupingValue]
  const priceGroupList = []
  priceGroupList.push(initialValues.customPG)
  const newPriceGroups = priceGroups.filter(({ node }) => (
    (node.salesType.id === initialValues.type) && node.shared && node.active
  )).map(({ node }) => (
    initializePriceRows(Object.assign({}, node), initialValues.tax, preScheme)))
  priceGroupList.push(...newPriceGroups)
  return {
    initialValues,
    groupingValue,
    typeOptions,
    canna,
    flower,
    preScheme,
    priceGroupList,
    taxList,
    placeholder,
    product,
    groupName,
    salesTypeData,
    priceGroups,
    initialPriceGroup: product.priceGroup,
    grouping,
    edit: !grouping,
    title: !grouping ? product.name : `NEW PRODUCT: ${capitalize(groupName)}`,
    id,
    timezone,
  }
})

export const EditProductDetails = compose(
  withNotifications, // addNotification
  withVenueSettings(),
  withProduct,
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withSalesTypes(defaultGroupings), // salesTypeData
  withAssociatePackageProductForProduct(),
  withAdjustInventory,
  withArchiveProduct,
  withTaxList(), // taxListData
  withPriceGroups(), // priceGroupData
  withPrinterAddress, // printer address data
  withCancelConfirmation('/inventory', { title: 'Discard changes', message: 'Discard changes made to this product record?' }),
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '100px' }} />,
    ['venueSettings', 'productData', 'salesTypeData', 'authenticatedUserData', 'taxListData', 'priceGroupData'],
    'selectedVenueId',
  ),
  withQueryErrorPageOnError(
    ['venueSettings', 'productData', 'salesTypeData', 'authenticatedUserData', 'taxListData', 'priceGroupData'],
    true,
  ),
  withProductDetailsProps,
  withUpdateProduct,
  branch(
    ({ productData }) => {
      const { loading } = productData
      if (loading) return false
      return isEmpty(productData.node)
    },
    () => PageNotFound(true),
  ),
)(ProductDetails)

EditProductDetails.propTypes = {
  match: PropTypes.object,
}

export const NewProductDetails = compose(
  withNotifications, // addNotification
  withSalesTypes(defaultGroupings), // salesTypeData
  withVenueSettings(), // venueSettings
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withAssociatePackageProductForProduct(),
  withAddProduct,
  withTaxList(), // taxListData
  withPriceGroups(), // priceGroupData
  withCancelConfirmation('/inventory', { title: 'Discard record', message: 'Discard this new product record?' }),
  renderWhileLoading(
    () => <Spinner wrapStyle={{ paddingTop: '100px' }} />,
    ['venueSettings', 'salesTypeData', 'authenticatedUserData', 'taxListData', 'priceGroupData'],
    'selectedVenueId',
  ),
  withQueryErrorPageOnError(
    ['venueSettings', 'salesTypeData', 'authenticatedUserData', 'taxListData', 'priceGroupData'],
    true,
  ),
  // Show the 404 error page if the product type in the URL
  // does not match any of the valid sales types
  branch(
    ({ salesTypeData: { salesTypes: salesTypesList }, match: { params: { grouping } } }) => (
      !salesTypesList.map(salesType => salesType.id).includes(grouping)
    ),
    () => PageNotFound(true),
  ),
  withProductDetailsProps,
)(ProductDetails)

NewProductDetails.propTypes = {
  match: PropTypes.object,
}
