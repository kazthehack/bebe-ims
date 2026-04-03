//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Title from 'components/common/display/Title'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import { get } from 'lodash'
import ReactGA from 'react-ga'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { salesTypeDataPropTypes } from 'components/SalesTypes'
import colors from 'styles/colors'
import Button from 'components/common/input/Button'
import AssociatedProduct from './PackageAssociatedProduct'
import PackageInventoryData from './PackageInventoryData'
import PackageMetrcDetails from './PackageMetrcDetails'
import PackageSource from './PackageSource'
import PackageProducer from './PackageProducer'
import PackageLabResults from './PackageLabResults'
import PreviousLabResults from './PreviousLabResults'
import { SectionContainer, StyledSubHeader } from './PackageStyledComponents'

const StyledForm = styled.form`
  width: 976px;
`
const StyledTitle = styled(Title)`
  letter-spacing: 1px;
  color: ${colors.grayDark2};
`

const PackageDetailPure = ({
  packageDetailsData,
  onCancel,
  salesTypeOptions,
  salesTypeData,
  pkg,
  initialValues,
  onSubmitAdjustPackage,
  onSubmitUpdatePackage,
  reasons,
  storeBrands,
  storeStrains,
  userPermissions,
  viewHarvestModal,
  venueSettings,
  metrcSettings,
  history,
}) => (
  <Form
    onSubmit={onSubmitUpdatePackage}
    initialValues={initialValues}
    keepDirtyOnReinitialize
    decorators={[focusOnError]}
    render={({ handleSubmit, values, form, pristine, submitting, errors }) => (
      <Fragment>
        <StyledForm>
          <StyledTitle>Package details</StyledTitle>
          <PackageInventoryData
            isOnHold={get(pkg, 'isOnHold', false)}
            values={values}
            form={form}
            userPermissions={userPermissions}
            onSubmitAdjustPackage={onSubmitAdjustPackage}
            reasons={reasons}
            initialValues={initialValues}
            metrcReadOnly={get(metrcSettings, 'store.integrations.metrc.readOnly')}
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
            venueSettings={venueSettings}
            errors={errors}
          />
          <PackageMetrcDetails
            userPermissions={userPermissions}
            packageId={get(pkg, 'id')}
          />
          <PackageSource userPermissions={userPermissions} />
          <PackageProducer
            storeBrands={storeBrands}
            userPermissions={userPermissions}
            values={values}
            form={form}
            viewHarvestModal={viewHarvestModal}
            venueSettings={venueSettings}
          />
          <PackageLabResults
            initialValues={initialValues}
            values={values}
            form={form}
            storeStrains={storeStrains}
            userPermissions={userPermissions}
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
            <Button
              primary
              onClick={() => {
                ReactGA.event({
                  category: GATypes.eventCategories.packageChangeLog,
                  action: GATypes.eventActions.viewed,
                })
                history.push(`/packagelogs/${get(pkg, 'id')}`)
              }}
            >
              View Change Log
            </Button>
          </SectionContainer>
          <FixedFooterContainer
            showCancel
            onCancel={() => onCancel(pristine && values.altPristine)}
            showSave={userPermissions.write}
            onSave={handleSubmit}
            saveButtonType="button"
            saveDisabled={(pristine && values.altPristine) || submitting}
          />
        </StyledForm>
      </Fragment>
    )}
  />
)

PackageDetailPure.propTypes = {
  userPermissions: UserPermissionsPropType,
  packageDetailsData: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  salesTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  salesTypeData: salesTypeDataPropTypes,
  pkg: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmitAdjustPackage: PropTypes.func.isRequired,
  onSubmitUpdatePackage: PropTypes.func.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  storeStrains: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  storeBrands: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  viewHarvestModal: PropTypes.func.isRequired,
  venueSettings: PropTypes.object.isRequired,
  metrcSettings: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
}

export default PackageDetailPure
