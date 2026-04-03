//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import Title from 'components/common/display/Title'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormToggle } from 'components/common/input/Toggle'
import NestingCheckboxList, {
  allCheckboxValues,
  atLeastOneSelected,
} from 'components/common/input/NestingCheckboxList'
import { FormTextField } from 'components/common/input/TextField'
import {
  combineValidators,
  required,
  sanitizedStringValidator,
  stringOfMaximumLength,
  numberValidator,
  positiveNumber,
  checkUnique,
  floatValidator,
  withinRangeValidator,
  maxDecimalPlaces,
} from 'utils/validators'
import { salesTypeDataPropTypes } from 'components/SalesTypes'
import colors from 'styles/colors'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { TaxModel } from '../propTypes'

// TODO: These should be consolidated with other hard-coded options
const taxOptions = {
  taxType: [
    { name: 'Percent', value: 'PERCENTAGE' },
    { name: 'Amount', value: 'FIXED' },
  ],
  customerType: [
    { name: 'Any customer', value: 'ANY' },
    { name: 'Medical', value: 'MEDICAL' },
    { name: 'Recreational', value: 'RECREATIONAL' },
  ],
}

const defaultInitalValues = {
  name: '',
  customerType: 'ANY',
  amountType: 'PERCENTAGE',
  amount: '',
  active: false,
}

const initialValues = (checkboxGroups, tax, lineItem, customerType) => {
  const salesTypes = get(tax, 'salesTypes')
  const salesTypesMap = lineItem ? allCheckboxValues(checkboxGroups, false, salesTypes) : undefined
  const initialVals = {
    ...defaultInitalValues,
    ...tax,
    salesTypes: salesTypesMap,
    customerType,
  }

  return initialVals
}

const validateCheckboxList = values =>
  (atLeastOneSelected(values.salesTypes) ? {} : { checkboxes: 'At least one is required' })

const TaxForm = ({
  taxData,
  taxList,
  lineItem,
  onSubmit,
  deleteTax,
  onCancel,
  salesTypeData: { salesTypes },
  userPermissions,
  venueSettings,
}) => {
  const { enableDareMode } = get(venueSettings, 'store.settings')
  const tax = get(taxData, 'tax')
  const type = lineItem ? 'Line item' : 'Subtotal'
  const checkboxGroups = salesTypes
  // It is to use the DARE mode. If the DARE mode is enabled, RECREATIONAL is the default
  let customerType = 'ANY'
  if (get(tax, 'customerType')) {
    customerType = get(tax, 'customerType')
  } else if (enableDareMode) {
    customerType = 'RECREATIONAL'
  }
  const initialValuesMap = initialValues(checkboxGroups, tax, lineItem, customerType)
  const otherTaxNames = taxList.filter(({ id }) => id !== get(tax, 'id')).map(({ name }) => name)
  return (
    <Form
      keepDirtyOnReinitialize
      onSubmit={onSubmit}
      initialValues={initialValuesMap}
      validate={lineItem ? validateCheckboxList : null}
      decorators={[focusOnError]}
      render={({ handleSubmit, values, form, pristine, errors, submitting }) => (
        <form onSubmit={handleSubmit}>
          {tax ?
            <Title>{tax.name || 'Unnamed Tax'}</Title>
            :
            <Title>New {type}</Title>
          }
          <StyledFormContent>
            <StyledFormColumn>
              <ToggleContainer style={{ marginTop: '13px' }}>
                <label>Active</label>
                <FormToggle
                  name="active"
                  noStatusText
                  disabled={!userPermissions.write}
                  onChange={() => {
                    form.change('active', !values.active)
                    form.change('activeChangePristine', !values.activeChangePristine)
                  }}
                />
              </ToggleContainer>
              <StyledFormGroup>
                <label>Name</label>
                <StyledUnlabeledInput
                  name="name"
                  type="text"
                  placeholder="Tax name"
                  disabled={!userPermissions.write}
                  validate={combineValidators(
                    required,
                    sanitizedStringValidator,
                    stringOfMaximumLength(255),
                    checkUnique(otherTaxNames, 'A tax with this name already exists'),
                  )}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Tax type</label>
                <StyledLabeledInput
                  name="type"
                  type="text"
                  value={type}
                  disabled
                />
              </StyledFormGroup>
              { !enableDareMode &&
                <StyledFormGroup>
                  <label>Customer type</label>
                  <FormSelectField name="customerType" options={taxOptions.customerType} disabled={!userPermissions.write} />
                </StyledFormGroup>
              }
              <StyledFormGroup>
                <label>Rate</label>
                <FormSelectField name="amountType" options={taxOptions.taxType} disabled={!userPermissions.write} />
              </StyledFormGroup>
              {values.amountType === 'PERCENTAGE' ?
                <StyledFormGroup>
                  <label>Percent</label>
                  <StyledLabeledInput
                    key="percent"
                    name="amount"
                    suffix="%"
                    placeholder="Percent tax"
                    disabled={!userPermissions.write}
                    validate={combineValidators(
                      required,
                      numberValidator,
                      withinRangeValidator(0.0, 100.0, false),
                      floatValidator,
                      maxDecimalPlaces(2),
                    )}
                  />
                </StyledFormGroup>
              :
                <StyledFormGroup>
                  <label>Amount</label>
                  <StyledLabeledInput
                    key="amount"
                    name="amount"
                    prefix="$"
                    disabled={!userPermissions.write}
                    placeholder="Fixed tax amount"
                    validate={combineValidators(
                      required,
                      numberValidator,
                      positiveNumber,
                      floatValidator,
                      maxDecimalPlaces(2),
                    )}
                  />
                </StyledFormGroup>
              }
            </StyledFormColumn>
            {lineItem &&
              <StyledFormColumn>
                <TaxItemsHeader>
                  APPLIES TO:
                  <TooltipWithIcon text="Applies to determines if sales types will be affected by this tax." />
                </TaxItemsHeader>
                <NestingCheckboxList
                  groups={checkboxGroups}
                  changeFormValue={form.change}
                  values={values}
                  name="salesTypes"
                  subItemsName="salesTypes"
                  disabled={!userPermissions.write}
                />
                {errors.checkboxes &&
                  <TaxItemsValidationError>{errors.checkboxes}</TaxItemsValidationError>
                }
              </StyledFormColumn>
            }
          </StyledFormContent>
          <FixedFooterContainer
            showDelete={tax && userPermissions.write}
            deleteText="Delete Tax"
            onDelete={deleteTax}
            showCancel
            onCancel={() => { onCancel(pristine) }}
            showSave={userPermissions.write}
            saveDisabled={pristine || submitting}
            saveButtonType="submit"
          />
        </form>
      )}
    />
  )
}

TaxForm.propTypes = {
  lineItem: PropTypes.bool,
  taxData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  deleteTax: PropTypes.func,
  onCancel: PropTypes.func,
  taxList: PropTypes.arrayOf(TaxModel),
  salesTypeData: salesTypeDataPropTypes,
  userPermissions: UserPermissionsPropType,
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default TaxForm

const StyledFormContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const StyledFormColumn = styled.div`
  flex: 5 0 50%;
  max-width: 455px;

  &:first-of-type {
    margin-right: 64px;
  }
`

const StyledFormGroup = styled.div`
  display: flex;
  margin-top: 0px;
  margin-bottom: 32px;
  align-items: center;

  label {
    flex: 3 0 30%;
    font-size: 14px;
    color: ${colors.grayDark2};
    max-width: 135px;
    display: inline-block;
  }
`

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  width: 182px;
  label {
    font-size: 14px;
    color: ${colors.grayDark2};
  }
`

const StyledLabeledInput = styled(FormTextField)`
  width: 320px;
`

const StyledUnlabeledInput = styled(FormTextField)`
  width: 320px;
`

const TaxItemsHeader = styled.div`
  font-weight: bold;
  line-height: normal;
  letter-spacing: 1px;
  color: #8b939e;
  margin-bottom: 36px;
  font-size: 14px;
`

const TaxItemsValidationError = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
`
