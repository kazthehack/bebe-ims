//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { updatePackage } from 'ops'
import { getNotification } from 'components/Notifications'
import { get, omit } from 'lodash'
import moment from 'moment-timezone'
import { DATE_INPUT_FORMAT } from 'constants/Settings'

const updatePackageSuccessToast = (id, tag) => getNotification('success', 'Package saved', `${id}/${tag}`)
const updatePackageErrorToast = (message = 'Error saving package') => getNotification('error', 'Error', message)

// create private method to return the `input`, given a set of `props`
const mapPackageToInput = (props = {}) => {
  const packageInfo = props.updateFromModal ?
    props.package
    : props
  // destructure values from provided package object
  const {
    pricePaid,
    harvestDate,
    active,
    sourceIsProducer,
    producerName,
    producerLicense,
    strainName,
    brandName,
    facilityName,
    facilityLicense,
    labResult = {},
  } = packageInfo
  const {
    displaySativa,
    displayIndica,
    displayCbd,
    isCbdUnderLoq,
    displayThc,
    isThcUnderLoq,
    resultHistory,
    testLabName,
    testDate,
  } = labResult
  const labResultObj = {
    displaySativa: displaySativa ? (displaySativa / 100).toFixed(4) : null,
    displayIndica: displayIndica ? (displayIndica / 100).toFixed(4) : null,
    displayCbd: displayCbd ? (displayCbd / 100).toFixed(4) : null,
    isCbdUnderLoq,
    displayThc: displayThc ? (displayThc / 100).toFixed(4) : null,
    isThcUnderLoq,
    history: resultHistory && resultHistory.map(({ previousTestDate, ...rest }) => ({
      previousTestDate: moment(previousTestDate).format(DATE_INPUT_FORMAT),
      ...omit(rest, ['__typename', 'id']),
    })),
    testLabName,
    testDate: testDate ? `${moment(testDate).format('YYYY-MM-DD')}T00:00:00.000Z` : null,
  }
  return {
    packageId: get(packageInfo, 'id'),
    package: {
      labResult: labResultObj,
      pricePaid: pricePaid === '' ? null : pricePaid,
      harvestDate: harvestDate ? moment(harvestDate).format(DATE_INPUT_FORMAT) : null,
      brandName,
      strainName,
      active,
      sourceIsProducer,
      producerName: sourceIsProducer ? facilityName : producerName,
      producerLicense: sourceIsProducer ? facilityLicense : producerLicense,
    },
  }
}
const withUpdatePackage = () => compose(
  graphql(updatePackage, {
    props: ({ mutate, ownProps }) => ({
      onSubmitUpdatePackage: (props) => {
        const input = mapPackageToInput(props)
        return mutate({
          variables: { input },
        }).then((response) => { // After the promise is resolved. Is not called if there's an error.
          ownProps.history.push('/inventory/packages') // Redirects to packages list page
          const { metrcPackageId, tag } = response.data.updatePackage.package.providerInfo
          ownProps.addNotification(updatePackageSuccessToast(metrcPackageId, tag))
          return response
        }, (error) => {
          ownProps.addNotification(updatePackageErrorToast(error.message))
          return error
        })
      },
      onFixPackage: (props) => {
        const input = mapPackageToInput(props)
        return mutate({
          variables: { input },
        }).then((response) => {
          const { metrcPackageId, tag } = response.data.updatePackage.package.providerInfo
          ownProps.addNotification(updatePackageSuccessToast(metrcPackageId, tag))
          return response
        }, (error) => {
          ownProps.addNotification(updatePackageErrorToast(error.message))
          return error
        })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)

export default withUpdatePackage
