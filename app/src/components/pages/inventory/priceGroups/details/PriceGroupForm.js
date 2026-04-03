//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import { get } from 'lodash'
import { FormTextField } from 'components/common/input/TextField'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormToggle } from 'components/common/input/Toggle'
import Title from 'components/common/display/Title'
import Subheader from 'components/common/display/Subheader'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import colors from 'styles/colors'
import { PricingTable } from 'components/PricingTable'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { FormSelectField } from 'components/common/input/SelectField'
import {
  required,
  sanitizedStringValidator,
  combineValidators,
  stringOfMaximumLength,
} from 'utils/validators'
import { updateTax, updateValuesOnMedicalSameChecked } from 'utils/priceGroup'
import findTaxes from 'utils/aggregateTaxesForPriceTables'
import { TaxModel } from 'components/pages/settings/taxes/propTypes'
import { focusOnError } from 'components/common/form/decorators'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { pricingScheme, customPricing, recreationalPricing, medicalPricing, medicalSame } from 'constants/TooltipMessages'
import PriceGroupsAssociatedProductsTable from '../PriceGroupsAssociatedProductsTable'

const flowerConstMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med',
  TAX: 'tax',
  ACTIVE: 'portalActive',
}

const StyledTitle = styled(Title)`
  margin-bottom: 22px;
`

const RowDiv = styled.div`
  height: 40px;
  width: 100%;
  line-height: 40px;
  vertical-align: middle;
  align-items: center;
  margin-bottom: 10px;
  color: ${colors.grayDark2};
  display: flex;
`

const LabelDiv = styled.div`
  width: 136px;
`

const TextDiv = styled.div`
  color: ${colors.blueishGray};
`

const StyledFormTextField = styled(FormTextField)`
  font-size: 14px;
`

const CheckboxDiv = styled.div`
  margin: 16px 0 0 16px
`

const blankOptions = [{ name: '', value: '' }]
const ON_TOGGLE_OFF_MSG = `This price group is currently being used by one or more products and cannot be deactivated. Please reactivate it in order to save.\n
This price group will have to be removed from any active or inactive products before you will be able to deactivate it.\n`

const PriceGroupForm = ({
  edit,
  onCancel,
  onSubmit,
  onDelete,
  userPermissions,
  initialValues,
  flower,
  pre,
  typeOptions,
  taxList,
  alert,
  productsData,
  priceGroupProductsData,
}) => {
  const [portalMedicalSameChanged, setPortalMedicalSameChanged] = useState(false)
  return (
    <Fragment>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        decorators={[focusOnError]}
        keepDirtyOnReinitialize
        render={({ handleSubmit, values, form, pristine, submitting, errors }) => (
          <form onSubmit={handleSubmit}>
            <StyledTitle>
              {edit ? 'Edit' : 'New'} price group
              <TooltipWithIcon
                text="New price groups can be assigned to multiple products. If two products are purchased in the same price group, they count as identical for the purpose of determining price points."
                style={{ fontSize: '16px' }}
              />
            </StyledTitle>
            <RowDiv>
              <LabelDiv>Active</LabelDiv>
              <FormToggle
                name="active"
                checkedStatusText=""
                uncheckedStatusText=""
                disabled={!userPermissions.write}
              />
            </RowDiv>
            <RowDiv>
              <LabelDiv>Name</LabelDiv>
              <StyledFormTextField
                name="name"
                placeholder="Top Shelf Flower"
                type="text"
                // errorText={false}
                validate={combineValidators(
                  required,
                  sanitizedStringValidator,
                  stringOfMaximumLength(255),
                  )}
                disabled={!userPermissions.write}
              />
            </RowDiv>
            <RowDiv>
              <LabelDiv>Pricing scheme</LabelDiv>
              <TextDiv>
                {pre ? 'Traditional pricing (pre-tax)' : 'Inclusive pricing (post-tax)' }
                <TooltipWithIcon
                  text={pricingScheme}
                />
              </TextDiv>
            </RowDiv>
            <RowDiv>
              <LabelDiv>
                Type
                <TooltipWithIcon
                  text="Price groups only apply to Buds and Shake/Trim."
                  style={{ verticalAlign: 'middle' }}
                />
              </LabelDiv>
              <FormSelectField // This is supposed initialize to be blank. See placeHolder prop
                name="salesTypeId"
                disabled={edit}
                options={typeOptions ?
                  typeOptions.map(type => ({ value: type.id, name: type.name }))
                  : blankOptions
                }
                onChange={(e) => {
                  const newType = typeOptions.find(type => e.target.value === type.id)
                  const newTax = findTaxes(taxList, newType)
                  const constMap = flowerConstMap // TODO: possibly support non-flower post-MVP
                  form.change('tax', newTax)
                  // Update Recreational Price groups
                  // ( represents both price groups if portalMedicalSame is true )
                  updateTax({
                    changeForm: form.change,
                    tax: newTax.rec,
                    medTax: newTax.med,
                    table: flower ? 'customPG.prices.rec' : 'customPG.prices.rec[0]',
                    portalMedicalSame: values.portalMedicalSame,
                    constMap,
                    values,
                    flower,
                    preScheme: pre,
                  })
                  // Update Medical prices separately if not portalMedicalSame
                  if (!values.portalMedicalSame) {
                    updateTax({
                      changeForm: form.change,
                      tax: newTax.med,
                      medTax: {},
                      table: flower ? 'customPG.prices.med' : 'customPG.prices.med[0]',
                      portalMedicalSame: values.portalMedicalSame,
                      constMap,
                      values,
                      flower,
                      preScheme: pre,
                    })
                  }
                }}
              />
            </RowDiv>
            <Subheader
              textSizeOption={2}
              color={colors.blueishGray}
            >
              RECREATIONAL CUSTOMER PRICING
              <TooltipWithIcon
                text={
                  <div>
                    {customPricing}
                    <br /><br />
                    {recreationalPricing}
                  </div>
                }
              />
            </Subheader>
            <PricingTable
              values={values}
              changeForm={form.change}
              pre={pre}
              table="customPG.prices.rec"
              tax={values.tax.rec}
              medTax={values.tax.med}
              userPermissions={userPermissions}
              portalMedicalSame={get(values, 'portalMedicalSame')}
            />
            <CheckboxDiv>
              <FormCheckbox
                name="portalMedicalSame"
                label="Use the same base prices for medical patients"
                tooltip={medicalSame}
                labelStyle={{ color: colors.grayDark2 }}
                disabled={!userPermissions.write}
                onChange={(e) => {
                  setPortalMedicalSameChanged(true)
                  const oldValue = e.target.value // For some reason these are a string???
                  if (oldValue === 'false') {
                    updateValuesOnMedicalSameChecked({
                      changeForm: form.change,
                      values,
                      tax: values.tax.med,
                      preScheme: pre,
                      constMap: flowerConstMap,
                      valuePath: 'customPG.prices.rec',
                    })
                  }
                }}
              />
            </CheckboxDiv>
            <Subheader
              textSizeOption={2}
              color={colors.blueishGray}
            >
              MEDICAL PATIENT PRICING
              <TooltipWithIcon text={medicalPricing} />
            </Subheader>
            <PricingTable
              tax={values.tax.rec}
              medTax={values.tax.med}
              values={values}
              changeForm={form.change}
              pre={pre}
              table="customPG.prices.med"
              errors={errors}
              userPermissions={userPermissions}
              portalMedicalSame={get(values, 'portalMedicalSame')}
              uneditable={get(values, 'portalMedicalSame')}
            />
            {edit && !priceGroupProductsData.loading &&
              <PriceGroupsAssociatedProductsTable
                data={priceGroupProductsData.store.products.edges}
                loading={priceGroupProductsData.loading}
              />
            }
            {/*
              TODO: consider adding: if a user pressed enter on the submit button, it will cause the
              form to submit (currently the user can press space bar, or of course click it)
            */}
            <FixedFooterContainer
              showDelete={((edit && userPermissions.write) && !values.archivedDate)}
              onDelete={() => onDelete(initialValues)}
              deleteText="Delete Price Group"
              showCancel
              onCancel={() => onCancel(pristine)}
              showSave={userPermissions.write}
              saveDisabled={
                (pristine && !portalMedicalSameChanged)
                || submitting
                || !!values.archivedDate
              }
              onSave={() => {
                if (values.active === false && edit &&
                  (productsData.store.products.edges.find(product =>
                    product.node.priceGroup.id === values.id))) {
                      alert({
                        title: 'Price group changes cannot be saved',
                        message: ON_TOGGLE_OFF_MSG,
                        primaryText: 'OK',
                      })
                      if (pristine) {
                        form.reset()
                      } else {
                        form.change('active', 'true')
                      }
                } else {
                  handleSubmit()
                }
              }}
            />
          </form>
        )}
      />
    </Fragment>
  )
}

PriceGroupForm.propTypes = {
  edit: PropTypes.bool,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  userPermissions: UserPermissionsPropType,
  initialValues: PropTypes.object,
  pre: PropTypes.bool,
  flower: PropTypes.bool,
  typeOptions: PropTypes.arrayOf(PropTypes.object),
  taxList: PropTypes.arrayOf(PropTypes.shape({ node: TaxModel })),
  alert: PropTypes.func,
  productsData: PropTypes.object,
  priceGroupProductsData: PropTypes.object,
}

export default PriceGroupForm
