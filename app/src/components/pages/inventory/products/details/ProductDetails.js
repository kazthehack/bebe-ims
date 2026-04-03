// Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { noop, isEmpty, get, set, some } from 'lodash'
import colors from 'styles/colors'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import ReactGA from 'react-ga'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { roundToTwoDecimals } from 'utils/currencyDecimal'
import { focusOnError } from 'components/common/form/decorators'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'
import { FormSelectField } from 'components/common/input/SelectField'
import Button from 'components/common/input/Button'
import Title from 'components/common/display/Title'
import Subheader from 'components/common/display/Subheader'
import TagSelect from 'components/common/input/TagSelect'
import TabSwitch from 'components/common/display/TabSwitch'
import { FormTextArea } from 'components/common/input/TextArea'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { initializePriceRows, updateTax, updateValuesOnMedicalSameChecked } from 'utils/priceGroup'
import findTaxes from 'utils/aggregateTaxesForPriceTables'
import {
  combineValidators,
  required,
  sanitizedStringValidator,
  stringOfMaximumLength,
  nonRequiredFloat,
  positiveNumber,
  atLeastOneWithoutError,
  greaterThanOrEqualTo0,
  combineFormValidators,
  numberValidator,
  maxDecimalPlaces,
} from 'utils/validators'
import { Table } from 'components/Table'
import { withModals } from 'components/Modal'
import { salesTypes, salesTypeDataPropTypes } from 'components/SalesTypes'
import { priceGroupsPropType } from 'components/pages/inventory/priceGroups/priceGroupsPropTypes'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import AssignPackageModal from './modals/AssignPackageModal'
import AdjustInventoryModal from './modals/AdjustInventoryModalController'
import PrintBarcodeModal from './modals/PrintBarcodeModal'
import PackageInventoryTable from './PackageInventoryTable'
import NCInventoryTable from './NCInventoryTable'
import { flowerTabs, singleRowTabs } from './PricingTabs'

const flowerConstMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med',
  TAX: 'tax',
  ACTIVE: 'portalActive',
}

const singleRowConstMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med[0]',
  TAX: 'tax',
  AMOUNT: 'quantityAmount',
}

const RowDiv = styled.div`
  height: 40px;
  width: 100%;
  line-height: 40px;
  vertical-align: middle;
  color: ${colors.grayDark2};
  display: flex;
  margin-bottom: 32px;
`

const LabelDiv = styled.div`
  width: 136px;
`

const TextAreaLabelDiv = styled.div`
  width: 100px;
`

const TextAreaContainerDiv = styled.div`
  display: flex;
  width: 420px;
  align-items: flex-start;
  margin-left: 64px;
  justify-content: space-between;

`

const RightDiv = styled.div`
  display: flex;
  width: 205px;
  align-items: center;
  margin-left: 64px;
  justify-content: space-between;
`
const TableDiv = styled.div`
  margin-bottom: 24px;
`

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  width: 182px;
`

const PackageInventorySection = ({ values, form, salesTypeData, pristine, associate }) => (
  <Fragment>
    <TableDiv>
      <PackageInventoryTable
        data={values.copyPackages}
        values={values}
        form={form}
        pristine={pristine}
      />
    </TableDiv>
    <AssignPackageModal
      values={values}
      form={form}
      salesTypeData={salesTypeData}
      onSubmit={associate}
    />
  </Fragment>
)

PackageInventorySection.propTypes = {
  values: PropTypes.object,
  pristine: PropTypes.bool,
  form: PropTypes.object,
  salesTypeData: salesTypeDataPropTypes,
  associate: PropTypes.func,
}

const NCInventorySection = ({ values, form, errors, initialValues }) => (
  <Fragment>
    <TableDiv>
      <NCInventoryTable data={[values.managedInventoryLevels]} />
    </TableDiv>
    <AdjustInventoryModal
      values={values}
      form={form}
      errors={errors}
      initialValues={initialValues}
    />
  </Fragment>
)

NCInventorySection.propTypes = {
  values: PropTypes.object,
  form: PropTypes.object,
  errors: PropTypes.object,
  initialValues: PropTypes.object,
}

// The validation that at least ONE of the combined product amount fields need to pass
const condition = obj => combineValidators(
  required,
  positiveNumber,
  nonRequiredFloat,
)(obj.quantityAmount)

// Form-level validator (runs on every change) to check if condition passes without error for at
// least one of the combined product amount fields.
const combinedAmountFormValidator = (values) => {
  const errors = {}
  if (!values.combined) return errors
  const result = atLeastOneWithoutError(
    values.combinedSalesTypes,
    condition,
    'At least one of these fields must have a positive value',
  )
  if (result) {
    if (!errors.combinedSalesTypes) {
      errors.combinedSalesTypes = [{
        quantityAmount: result,
      }, {
        quantityAmount: result,
      }, {
        quantityAmount: result,
      }]
    } else {
      errors.combinedSalesTypes[0].quantityAmount = result
      errors.combinedSalesTypes[0].quantityAmount = result
      errors.combinedSalesTypes[0].quantityAmount = result
    }
  }
  return errors
}

// Non form level validation for the combined amount fields. They must always pass these conditions.
const combinedAmountValidator = combineValidators(
  numberValidator,
  greaterThanOrEqualTo0,
  nonRequiredFloat,
  maxDecimalPlaces(2),
)

const combinedColumns = (values, form) => [{
  accessor: 'name',
  Header: 'sales category',
}, {
  accessor: 'amount',
  Header: 'amount',
  width: 240,
  getTdProps: () => ({ style: { marginRight: '75px' } }),
  getHeaderProps: () => ({ style: { marginRight: '85px', display: 'flex', justifyContent: 'center' } }),
  Cell: ({ index }) => ( // eslint-disable-line react/prop-types
    <FormTextField
      suffix="g"
      name={`combinedSalesTypes.[${index}].quantityAmount`}
      validate={combinedAmountValidator}
      errorStyle={{ marginLeft: '0' }}
      onChange={(e) => {
        if (values.combinedBreakdownPricing) {
          const sum = values.combinedSalesTypes.reduce((acc, row, i) => {
            let val
            if (index === i) {
              val = e.target.value
            } else {
              val = row.quantityAmount
            }
            if (val === '' || typeof val === 'undefined') {
              val = 0
            }
            return acc + Number(val)
          }, 0)
          if (values.medicalOnly) {
            form.change('customPG.prices.med[0].quantityAmount', roundToTwoDecimals(sum))
          } else {
            form.change('customPG.prices.rec[0].quantityAmount', roundToTwoDecimals(sum))
            form.change('customPG.prices.med[0].quantityAmount', roundToTwoDecimals(sum))
          }
        }
      }}
    />
  ),
}]

const CombinedBreakdown = ({ values, form }) => (
  <div style={{ marginBottom: '24px', position: 'relative' }}>
    <Subheader
      textSizeOption={2}
      color={colors.blueishGray}
    >
      Breakdown
    </Subheader>
    <Table
      data={values.combinedSalesTypes}
      columns={combinedColumns(values, form)}
      noHover
      getTrProps={() => ({ style: { height: '78px' } })}
    />
    <FormCheckbox
      name="combinedBreakdownPricing"
      label="Combine breakdown amounts for pricing"
      tooltip="Combine breakdown amounts for pricing specifies the amount Metrc records per sale for this product."
      containerStyle={{ position: 'absolute', right: 0, bottom: '-48px' }}
      onChange={() => {
        if (!values.combinedBreakdownPricing) {
          const sum = values.combinedSalesTypes.reduce((acc, row) => {
            let val = row.quantityAmount
            if (val === '' || typeof val === 'undefined') {
              val = 0
            }
            return acc + Number(val)
          }, 0)
          if (values.medicalOnly) {
            form.change('customPG.prices.med[0].quantityAmount', roundToTwoDecimals(sum))
          } else {
            form.change('customPG.prices.rec[0].quantityAmount', roundToTwoDecimals(sum))
            form.change('customPG.prices.med[0].quantityAmount', roundToTwoDecimals(sum))
          }
        }
      }}
    />
  </div>
)

CombinedBreakdown.propTypes = {
  values: PropTypes.object,
  form: PropTypes.object,
}

// Helper that checks a price (price cast to a number before being passed)
const checkValidPrice = (price, fixedTax = 0) => (
  (Number.isNaN(price) || price === 0 || price < fixedTax)
)

// Validator to determine that a price group is selected.
const priceGroupSelected = (flower, preScheme) => ({
  selectedPG,
  tax,
  customPG,
  medicalOnly,
}) => {
  const errors = {}
  let isEmptyFlag = false
  if (flower) {
    if (isEmpty(selectedPG)) {
      if (!get(selectedPG, 'shared')) {
        isEmptyFlag = true
      }
    }
    if (!get(selectedPG, 'shared')) {
      get(customPG, 'prices.med', []).forEach(({ pre, post }) => {
        const castPre = Number(pre)
        const castPost = Number(post)
        if (preScheme) {
          if (checkValidPrice(castPre)) {
            isEmptyFlag = true
          }
        } else if (checkValidPrice(castPost, tax.med.fixed)) {
          isEmptyFlag = true
        }
      })
      get(customPG, 'prices.rec', []).forEach((price) => {
        if (!price) {
          return
        }
        const { pre, post } = price
        const castPre = Number(pre)
        const castPost = Number(post)
        if (preScheme) {
          if (checkValidPrice(castPre)) {
            if (!medicalOnly) {
              isEmptyFlag = true
            }
          }
        } else if (checkValidPrice(castPost, tax.rec.fixed)) {
          if (!medicalOnly) {
            isEmptyFlag = true
          }
        }
      })
    }
    if (isEmptyFlag) {
      errors.selectedPG = 'Enter valid prices for the custom price group'
    }
  }
  return errors
}

const combinedStringValidator = combineValidators(
  sanitizedStringValidator,
  stringOfMaximumLength(255),
  required,
)

const notesValidator = combineValidators(
  sanitizedStringValidator,
  stringOfMaximumLength(255),
)

// Help track pristine for fields that FinalForm can't track itself
// Tracks assignedPackages, queuedAdjustment, and selectedPG
const evaluateUntrackedPristine = (canna, flower, priceGroup, {
  packages,
  copyPackages,
  queuedAdjustment,
  selectedPG,
}) => {
  if (canna) {
    if (packages.length !== copyPackages.length) return false
    if (priceGroup && flower && (selectedPG.id !== priceGroup.id)) return false
    return !packages.find(({ id }) => (
      !copyPackages.find(pack => pack.id === id)
    ))
  }
  return !queuedAdjustment
}

const ProductDetails = ({
  product,
  title,
  onSubmit,
  associate,
  edit,
  onCancel,
  userPermissions,
  initialValues,
  typeOptions,
  canna,
  flower,
  preScheme,
  priceGroupList,
  taxList,
  placeholder,
  groupingValue,
  salesTypeData,
  priceGroups,
  initialPriceGroup,
  archiveProduct,
  pushModal,
}) => {
  const archived = !!get(product, 'archivedDate')
  const formValidator = combineFormValidators(
    priceGroupSelected(flower, preScheme),
    combinedAmountFormValidator,
  )
  // Product types that require the combined sales category breakdown
  const combinedSalesTypesProducts = [salesTypes['Combined Category'], salesTypes['Infused Pre-roll']]

  // TODO: add support to change quantityUnit
  const onSelectedFieldChange = ({ e, form, values }) => {
    const newType = typeOptions.find(type => e.target.value === type.id)
    if (combinedSalesTypesProducts.includes(newType.portalTag)) {
      form.change('combined', true)
    } else if (!combinedSalesTypesProducts.includes(newType.portalTag)) {
      form.change('combined', false)
    }
    const newTax = findTaxes(taxList, newType)
    const constMap = flower ? flowerConstMap : singleRowConstMap
    const { medicalOnly, selectedPG: { portalMedicalSame } } = values
    form.change('tax', newTax)
    // Update Recreational prices
    // medicalOnly portalMedicalSame
    // If medical only, only run the medical update
    // if portalMedicalSame, only run recreational one
    // if !portalMedicalSame, and !medicalOnly run both
    if (portalMedicalSame || (!medicalOnly && !portalMedicalSame)) {
      // Update Recreational Price groups
      // ( represents both price groups if portalMedicalSame )
      updateTax({
        changeForm: form.change,
        tax: newTax.rec,
        medTax: newTax.med,
        table: flower ? 'customPG.prices.rec' : 'customPG.prices.rec[0]',
        portalMedicalSame,
        constMap,
        preScheme,
        values,
        flower,
      })
    }
    if (medicalOnly || (!medicalOnly && !portalMedicalSame)) {
    // Update Medical prices
      updateTax({
        changeForm: form.change,
        tax: newTax.med,
        medTax: {},
        table: flower ? 'customPG.prices.med' : 'customPG.prices.med[0]',
        portalMedicalSame,
        constMap,
        preScheme,
        values,
        flower,
      })
    }
    if (canna) {
      form.change('liquid', newType.liquid)
      if (flower) {
        const newPriceGroupList = priceGroups
          .filter(({ node }) => (
            (node.salesType.id === newType.id) && node.shared && node.active
          )).map(({ node }) => initializePriceRows(Object.assign({}, node), newTax))
        priceGroupList.splice(0, priceGroupList.length)
        priceGroupList.push(values.customPG)
        priceGroupList.push(
          ...newPriceGroupList,
        )
        // If any price group that isn't the custom price group is selected, de-select it.
        if (values.selectedPG.id !== '-1') {
          form.change('selectedPG', {})
        }
      }
    }
  }

  const disablePrintButton = (values) => {
    if (canna) {
      return isEmpty(get(values, 'packages'))
    }

    const isMerchandise = get(product, 'salesType.name') === 'Merchandise'
    const hasSomeActivePackage = some(values.assignedPackages, { active: true })
    const noStock = parseInt(get(values, 'managedInventoryLevels.currentStock'), 10) < 0

    return isMerchandise
      ? noStock || !edit
      : noStock || !edit || !hasSomeActivePackage
  }

  const onCheckBoxChange = ({ form, values }) => {
    if (values.medicalOnly) { // medicalOnly is being set to false
      set(values.customPG, 'portalMedicalSame', true)
      updateValuesOnMedicalSameChecked({
        changeForm: form.change,
        values,
        tax: values.tax.med,
        preScheme,
        constMap: flower ? flowerConstMap : singleRowConstMap,
        valuePath: flower ? 'customPG.prices.rec' : 'customPG.prices.rec[0]',
        single: !flower,
      })
    } else { // medicalOnly is being set to true
      set(values.customPG, 'portalMedicalSame', false)
    }
  }

  // alternative to react-final-form's submitting that actually works
  const [submittingHook, setSubmittingHook] = useState(false)

  const getWeightList = (weightData = []) => {
    const weights = []
    weightData.forEach((weight) => {
      let price
      if (preScheme) {
        price = weight.pre
      } else {
        price = weight.post
      }
      if (typeof get(weight, 'price.amount') !== 'undefined') {
        price = weight.price.amount
      }
      weights.push({
        name: get(weight, 'quantityAmount').toString(),
        value: price,
      })
    })
    return weights
  }
  return (
    <Form
      onSubmit={(values) => {
        onSubmit(values, groupingValue)
        setSubmittingHook(!submittingHook)
      }}
      initialValues={initialValues}
      validate={formValidator}
      decorators={[focusOnError]}
      keepDirtyOnReinitialize
      render={({ handleSubmit, form, values, errors, pristine, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Title>{title}</Title>
          <RowDiv>
            <ToggleContainer>
              <LabelDiv>Active</LabelDiv>
              <FormToggle
                name="posActive"
                noStatusText
                disabled={archived}
              />
            </ToggleContainer>
          </RowDiv>
          <RowDiv>
            <LabelDiv>Name</LabelDiv>
            <FormTextField
              name="name"
              type="text"
              placeholder={placeholder}
              validate={combinedStringValidator}
              disabled={!userPermissions.write || archived}
            />
          </RowDiv>
          <RowDiv>
            <LabelDiv>
              Type
              <TooltipWithIcon
                text="Type cannot be edited after product creation. Type affects taxes, discounts, price groups and compliance limits."
                style={{ verticalAlign: 'middle' }}
              />
            </LabelDiv>
            <FormSelectField // This is supposed initialize to be blank. See placeHolder prop
              name="type"
              disabled={edit}
              options={typeOptions}
              onChange={e => onSelectedFieldChange({ e, form, values })}
            />
            <TextAreaContainerDiv>
              <TextAreaLabelDiv>
                Description
              </TextAreaLabelDiv>
              <FormTextArea
                placeholder="Enter info about the product"
                style={{
                  height: '166px',
                  width: '320px',
                  padding: '5px',
                  verticalAlign: 'bottom',
                }}
                name="notes"
                validate={notesValidator}
                errorText
                disabled={!userPermissions.write || archived}
              />
            </TextAreaContainerDiv>
          </RowDiv>
          <RowDiv>
            <LabelDiv>
              Inventory ID
              <TooltipWithIcon
                text="TBD"
                style={{ verticalAlign: 'middle' }}
              />
            </LabelDiv>
            <FormTextField
              name="inventoryId"
              type="text"
              validate={sanitizedStringValidator}
              disabled
            />
          </RowDiv>
          <RowDiv>
            {canna && (
            <FormCheckbox
              name="medicalOnly"
              label="Medical only"
              tooltip="Medical only marks the product for medical patients exclusively. The customer must present a medical card or managers approval is needed for purchase."
              boxOnRight
              labelContainerStyle={{ justifyContent: 'space-between', width: '188px' }}
              onChange={() => onCheckBoxChange({ form, values })}
              disabled={!userPermissions.write || archived}
            />
            )}
            <RightDiv>
              <FormCheckbox
                name="preventDiscount"
                label="Prevent discounts"
                tooltip="No line item discounts will be applied. Product will still be affected by subtotal discounts."
                boxOnRight
                disabled={!userPermissions.write || archived}
              />
            </RightDiv>
          </RowDiv>
          {canna // Hide Tags if product is not a cannabis product
            && false && ( // Hide until Tags are implemented
              <RowDiv>
                <LabelDiv>Tags</LabelDiv>
                <TagSelect
                  tags={['Indica', 'Hybrid', 'Sativa', 'High CBD', 'Example', 'Example']}
                  selections={['Sativa']}
                  onTagClick={noop}
                />
              </RowDiv>
          )}
          {values.combined && <CombinedBreakdown values={values} form={form} />}
          <TabSwitch
            tabs={flower
              ? flowerTabs({
                preScheme,
                form,
                values,
                canna,
                priceGroupList,
                userPermissions,
                archived,
              })
              : singleRowTabs({ preScheme, form, values, canna, userPermissions, archived })
            }
            tooltip="Price groups are defined for multiple products having identical sales type. Products in the same price group use the same price points."
          />
          {/* TODO: this permission check should disable the edit packages button,
            not hide this section */}
          {(userPermissions.write && (edit || canna)) && !archived && (
            <div>
              <Subheader
                textSizeOption={2}
                color={colors.blueishGray}
              >
                {canna ? (
                  <Fragment>
                    PACKAGES
                    <TooltipWithIcon text="Packages are connected to products. You can sell a product from any connected active package." />
                  </Fragment>
                ) : 'CURRENT INVENTORY'}
              </Subheader>
              {canna ? (
                <PackageInventorySection
                  values={values}
                  form={form}
                  salesTypeData={salesTypeData}
                  pristine={pristine
                    && evaluateUntrackedPristine(canna, flower, initialPriceGroup, values)
                  }
                  associate={associate}
                />
              )
                : (
                  <NCInventorySection
                    values={values}
                    form={form}
                    errors={errors}
                    initialValues={initialValues}
                  />
                )}
              <Button
                style={{ marginLeft: '24px' }}
                primary
                onClick={() => {
                  pushModal('PrintBarcodeModal')
                }}
                disabled={disablePrintButton(values)}
              >
                Print QR Label
              </Button>
              <PrintBarcodeModal
                canna={canna}
                flower={flower}
                type={get(product, 'salesType.name')}
                values={values}
                data={values}
                form={form}
                errors={errors}
                submitting={submitting}
                weightList={getWeightList(values.medicalOnly ? get(values, 'selectedPG.prices.med') : get(values, 'selectedPG.prices.rec'))}
                price={get(values, `selectedPG.prices.${values.medicalOnly ? 'med' : 'rec'}[0].${preScheme ? 'pre' : 'post'}`)}
                product={values}
              />
            </div>
          )}
          <FixedFooterContainer
            showSave={userPermissions.write && !archived}
            saveDisabled={
              (submittingHook || submitting) ||
              !!get(errors, 'selectedPG') ||
              (evaluateUntrackedPristine(canna, flower, initialPriceGroup, values) && pristine) ||
              !isEmpty(values.price) ||
              !isEmpty(values.selectedPackage) ||
              !isEmpty(values.barcodes) ||
              typeof values.prepackaged !== 'undefined'
            }
            saveButtonType="submit"
            showDelete={userPermissions.write && edit && !archived}
            onDelete={archiveProduct}
            deleteText="Delete Product"
            showCancel
            onCancel={() => {
              ReactGA.event({
                category: GATypes.eventCategories.product,
                action: GATypes.eventActions.canceled,
                label: groupingValue,
              })
              onCancel(
                pristine
                && evaluateUntrackedPristine(canna, flower, initialPriceGroup, values),
              )
            }}
          />
        </form>
      )}
    />
  )
}

ProductDetails.propTypes = {
  product: PropTypes.object,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  edit: PropTypes.bool,
  onCancel: PropTypes.func,
  userPermissions: UserPermissionsPropType,
  initialValues: PropTypes.object,
  typeOptions: PropTypes.arrayOf(PropTypes.object),
  canna: PropTypes.bool,
  flower: PropTypes.bool,
  preScheme: PropTypes.bool,
  priceGroupList: PropTypes.arrayOf(PropTypes.object),
  taxList: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  groupingValue: PropTypes.string,
  salesTypeData: salesTypeDataPropTypes,
  priceGroups: priceGroupsPropType,
  initialPriceGroup: PropTypes.object,
  archiveProduct: PropTypes.func,
  pushModal: PropTypes.func.isRequired,
  associate: PropTypes.func,
}

export default withModals(ProductDetails)
