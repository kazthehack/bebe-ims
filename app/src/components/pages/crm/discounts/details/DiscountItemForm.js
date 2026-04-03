//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import moment from 'moment-timezone'

import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'
import NestingCheckboxList, {
  allCheckboxValues,
  atLeastOneSelected,
} from 'components/common/input/NestingCheckboxList'
import Spinner from 'components/common/display/Spinner'
import Title from 'components/common/display/Title'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import { get, padStart, keyBy, map, size, some } from 'lodash'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { dayLookup, DAYS } from 'utils/dayToWeekMatcher'
import {
  combineValidators,
  required,
  stringOfMaximumLength,
  getUniqueValidator,
  inRange,
  withinRangeValidator,
  positiveNumberValidator,
  numberValidator,
  integerValidator,
  maxDecimalPlaces,
} from 'utils/validators'
import appliesToTypeMap from 'constants/AppliesToTypes'
import amountTypeCategoryMap from 'utils/amountTypeCategoryMapper'
import { salesTypeDataPropTypes } from 'components/SalesTypes'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import DiscountSchedule from './DiscountSchedule'

const StyledFormTextField = styled(FormTextField)`
  width: 320px;
`

const saleTypes = [{
  name: 'Recreational',
  value: 'RECREATIONAL',
}, {
  name: 'Medical',
  value: 'MEDICAL',
}, {
  name: 'Any customer',
  value: 'ANY',
}]

const discountTypes = [{
  name: 'Fixed amount off',
  value: 'amount-fixed',
}, {
  name: 'Fixed percent off',
  value: 'amount-percentage',
}, {
  name: 'Custom amount off',
  value: 'custom-fixed',
}, {
  name: 'Custom percent off',
  value: 'custom-percentage',
}]

const schedulesByDay = (schedules) => {
  if (!schedules) return {}
  const filteredSchedules = schedules.filter(v => v.cronString)
  return keyBy(filteredSchedules, ({ cronString }) => {
    const cs = cronString.split(' ')
    return dayLookup(cs[4])
  })
}

const cronToTimeframe = (cronString, duration, allDay) => {
  if (allDay) {
    return {
      start: '',
      end: '',
    }
  }
  const cs = cronString.split(' ')
  const hours = parseInt(cs[1], 10)
  const minutes = parseInt(cs[0], 10)
  const endHoursPre = Math.floor((duration + minutes) / 60) + hours
  const endMinutesPre = (duration + minutes) % 60
  const endHours = (endHoursPre >= 23) ? 23 : endHoursPre
  const endMinutes = (endMinutesPre >= 59) ? 59 : endMinutesPre
  const start = `${padStart(cs[1], 2, '0')}:${padStart(cs[0], 2, '0')}`
  const end = `${padStart(endHours, 2, '0')}:${padStart(endMinutes, 2, '0')}`
  return {
    start,
    end,
  }
}

const parseSchedule = (schedule) => {
  const scheduleMap = schedulesByDay(schedule)
  const scheduleFormValues = !size(scheduleMap) ? {
    allDaySelected: 'allday',
    start: '',
    end: '',
  } : {
    allDaySelected: schedule[0].allDaySelected ? 'allday' : 'partialday',
    ...cronToTimeframe(schedule[0].cronString, schedule[0].duration, schedule[0].allDaySelected),
  }
  DAYS.map((d) => {
    scheduleFormValues[d] = !!scheduleMap[d]
    return null
  })
  return scheduleFormValues
}

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
  margin-top: 0px;
  margin-bottom: 32px;
  width: 182px;
  label {
    font-size: 16px;
    color: ${colors.grayDark2};
  }
`

const StyledHeader = styled.div`
  font-size: 14px;
  text-transform: capitalize;
  color: ${colors.grayDark2};
  letter-spacing: 1px;
  font-weight: bold;
  margin-top: -60px;
  margin-bottom: 41px;
  margin-left: 5px;
`

const ValidationError = styled.span`
  color: ${colors.red};
  position: absolute;
  font-size: 12px;
`
const CheckboxContainer = styled.div`
  margin-bottom: 32px;
`

const onValidate = ({
  appliesTo,
  salesTypeChecks,
  amount,
  amountType,
  allDaySelected,
  start,
  end,
  enableDareMode,
  ...values
}) => {
  const anyDay = some(DAYS, v => !!values[v])
  const isPartialDay = allDaySelected === 'partialday'
  let endValidate = (anyDay && isPartialDay) ? required(end) : undefined
  let startValidate = (anyDay && isPartialDay) ? required(start) : undefined
  if (start && end && anyDay && isPartialDay) {
    if (!moment(start, 'HH:mm', true).isValid()) {
      startValidate = 'invalid time'
    }
    if (!moment(end, 'HH:mm', true).isValid()) {
      endValidate = 'invalid time'
    }
    const startSplit = start.split(':')
    const startMinutes = (parseInt(startSplit[0], 10) * 60) + parseInt(startSplit[1], 10)
    const endSplit = end.split(':')
    const endMinutes = (parseInt(endSplit[0], 10) * 60) + parseInt(endSplit[1], 10)
    if (startMinutes >= endMinutes) endValidate = 'invalid range'
  }
  return ({
    amount: amountTypeCategoryMap[amountType][1] === 'PERCENTAGE' ?
      inRange(0, 100)(amount) : undefined,
    start: startValidate,
    end: endValidate,
    checkboxes: (appliesTo !== 'ITEM' || enableDareMode ||
      atLeastOneSelected(values.salesTypes)) ? undefined : 'At least one is required',
  })
}

const DiscountItemFormPure = ({
  isNewDiscount,
  salesTypeData,
  className,
  type,
  onSubmit,
  discountData,
  data,
  onCancel,
  deleteDiscount,
  history,
  userPermissions,
  alert,
  venueSettings,
}) => {
  const {
    active,
    amount,
    amountType,
    appliesTo,
    category,
    customerType,
    name,
    requiresApproval,
    schedule,
    salesTypes,
    id,
  } = get(discountData, 'node', {})
  const { enableDareMode } = get(venueSettings, 'store.settings')
  const discounts = get(data, 'store.discounts.edges')
  const discountNames = get(data, 'store') ? map(discounts, ({ node }) => (
    node.name !== name ? node.name : null
  )) : []
  const checkboxGroups = salesTypeData.salesTypes
  let salesTypesMap
  if (type === 'ITEM' || appliesTo === 'ITEM') {
    salesTypesMap = allCheckboxValues(checkboxGroups, false, salesTypes)
  }
  if (enableDareMode && isNewDiscount) {
    salesTypesMap = [allCheckboxValues(checkboxGroups, true, salesTypes).Merchandise]
  }
  const initialValuesMap = {
    active: (isNewDiscount) ? true : active,
    name: name || '',
    customerType: customerType || 'ANY',
    appliesTo: appliesTo || type, // TODO: this is being renamed to salesType?
    amountType: (category && amountType) ? `${category}-${amountType}`.toLowerCase() : 'amount-percentage',
    amount: amount || '',
    requiresApproval: (isNewDiscount) ? true : requiresApproval,
    salesTypes: salesTypesMap,
    ...parseSchedule(schedule),
    enableDareMode,
  }
  return (
    <Form
      keepDirtyOnReinitialize
      onSubmit={onSubmit}
      validate={combineValidators(onValidate)}
      initialValues={initialValuesMap}
      decorators={[focusOnError]}
      render={({ handleSubmit, values, submitting, pristine, form, errors }) => {
        const isPercent = amountTypeCategoryMap[values.amountType][1] === 'PERCENTAGE'
        const isCustom = amountTypeCategoryMap[values.amountType][0] === 'CUSTOM'
        const amountPlaceholder = `${isCustom ? 'Maximum' : ''} ${isPercent ? 'percent off' : 'dollar amount off'}`
        // validators
        const baseValidators = combineValidators(required)
        const percentValidators = combineValidators(
          baseValidators,
          numberValidator,
          withinRangeValidator(1, 99),
          integerValidator,
        )
        const amountValidators = combineValidators(
          baseValidators,
          positiveNumberValidator,
          maxDecimalPlaces(2),
        )
        return (
          <Fragment>
            {submitting && <Spinner wrapStyle={{ position: 'absolute' }} />}
            <form onSubmit={handleSubmit}>
              <div className={className}>
                <Title>{type ? `New ${appliesToTypeMap[type]} Discount` : name}</Title>
                <StyledFormContent>
                  <StyledFormColumn>
                    <ToggleContainer>
                      <label>Active</label>
                      <FormToggle
                        name="active"
                        noStatusText
                        disabled={!userPermissions.write}
                      />
                    </ToggleContainer>
                    <StyledFormGroup>
                      <label>Name</label>
                      <StyledFormTextField
                        type="text"
                        name="name"
                        placeholder="Discount name"
                        validate={combineValidators(
                            required,
                            stringOfMaximumLength(255),
                            getUniqueValidator(discountNames),
                          )}
                        disabled={!userPermissions.write}
                      />
                    </StyledFormGroup>
                    { !enableDareMode &&
                      <StyledFormGroup>
                        <label>Customer type</label>
                        <FormSelectField name="customerType" options={saleTypes} disabled={!userPermissions.write} />
                      </StyledFormGroup>
                    }
                    <StyledFormGroup>
                      <label>Applies to</label>
                      <StyledFormTextField
                        type="text"
                        name="appliesTo"
                        value={appliesToTypeMap[values.appliesTo]}
                        disabled
                      />
                    </StyledFormGroup>
                    <StyledFormGroup>
                      <label>
                        Discount type
                        <TooltipWithIcon text="Discount type can be percentage or amount. The connected value can be fixed or a maximum range." />
                      </label>
                      <FormSelectField
                        name="amountType"
                        options={discountTypes}
                        disabled={!userPermissions.write}
                        onChange={() => {
                          form.change('amount', '')
                        }}
                      />
                    </StyledFormGroup>
                    <StyledFormGroup>
                      <label>
                        {amountTypeCategoryMap[values.amountType][1] === 'PERCENTAGE' ? 'Percent off' : 'Amount off'}
                      </label>
                      <StyledFormTextField
                        name="amount"
                        prefix={isPercent ? undefined : '$'}
                        suffix={isPercent ? '%' : undefined}
                        placeholder={amountPlaceholder}
                        validate={isPercent ? percentValidators : amountValidators}
                        type="text"
                        disabled={!userPermissions.write}
                      />
                    </StyledFormGroup>
                    <CheckboxContainer>
                      <FormCheckbox
                        name="requiresApproval"
                        label="Requires manager approval"
                        tooltip="Requires manager approval if selected."
                        disabled={!userPermissions.write}
                      />
                    </CheckboxContainer>
                    <DiscountSchedule
                      values={values}
                      hidden={isCustom}
                      disabled={!userPermissions.write}
                    />
                  </StyledFormColumn>
                  {((appliesTo === 'ITEM' || values.appliesTo === 'ITEM') && !enableDareMode) &&
                    <StyledFormColumn>
                      <div style={{ marginTop: 70 }} />
                      <StyledHeader>
                        PRODUCTS INCLUDED
                        <TooltipWithIcon text="Products included determines if sales types will have a discount applied." />
                      </StyledHeader>
                      <NestingCheckboxList
                        groups={checkboxGroups}
                        changeFormValue={form.change}
                        values={values}
                        name="salesTypes"
                        subItemsName="salesTypes"
                        disabled={!userPermissions.write}
                      />
                      {errors.checkboxes &&
                        <ValidationError>{errors.checkboxes}</ValidationError>
                      }
                    </StyledFormColumn>
                  }
                </StyledFormContent>
                <FixedFooterContainer
                  showDelete={id && userPermissions.write}
                  deleteText="Delete Discount"
                  onDelete={() => {
                    if (initialValuesMap.active) {
                      alert({
                        title: 'Discount cannot be deleted',
                        message: 'Discounts must be deactivated before they can be deleted.\n\nPlease deactivate the discount, save, and try again.',
                        primaryText: 'OK',
                      })
                      return
                    }
                    deleteDiscount(id, values.name).then((confirmed) => {
                      if (confirmed) history.push('/crm/discounts')
                    })
                  }}
                  showSave={userPermissions.write}
                  saveButtonType="submit"
                  saveDisabled={pristine || submitting}
                  showCancel
                  onCancel={() => onCancel(pristine)}
                />
              </div>
            </form>
          </Fragment>
        )
      }}
    />
  )
}

DiscountItemFormPure.propTypes = {
  isNewDiscount: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['ITEM', 'SUBTOTAL']),
  onSubmit: PropTypes.func,
  data: PropTypes.object,
  discountData: PropTypes.object,
  onCancel: PropTypes.func,
  deleteDiscount: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  salesTypeData: salesTypeDataPropTypes,
  userPermissions: UserPermissionsPropType,
  alert: PropTypes.func,
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default DiscountItemFormPure
