import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, TwoLine } from 'components/Table'
import { get } from 'lodash'
import { FormTextField } from 'components/common/input/TextField'
import colors from 'styles/colors'
import { showTwoDecimals } from 'utils/currencyDecimal'
import { displayNonFields, updateRowPrices } from 'utils/priceGroup'
import { unitsToSuffixMap } from 'constants/Units'
import {
  valueGreaterThanMin,
  required,
  combineValidators,
  positiveNumber,
  numberValidator,
  nonRequiredFloat,
  maxDecimalPlaces,
} from 'utils/validators'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import styled from 'styled-components'
import { estimatedTax, estimatedBasePrice, estimatedFinalPrice } from 'constants/TooltipMessages'

const StyledTable = styled(Table)`
  .rt-table {
    overflow: hidden;
  }
`

const constMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med[0]',
  REC: 'customPG.prices.rec[0]',
  TAX: 'tax',
  AMOUNT: 'quantityAmount',
}

const data = [{
  id: 1,
}]

const parse = ({
  value,
  form,
  tax,
  medTax = {},
  table,
  otherField,
  portalMedicalSame = false,
}) => {
  updateRowPrices({
    changeForm: form.change,
    value,
    table,
    constMap,
    recTax: tax,
    medTax, // Will only be used if portalMedicalSame is true
    pricingScheme: otherField === 'pre' ? 'post' : 'pre',
    portalMedicalSame,
  })
  return value
}

const nonCannabisColumns = ({
  values,
  tax,
  medTax,
  form,
  pre,
  table,
  userPermissions,
  archived,
  uneditable,
}) => {
  const isMedical = (table === constMap.MED)
  return ([{
    Header: (
      <>
        <TwoLine top={`${pre ? 'base' : 'estimated '}`} bottom={`${pre ? '' : 'base '} price`} />
        {!pre && <TooltipWithIcon text={estimatedBasePrice} />}
      </>
    ),
    accessor: 'base',
    sortable: false,
    getTdProps: () => ({ style: { paddingRight: '37px', fontWeight: 'bold', fontSize: '16px' } }),
    Cell: () => ( // eslint-disable-line react/prop-types
      <Fragment>
        {pre
          ? (
            <FormTextField
              placeholder="0.00"
              prefix="$"
              disabled={!get(userPermissions, 'write', true) || archived || uneditable}
              parse={value => (
                parse({
                  value,
                  form,
                  tax: isMedical ? medTax : tax,
                  medTax,
                  table,
                  otherField: constMap.POST,
                  portalMedicalSame: isMedical ? false : values.customPG.portalMedicalSame,
                })
              )}
              type="text"
              validate={combineValidators(
                required,
                numberValidator,
                positiveNumber,
                maxDecimalPlaces(2),
              )}
              name={`${table}.${constMap.PRE}`}
              onBlur={(e) => {
                const targetValue = e.target.value
                if (targetValue === '0' || Number(targetValue)) {
                  form.change(`${table}.${constMap.PRE}`, showTwoDecimals(targetValue))
                }
              }}
            />
          )
          : displayNonFields(values, `${table}.${constMap.PRE}`)
        }
      </Fragment>
    ),
  }, {
    Header:
  <Fragment>
    <TwoLine top="estimated" bottom="tax" />
    <TooltipWithIcon text={estimatedTax} />
  </Fragment>,
    accessor: 'estimated',
    sortable: false,
    Cell: () => displayNonFields(values, `${table}.${constMap.TAX}`),
    getTdProps: () => ({ style: { color: colors.blueishGray, fontSize: '16px' } }),
  }, {
    Header: (
      <>
        <TwoLine top={`${pre ? 'estimated' : 'customer '}`} bottom={`${pre ? 'customer' : ' '} pays`} />
        {pre && <TooltipWithIcon text={estimatedFinalPrice} />}
      </>
    ),
    accessor: 'customer',
    sortable: false,
    getTdProps: () => ({ style: { fontWeight: 'bold', paddingRight: '20px', fontSize: '16px' } }),
    Cell: () => (
      <Fragment>
        {pre
          ? displayNonFields(values, `${table}.${constMap.POST}`)
          : (
            <FormTextField
              placeholder="0.00"
              prefix="$"
              disabled={!get(userPermissions, 'write', true) || archived || uneditable}
              validate={combineValidators(
                required,
                numberValidator,
                positiveNumber,
                valueGreaterThanMin(isMedical ? medTax.fixed : tax.fixed, 'Final price must be > fixed tax: $'),
                maxDecimalPlaces(2),
              )}
              parse={value => (
                parse({
                  value,
                  form,
                  tax: isMedical ? medTax : tax,
                  medTax,
                  table,
                  otherField: constMap.PRE,
                  portalMedicalSame: isMedical ? false : values.customPG.portalMedicalSame,
                })
              )}
              type="text"
              name={`${table}.${constMap.POST}`}
              onBlur={(e) => {
                const targetValue = e.target.value
                if (targetValue === '0' || Number(targetValue)) {
                  form.change(`${table}.${constMap.POST}`, showTwoDecimals(targetValue))
                }
              }}
            />
          )
        }
      </Fragment>
    ),
  }])
}

// TODO: proper handling based on unit
// Validator for non-flower cannabis products
const amountValidator = combineValidators(required, positiveNumber, nonRequiredFloat)

const cannabisColumns = ({
  values,
  tax,
  medTax,
  form,
  pre,
  table,
  userPermissions,
  customerType,
  archived,
  uneditable,
}) => ([{
  Header: (
    <Fragment>
      Amount
      <TooltipWithIcon
        text="Amount impacts compliance limits and the quantity removed from a Metrc package that is measured by weight."
        style={{ marginTop: '1px' }}
      />
    </Fragment>
  ),
  accessor: 'amount',
  sortable: false,
  Cell: () => (
    <FormTextField
      suffix={unitsToSuffixMap[get(values, `${table}.quantityUnit`, 'GRAMS')]} // default to grams
      name={`${table}.${constMap.AMOUNT}`}
      onChange={(e) => {
        if (values.customPG.portalMedicalSame) form.change(`${constMap.MED}.${constMap.AMOUNT}`, e.target.value)
      }}
      disabled={
        uneditable
        || !get(userPermissions, 'write', true)
        || (values.combined && values.combinedBreakdownPricing)
        || archived
      }
      validate={
        combineValidators(
          amountValidator,
          maxDecimalPlaces(2),
        )
      }
    />
  ),
}, {
  Header: (
    <Fragment>
      Volume
      <TooltipWithIcon
        text="Volume must be recorded to stay in legal compliance."
        style={{ marginTop: '1px' }}
      />
    </Fragment>
  ),
  accessor: 'volume', // Does not correspond to data
  sortable: false,
  show: values.liquid,
  width: 150,
  Cell: () => (
    <FormTextField
      suffix="fl oz"
      name={`${table}.volumeAmount`}
      disabled={!get(userPermissions, 'write', true) || archived || uneditable}
      validate={combineValidators(
        numberValidator,
        positiveNumber,
        maxDecimalPlaces(2),
      )}
      errorStyle={{ marginLeft: '0' }}
      onChange={(e) => {
        let newVal = e.target.value
        if (customerType === 'MEDICAL') {
          if (e.target.value === '') {
            newVal = undefined // set to undefined so we don't confuse the back-end
            form.change(`${constMap.MED}.volumeAmount`, newVal)
          }
        } else {
          if (e.target.value === '') {
            newVal = undefined // set to undefined so we don't confuse the back-end
            form.change(`${constMap.REC}.volumeAmount`, newVal)
          }
          if (values.customPG.portalMedicalSame || customerType === 'MEDICAL') {
            form.change(`${constMap.MED}.volumeAmount`, newVal)
          }
        }
      }}
    />
  ),
},
// eslint-disable-next-line max-len
...nonCannabisColumns({ values, tax, medTax, form, pre, table, userPermissions, archived, uneditable }),
])

const SingleRowPricingTable = ({
  canna,
  values,
  form,
  pre,
  table,
  userPermissions,
  customerType,
  archived,
  uneditable,
}) => (
  <StyledTable
    data={data}
    columns={canna
      ? cannabisColumns({
        values,
        tax: values.tax.rec,
        medTax: values.tax.med,
        form,
        pre,
        table,
        userPermissions,
        customerType,
        archived,
        uneditable,
      })
      : nonCannabisColumns({
        values,
        tax: (values.tax || { rec: 0 }).rec,
        form,
        pre,
        table,
        userPermissions,
        archived,
        uneditable,
      })
    }
    getTrProps={() => ({ style: { height: 78 } })}
    noHover
  />
)

SingleRowPricingTable.propTypes = {
  canna: PropTypes.bool,
  customerType: PropTypes.string,
  values: PropTypes.object,
  form: PropTypes.object,
  pre: PropTypes.bool,
  table: PropTypes.string,
  userPermissions: PropTypes.object.isRequired,
  archived: PropTypes.bool.isRequired,
  uneditable: PropTypes.bool,
}

export default SingleRowPricingTable
