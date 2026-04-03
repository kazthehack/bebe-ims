//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { getPackage } from 'ops'
import { compose, withPropsOnChange, branch, lifecycle, withState } from 'recompose'
import { get, isEmpty } from 'lodash'
import { DATE_FORMAT, DATE_TIME_FORMAT, PAGE_POLL_INTERVAL, FINISH_PACKAGE_POLL_INTERVAL } from 'constants/Settings'
import moment from 'moment-timezone'
import { updatedUnitOptions } from 'constants/Units'
import reportOptions from 'constants/Report'
import { getSalesTypesFromMetrcCategory } from 'components/SalesTypes/withSalesTypes'
import { withVenueID, withVenueSettings } from 'components/Venue'
import { v4 } from 'uuid'
import { PageNotFound } from 'components/pages/ErrorPage'

// Prepares the sales type options for the Sales type dropdown
export const prepareSalesTypeOptions = (metrcSalesCategory, salesTypesList) => {
  let categoryOptions =
  getSalesTypesFromMetrcCategory(metrcSalesCategory, salesTypesList)
  if (isEmpty(categoryOptions)) {
    categoryOptions = []
    salesTypesList.forEach(({ id, salesTypes }) => {
      if (id !== 'merchandise') {
        categoryOptions.push(...salesTypes)
      }
    })
  }
  const salesTypeOptions = [{ value: '', name: 'Select a sales type' }]
    .concat(
      categoryOptions.map(option => ({ value: option.id, name: option.name })),
    )
  return salesTypeOptions
}

const initialValuesMap = ({
  isOnHold,
  quantity,
  finishedDate,
  product,
  dateReceived,
  providerLastSync,
  sourceIsProducer,
  producerName,
  producerLicense,
  labResult,
  strain,
  brand,
  harvestDate,
  source,
  initialQuantity,
  isPendingFinish,
  ...pkg
}, store, salesType, timezone, printerAddress) => {
  // eslint-disable-next-line prefer-const
  let { displayThc, displayCbd, displayIndica, displaySativa, testDate } = labResult || {}
  if (displayThc !== null) displayThc = (displayThc * 100).toFixed(2)
  if (displayCbd !== null) displayCbd = (displayCbd * 100).toFixed(2)
  if (displayIndica !== null) displayIndica = (displayIndica * 100).toFixed(2)
  if (displaySativa !== null) displaySativa = (displaySativa * 100).toFixed(2)

  let finishedDateValue
  if (isPendingFinish && !finishedDate) {
    finishedDateValue = 'Package Finish in Progress'
  } else if (finishedDate) {
    finishedDateValue = moment(finishedDate).format(DATE_FORMAT)
  } else {
    finishedDateValue = 'Still Active'
  }
  return ({
    strainName: get(strain, 'name'),
    brandName: get(brand, 'name'),
    finishedDate: finishedDateValue,
    pricePaid: get(product, 'pricePaid', ''), // not sure where this info comes from
    product,
    salesType,
    harvestDate: harvestDate ? moment(harvestDate).toDate() : null,
    source: (source) ? source.split(', ') : '', // fixes bug if source is undefined
    // get fields from package.labResults
    labResult: {
      testStatus: get(labResult, 'testStatus'),
      testDate: testDate ? moment(testDate).toDate() : null,
      remediationRequired: get(labResult, 'remediationRequired') ? 'Required' : 'Not required',
      testLabName: get(labResult, 'testLabName'),
      displayThc,
      displayCbd,
      isThcUnderLoq: get(labResult, 'isThcUnderLoq'),
      isCbdUnderLoq: get(labResult, 'isCbdUnderLoq'),
      displayIndica,
      displaySativa,
      resultHistory: get(labResult, 'resultHistory') ? labResult.resultHistory.map(
        ({ previousTestDate, ...rest }) => ({
          id: v4(),
          previousTestDate: moment(previousTestDate).toDate(),
          ...rest,
        }),
      ) : [],
    },
    dateReceived: moment.tz(dateReceived, timezone).format(DATE_FORMAT),
    providerLastSync: moment.tz(providerLastSync, timezone).format(DATE_TIME_FORMAT),
    quantity,
    adjustQuantityModal: {
      packageId: pkg.id,
      date: new Date(), // default value is today
      unit: updatedUnitOptions[0].value,
      report: reportOptions[0].value,
      quantity,
      newQuantity: quantity,
      reason: 'Select a reason',
      note: '',
    },
    selectedProduct: product,
    sourceIsProducer,
    producerName,
    producerLicense,
    altPristine: true,
    initialQuantity,
    ...pkg,
    printerAddress,
  })
}

export default ({
  name = 'packageDetailsData',
  ...config
} = {}) => C => compose(
  withVenueSettings({ name: 'venueSettings' }),
  withVenueID,
  withState('pollInterval', 'setPollInterval', PAGE_POLL_INTERVAL),
  graphql(getPackage, {
    name,
    ...config,
    options: ({
      match,
      selectedVenueId,
      selectedPackageId,
      useURLParamIDForPackages = true,
      pollInterval,
    }) => ({
      variables: {
        packageID: useURLParamIDForPackages ? get(match, 'params.id') : selectedPackageId,
        storeID: selectedVenueId,
      },
      pollInterval,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  lifecycle({
    componentWillReceiveProps({
      packageDetailsData,
      pollInterval,
      setPollInterval,
    }) {
      const finishedDate = get(packageDetailsData, 'node.finishedDate')
      const isPendingFinish = get(packageDetailsData, 'node.isPendingFinish')

      if ((!isPendingFinish && !finishedDate && pollInterval === PAGE_POLL_INTERVAL) ||
        (finishedDate && pollInterval === PAGE_POLL_INTERVAL) ||
        (isPendingFinish && pollInterval === FINISH_PACKAGE_POLL_INTERVAL)) {
        return
      }

      if (isPendingFinish && !finishedDate && pollInterval !== FINISH_PACKAGE_POLL_INTERVAL) {
        setPollInterval(FINISH_PACKAGE_POLL_INTERVAL)
      } else {
        setPollInterval(PAGE_POLL_INTERVAL)
      }
    },
  }),
  withPropsOnChange([name], (props) => {
    const pkg = get(props, 'packageDetailsData.node')
    if (!pkg) return {}
    const store = get(props, 'packageDetailsData.store')
    const printerAddress = get(props, 'printerAddressData.store.settings.labelPrinterAddress')
    // Show salesType groupings based on metrc product category
    const salesTypesList = get(props, 'salesTypeData.salesTypes', [])
    const metrcSalesCategory = get(pkg, 'providerInfo.metrcProduct.category', '')
    const salesTypeOptions = prepareSalesTypeOptions(metrcSalesCategory, salesTypesList)
    // Select the saved products sales type grouping else select an empty type
    const productSalesType = get(props, 'packageDetailsData.node.product.salesType.id')
    const salesType = productSalesType || get(salesTypeOptions, '[0].value')
    // Get the store's time zone
    const timezone = get(props, 'venueSettings.store.timezone')

    const initialValues = !get(props, 'packageDetailsData.loading', true) ?
      initialValuesMap(pkg, store, salesType, timezone, printerAddress) :
      {}
    const returnObj = {
      pkg,
      reasons: ['Select a reason'].concat(get(store, 'adjustReasons', [])),
      storeStrains: get(store, 'strains', []),
      storeBrands: get(store, 'brands', []),
      salesTypeOptions,
      initialValues,
    }
    return returnObj
  }),
  branch(
    ({ packageDetailsData, pkg }) => {
      const { loading } = packageDetailsData
      if (loading) return false
      return isEmpty(pkg)
    },
    () => PageNotFound(true),
  ),
)(C)

export { initialValuesMap }
