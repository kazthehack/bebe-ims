//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import styled from 'styled-components'
import Title from 'components/common/display/Title'
import { FormTextField } from 'components/common/input/TextField'
import { FormSelectField } from 'components/common/input/SelectField'
import NestingCheckboxList, { allCheckboxValues } from 'components/common/input/NestingCheckboxList'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import CustomerTypes, { CustomerTypePropType } from 'constants/CustomerTypes'
import {
  combineValidators,
  required,
  sanitizedStringValidator,
  stringOfMaximumLength,
  numberValidator,
  positiveNumber,
  floatValidator,
  integerValidator,
  checklistValidator,
  maxDecimalPlaces,
} from 'utils/validators'
import Units, { unitsToSuffixMap } from 'constants/Units'
import colors from 'styles/colors'
import { get, isEmpty } from 'lodash'
import { salesTypeDataPropTypes } from 'components/SalesTypes'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'

const defaultInitialValues = {
  name: '',
  unit: 'GRAMS',
}

const TimeframeMedical = [
  { name: 'Daily', value: 'DAILY' },
  { name: 'Monthly', value: 'MONTHLY' },
]

const TimeframeRecreational = [
  { name: 'Transaction', value: 'TRANSACTION' },
]

const initialValues = (checkboxGroups, complianceLimit, defaultCustomerType) => ({
  customerType: defaultCustomerType,
  timeframe: defaultCustomerType === 'MEDICAL' ? 'DAILY' : 'TRANSACTION',
  ...defaultInitialValues,
  ...complianceLimit,
  salesTypes: complianceLimit ?
    allCheckboxValues(checkboxGroups, false, complianceLimit.salesTypes) : undefined,
})

const ComplianceDetailsPure = ({
  onSubmit,
  onCancel,
  salesTypeData: { salesTypes },
  complianceLimitData,
  defaultCustomerType,
  userPermissions,
  deleteCompliance,
  complianceID,
}) => {
  const complianceLimit = get(complianceLimitData, 'complianceLimit')
  const checkboxGroups = salesTypes
  const initialValuesMap = initialValues(checkboxGroups, complianceLimit, defaultCustomerType)
  const numberEachUnitValidators = combineValidators(
    required,
    numberValidator,
    positiveNumber,
    integerValidator,
  )
  const numberOtherUnitValidators = combineValidators(
    required,
    numberValidator,
    positiveNumber,
    floatValidator,
    maxDecimalPlaces(2),
  )

  // alternative to react-final-form's submitting that actually works
  const [submittingHook, setSubmittingHook] = useState(false)

  return (
    <Form
      keepDirtyOnReinitialize
      onSubmit={(values) => {
        onSubmit(values)
        setSubmittingHook(!submittingHook)
      }}
      initialValues={initialValuesMap}
      validate={values => checklistValidator(values.salesTypes)}
      decorators={[focusOnError]}
      render={({ handleSubmit, form, values, errors, pristine, submitting }) => (
        <form onSubmit={handleSubmit}>
          {complianceLimit ?
            <Title>{complianceLimit.name || 'Unnamed Compliance Limit'}</Title>
            :
            <Title>New compliance limit</Title>
          }
          <StyledFormContent>
            <StyledFormColumn>
              <StyledFormGroup>
                <label>Name</label>
                <StyledFormTextField
                  type="text"
                  name="name"
                  placeholder="Flower limit"
                  disabled={!get(userPermissions, 'write', false)}
                  validate={combineValidators(
                      required,
                      sanitizedStringValidator,
                      stringOfMaximumLength(255),
                    )}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Unit</label>
                <FormSelectField
                  name="unit"
                  onChange={() => form.change('limitQuantity', '')}
                  options={Units}
                  disabled={!get(userPermissions, 'write', false)}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Customer Type</label>
                <FormSelectField
                  name="customerType"
                  options={CustomerTypes}
                  disabled
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Timeframe</label>
                <FormSelectField
                  name="timeframe"
                  options={values.customerType === 'MEDICAL' ? TimeframeMedical : TimeframeRecreational}
                  disabled={values.customerType === 'RECREATIONAL' || !get(userPermissions, 'write', false)}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Amount</label>
                <StyledFormTextField
                  name="limitQuantity"
                  placeholder={values.unit === 'EACH' ? '0' : '0.00'}
                  suffix={unitsToSuffixMap[values.unit]}
                  disabled={!get(userPermissions, 'write', false)}
                  validate={values.unit === 'EACH' ? numberEachUnitValidators : numberOtherUnitValidators}
                />
              </StyledFormGroup>
            </StyledFormColumn>
            <StyledFormColumn>
              <CategoriesHeader>
                APPLIES TO:
                <TooltipWithIcon text="Applies to determines if a sales type will contribute to the compliance limit." />
              </CategoriesHeader>
              <NestingCheckboxList
                groups={checkboxGroups}
                changeFormValue={form.change}
                values={values}
                name="salesTypes"
                subItemsName="salesTypes"
                disabled={!get(userPermissions, 'write', false)}
              />
              {errors.checkboxes &&
                <CheckboxesValidationError>{errors.checkboxes}</CheckboxesValidationError>
              }
            </StyledFormColumn>
          </StyledFormContent>
          <FixedFooterContainer
            showDelete={complianceID && get(userPermissions, 'write', false) && !get(complianceLimit, 'archivedDate', false)}
            deleteText="Delete Compliance Limit"
            onDelete={() => deleteCompliance(complianceLimit.id, complianceLimit.name)}
            showCancel
            onCancel={() => { onCancel(pristine) }}
            showSave={get(userPermissions, 'write', false) && !get(complianceLimit, 'archivedDate', false)}
            saveDisabled={!isEmpty(errors) || pristine || submitting || submittingHook}
            saveButtonType="submit"
          />
        </form>
      )
    }
    />
  )
}

ComplianceDetailsPure.propTypes = {
  complianceLimitData: PropTypes.object,
  salesTypeData: salesTypeDataPropTypes,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  defaultCustomerType: CustomerTypePropType,
  userPermissions: UserPermissionsPropType,
  deleteCompliance: PropTypes.func,
  complianceID: PropTypes.string,
}

export default ComplianceDetailsPure

const StyledFormTextField = styled(FormTextField)`
  width: 320px;
`

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
    font-size: 16px;
    color: #5e5e5e;
    max-width: 135px;
    display: inline-block;
  }
`

const CategoriesHeader = styled.div`
  font-weight: bold;
  line-height: normal;
  letter-spacing: 1px;
  color: #8b939e;
  margin-bottom: 14px;
`

const CheckboxesValidationError = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
`
