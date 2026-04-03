//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { compose, withStateHandlers, withProps, withState } from 'recompose'
import { graphql } from 'api/operationCompat'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import { parse, format, getHours, setHours, setMinutes } from 'date-fns'
import { updateStore, fetchVenueSettings } from 'ops'
import { withVenueSettings } from 'components/Venue'
import { get } from 'lodash'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import { withNotifications, getNotification } from 'components/Notifications'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { withConfirm, withAlert } from 'components/Modal'
import { withRouter } from 'react-router-dom'

import StoreInformation from './details/StoreInformation'
import ReportingIntegrations from './details/ReportingIntegrations'
import PosSettings from './details/PosSettings'
import SettingsNavigation from '../SettingsNavigation'

const SAVE_SUCCESS = (name = 'Dispensary Settings') => getNotification('success', 'Success:', `${name} saved`)
const SAVE_ERROR = (message = '') => getNotification('error', 'Error', message)

const mapInitialValues = (store = {}) => {
  // Remove sub-second information
  const { settings = {}, posSettings = {}, id, owner, ...values } = store
  const timeStamp = settings.runReportsAt.replace(/\..*/, '')
  const { pricingScheme } = settings
  const runReportsAt = parse(`1970-01-01T${timeStamp}`)
  const amPm = format(runReportsAt, 'A')
  const hour = getHours(runReportsAt)
  const {
    useWeightHeavy,
    weightHeavyQuantity,
    usePackageFinishThreshold,
    packageFinishThreshold,
    usePosAutoLogout,
    posAutoLogoutMinutes,
    openCashDrawerRequiresManager,
    logoutAfterSale,
    useForceAgeCheck,
    ageCheck,
    labelPrintTiming,
    useSplitPricing,
    metrcDelayMins,
    enableReceiptPrint,
  } = posSettings

  const posSettingsInit = {
    flowerLimitChecked: useWeightHeavy,
    flowerLimit: weightHeavyQuantity,
    sleepTimerChecked: usePosAutoLogout,
    sleepTimer: posAutoLogoutMinutes,
    packageSoldOutThresholdChecked: usePackageFinishThreshold,
    packageSoldOutThreshold: packageFinishThreshold,
    managerApproval: openCashDrawerRequiresManager,
    logoutAfterSale: String(logoutAfterSale),
    useForceAgeCheck,
    ageCheck,
    labelPrintTiming,
    enableReceiptPrint,
    useSplitPricing: String(useSplitPricing),
    metrcDelayMins: metrcDelayMins || '',
    metrcDelayMinsChecked: !!metrcDelayMins,
  }

  return {
    hour: hour === 12 || hour === 0 ? 12 : hour % 12,
    amPm,
    pricingScheme,
    owner: owner.name,
    ...posSettingsInit,
    ...values,
  }
}

export const VenueTabPure = ({
  venueSettings,
  onSubmit,
  editing,
  toggleEdit,
  alert,
  confirm,
  userPermissions,
  history,
  setSubmitting,
  submitting,
}) => {
  const initialValues = mapInitialValues(venueSettings.store)
  const { enableDareMode } = get(venueSettings, 'store.settings')
  let warningMsg = ''
  return (
    <Form
      keepDirtyOnReinitialize
      initialValues={initialValues}
      decorators={[focusOnError]}
      onSubmit={(values) => {
        setSubmitting(!submitting)
        onSubmit(values)
        // TODO: This should be done through a callback in the other mutation
      }}
      render={({ handleSubmit, values, form, pristine }) => (
        <Fragment>
          {submitting && <Spinner wrapStyle={{ position: 'absolute', top: '25%' }} />}
          <form className="VenueTabPure" onSubmit={handleSubmit}>
            <div disabled={submitting || !editing}>
              <Grid fluid style={{ padding: 0, margin: 0 }}>
                <Row>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <StoreInformation
                      id="storeInfo"
                      disabled={submitting || !editing}
                      storeId={venueSettings.store.id}
                      logoUrl={venueSettings.store.logoUrl}
                    />
                  </Col>
                  { !enableDareMode &&
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <PosSettings
                        disabled={submitting || !editing}
                        values={values}
                        changeValue={(name, value) => {
                          form.change(name, value)
                        }}
                      />
                      <ReportingIntegrations disabled={submitting || !editing} />
                    </Col>
                  }
                </Row>
              </Grid>
            </div>
            {editing &&
            userPermissions.write &&
              <FixedFooterContainer
                showCancel
                onCancel={() => (pristine ?
                  toggleEdit() :
                  confirm({
                    title: 'Discard changes',
                    message: 'Discard changes made to your dispensary settings?',
                  })
                    .then((confirmed) => {
                      if (confirmed) {
                        toggleEdit()
                        history.push('/settings')
                      }
                }))}
                showSave
                saveDisabled={pristine || submitting}
                saveButtonType="submit"
                onSave={() => {
                  if (initialValues.pricingScheme !== values.pricingScheme) {
                    warningMsg = `You have changed your pricing scheme from ${initialValues.pricingScheme} to ${values.pricingScheme} . This will radically change pricing on all your products. You will need to check pricing on each product to ensure it is correct after saving this change.`
                  }
                  if ((initialValues.licenseNumber !== values.licenseNumber) && (values.licenseNumber !== '')) {
                    warningMsg += '\n\nAfter updating your Metrc information we recommend that you reimport your packages by going to Inventory -> Packages -> Sync with Metrc.'
                  }
                  if (warningMsg) {
                    alert({
                      contentStyle: { content: { width: '34em', marginBottom: '40px' } },
                      title: 'Warning',
                      message: warningMsg,
                    })
                  }
                }}
              />
            }
            {!editing &&
            userPermissions.write &&
              <FixedFooterContainer
                id="footerButtons"
                showEdit
                onEdit={toggleEdit}
                editDisabled={submitting}
              />
            }
          </form>
        </Fragment>
      )}
    />
  )
}

VenueTabPure.propTypes = {
  venueSettings: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  userPermissions: UserPermissionsPropType,
  history: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  setSubmitting: PropTypes.func.isRequired,
}

// TODO: add loading and error handlers
const VenueTabInfo = compose(
  withNotifications,
  withAuthenticatedEmployee, // authenticatedUserData
  withProps(({ authenticatedUserData, venueSettings }) => ({
    isStoreOwner: get(authenticatedUserData, 'viewer.id') === get(venueSettings, 'store.owner.id'),
  })),
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withConfirm(),
  withAlert(),
  withRouter,
  withStateHandlers(
    { editing: false },
    { toggleEdit: ({ editing }) => () => ({ editing: !editing }) },
  ),
  withState('submitting', 'setSubmitting', false),
  graphql(updateStore, {
    props: ({ mutate, ownProps }) => ({
      // TODO: Pass through owner when we have backend support
      onSubmit: ({
        owner,
        hour,
        amPm,
        pricingScheme,
        labelPrintTiming,
        flowerLimit,
        flowerLimitChecked,
        sleepTimerChecked,
        sleepTimer,
        packageSoldOutThresholdChecked,
        packageSoldOutThreshold,
        metrcDelayMins,
        metrcDelayMinsChecked,
        managerApproval,
        logoutAfterSale,
        editing,
        ageCheck,
        useForceAgeCheck,
        __typename,
        useSplitPricing,
        integrations,
        enableReceiptPrint,
        ...values
      }) => {
        const intHour = parseInt(hour, 10)
        let normalizedHour = intHour + (amPm === 'PM' ? 12 : 0)
        // if hour was 12, then it will have been accounted for improperly, so adjust for that here
        if (intHour === 12) {
          normalizedHour -= 12
        }
        const runReportsAt = format(setMinutes(setHours(Date.now(), normalizedHour), 0), 'HH:mm')
        const convertedMetrcDelayMins = metrcDelayMinsChecked ? metrcDelayMins : 0

        // TODO: because they haven't added logoUrl yet with updateStore,
        // we may remove this when they do
        // eslint-disable-next-line no-param-reassign
        delete values.logoUrl

        const input = {
          storeId: ownProps.selectedVenueId,
          ...values,
          settings: {
            runReportsAt,
            pricingScheme,
          },
          posSettings: {
            useWeightHeavy: flowerLimitChecked,
            weightHeavyQuantity: flowerLimit,
            usePackageFinishThreshold: packageSoldOutThresholdChecked,
            packageFinishThreshold: packageSoldOutThreshold,
            usePosAutoLogout: sleepTimerChecked,
            posAutoLogoutMinutes: sleepTimer,
            openCashDrawerRequiresManager: managerApproval,
            enableReceiptPrint,
            logoutAfterSale: JSON.parse(logoutAfterSale || false),
            useForceAgeCheck,
            ageCheck,
            labelPrintTiming,
            useSplitPricing: JSON.parse(useSplitPricing || false),
            metrcDelayMins: convertedMetrcDelayMins,
          },
        }

        return mutate({
          variables: { input },
          update: (cache) => {
            const variables = { storeID: ownProps.selectedVenueId }
            const data = cache.readQuery({ query: fetchVenueSettings, variables })
            return cache.writeQuery({
              query: fetchVenueSettings,
              variables,
              data,
            })
          },
        })
          .then(() => {
            ownProps.addNotification(SAVE_SUCCESS())
            ownProps.toggleEdit()
            ownProps.setSubmitting(false)
          }, (error) => {
            ownProps.addNotification(SAVE_ERROR(error.message))
            ownProps.setSubmitting(false)
          })
      },
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
)(VenueTabPure)


export const VenueTab = compose(
  withVenueSettings(),
)(({ venueSettings }) => (
  <div>
    <Title>
      {`${get(venueSettings, 'store.settings.enableDareMode') ? 'Store' : 'Dispensary'} Settings`}
    </Title>
    <SettingsNavigation />
    <VenueTabInfo venueSettings={venueSettings} />
  </div>
))
