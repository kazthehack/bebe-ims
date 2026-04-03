//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useState } from 'react'
import { compose, withState } from 'recompose'
import { get, isEmpty, isDate } from 'lodash'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import colors from 'styles/colors'
import { Form } from 'react-final-form'
import Spinner from 'components/common/display/Spinner'
import Button from 'components/common/input/Button'
import { withNotifications } from 'components/Notifications'
import { withConfirm, withCancelConfirmation } from 'components/Modal'
import { withSalesTypes, defaultGroupings, salesTypeDataPropTypes } from 'components/SalesTypes'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withVenueSettings } from 'components/Venue'
import Title from 'components/common/display/Title'
import { focusOnError } from 'components/common/form/decorators'
import { renderWhileLoading } from 'utils/hoc'
import withPackageDetails from './withPackageDetails'
import withAdjustQuantity from './withAdjustQuantity'
import withUpdatePackage from './withUpdatePackage'
import withHarvestModal from './withHarvestModal'
import withFilteredPackageIDs from '../withFilteredPackageIDs'
import AssociatedProduct from './PackageAssociatedProduct'
import PackageInventoryData from './PackageInventoryData'
import PackageMetrcDetails from './PackageMetrcDetails'
import PackageSource from './PackageSource'
import PackageProducer from './PackageProducer'
import PackageLabResults from './PackageLabResults'
import PreviousLabResults from './PreviousLabResults'
import { SectionContainer, StyledSubHeader } from './PackageStyledComponents'
import FooterPackageDetails from './FooterPackageDetails'

const StyledForm = styled.form`
  width: 976px;
`
const StyledTitle = styled(Title)`
  letter-spacing: 1px;
  color: ${colors.grayDark2};
  margin-bottom: 26px;
  font-size: 26px;
`
const StyledSubTitle = styled(Title)`
  font-size: 20px;
  letter-spacing: 0.34px;
  margin-top: 0;
`

const mandatoryFieldStyles = {
  borderColor: colors.red,
}

const FixPackage = ({
  packageDetailsData,
  salesTypeOptions,
  salesTypeData,
  pkg,
  initialValues,
  onSubmitAdjustPackage,
  onFixPackage,
  reasons,
  storeBrands,
  storeStrains,
  userPermissions,
  viewHarvestModal,
  venueSettings,
  history,
  needsAttentionIndex,
  setNeedsAttentionIndex,
  filteredPackageIDs,
}) => {
  const packageData = get(filteredPackageIDs, 'store.packages')
  const totalPackages = get(packageData, 'totalCount')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const id = get(packageData, `edges[${needsAttentionIndex}].node.id`)
    if (!id) {
      history.push('/inventory/packages')
    } else {
      setShowError(false)
      history.push(`/inventory/packages/fix/${id}`)
    }
  }, [needsAttentionIndex])

  const isNotValid = values => isEmpty(get(values, 'facilityLicense')) ||
      isEmpty(get(values, 'facilityName')) ||
      isEmpty(get(values, 'producerLicense')) ||
      isEmpty(get(values, 'producerName')) ||
      isEmpty(get(values, 'labResult.testLabName')) ||
      (
        (!get(values, 'labResult.isThcUnderLoq')) &&
        isEmpty(String(get(values, 'labResult.displayThc')))
      ) ||
      (
        (!get(values, 'labResult.isCbdUnderLoq')) &&
        isEmpty(String(get(values, 'labResult.displayCbd')))
      ) ||
      !isDate(get(values, 'labResult.testDate')) ||
      !isDate(get(values, 'harvestDate'))
      || isEmpty(get(pkg, 'product'))

  return (
    <Form
      onSubmit={(values) => {
        if (isNotValid(values) && !showError) {
          setShowError(true)
          return
        }
        onFixPackage({ package: values, updateFromModal: true })
          .then(() => {
            // Package successfully updated
            setNeedsAttentionIndex(needsAttentionIndex + 1)
          })
      }}
      initialValues={initialValues}
      decorators={[focusOnError]}
      render={({ values, form, pristine, handleSubmit }) => (
        <Fragment>
          <StyledForm>
            <StyledTitle>Fix Packages</StyledTitle>
            <StyledSubTitle>Package details</StyledSubTitle>
            <PackageInventoryData
              isOnHold={get(pkg, 'isOnHold', false)}
              values={values}
              form={form}
              userPermissions={userPermissions}
              onSubmitAdjustPackage={onSubmitAdjustPackage}
              reasons={reasons}
              initialValues={initialValues}
              metrcReadOnly={get(venueSettings, 'store.integrations.metrc.readOnly')}
            />
            <AssociatedProduct
              product={get(pkg, 'product', {})}
              packageId={get(pkg, 'id')}
              loading={get(packageDetailsData, 'loading', true)}
              values={values}
              salesTypeOptions={salesTypeOptions}
              salesTypeData={salesTypeData}
              userPermissions={userPermissions}
              pristine={pristine}
              form={form}
              className={isEmpty(get(pkg, 'product')) ? 'table-error' : null}
            />
            <PackageMetrcDetails
              userPermissions={userPermissions}
              packageId={get(pkg, 'id')}
            />
            <PackageSource
              userPermissions={userPermissions}
              values={values}
              mandatoryFieldStyles={mandatoryFieldStyles}
            />
            <PackageProducer
              storeBrands={storeBrands}
              userPermissions={userPermissions}
              values={values}
              form={form}
              viewHarvestModal={viewHarvestModal}
              mandatoryFieldStyles={mandatoryFieldStyles}
              venueSettings={venueSettings}
            />
            <PackageLabResults
              initialValues={initialValues}
              values={values}
              form={form}
              storeStrains={storeStrains}
              userPermissions={userPermissions}
              mandatoryFieldStyles={mandatoryFieldStyles}
              venueSettings={venueSettings}
            />
            <PreviousLabResults
              values={values}
              form={form}
              userPermissions={userPermissions}
            />
            <SectionContainer>
              <StyledSubHeader style={{ marginBottom: '12px' }}>
                  Package Change Log
              </StyledSubHeader>
              <Button primary onClick={() => { history.push(`/packagelogs/${get(pkg, 'id')}`) }}>
                  View Change Log
              </Button>
            </SectionContainer>
            <FooterPackageDetails
              title={'Fix Packages'}
              totalPackages={totalPackages}
              needsAttention={needsAttentionIndex}
              onBack={() => {
                if (needsAttentionIndex > 0) {
                  setNeedsAttentionIndex(needsAttentionIndex - 1)
                } else {
                  history.push('/inventory/packages')
                }
              }}
              onSubmit={handleSubmit}
              valid={!isNotValid(values)}
              showError={showError}
              setShowError={setShowError}
            />
          </StyledForm>
        </Fragment>
        )}
    />
  )
}

FixPackage.propTypes = {
  userPermissions: UserPermissionsPropType,
  packageDetailsData: PropTypes.object.isRequired,
  salesTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  salesTypeData: salesTypeDataPropTypes,
  pkg: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmitAdjustPackage: PropTypes.func.isRequired,
  onFixPackage: PropTypes.func.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  storeStrains: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  storeBrands: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  viewHarvestModal: PropTypes.func.isRequired,
  venueSettings: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  needsAttentionIndex: PropTypes.number,
  setNeedsAttentionIndex: PropTypes.func,
  filteredPackageIDs: PropTypes.object,
}

const FixPackageDetail = compose(
  withRouter,
  withNotifications,
  withAuthenticatedEmployee,
  withVenueSettings(),
  withPermissions('INVENTORY'),
  withConfirm(),
  withCancelConfirmation('/inventory/packages'),
  withAdjustQuantity(true),
  withUpdatePackage(),
  withState('needsAttentionIndex', 'setNeedsAttentionIndex', 0),
  withHarvestModal,
  withSalesTypes(defaultGroupings),
  withPackageDetails(),
  withFilteredPackageIDs,
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['packageDetailsData', 'salesTypeData', 'storeStrains', 'storeBrands', 'venueSettings'], 'selectedVenueId'),
  withQueryErrorPageOnError(['packageDetailsData', 'salesTypeData', 'storeStrains', 'storeBrands', 'venueSettings'], true),
)(FixPackage)

export default FixPackageDetail
