import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, StatusColumn, TwoLine } from 'components/Table'
import { get } from 'lodash'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'
import colors from 'styles/colors'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { showTwoDecimals } from 'utils/currencyDecimal'
import { displayNonFields, updateRowPrices } from 'utils/priceGroup'
import scale from 'utils/scalePrice'
import sizeMap from 'constants/priceScale'
import {
  valueGreaterThanMin,
  required,
  combineValidators,
  numberValidator,
  positiveNumber,
  maxDecimalPlaces,
} from 'utils/validators'
import styled from 'styled-components'
import { estimatedTax, estimatedBasePrice, estimatedFinalPrice } from 'constants/TooltipMessages'
import { TooltipWithIcon } from '../common/display'

const constMap = {
  PRE: 'pre',
  POST: 'post',
  MED: 'customPG.prices.med',
  TAX: 'tax',
  ACTIVE: 'portalActive',
}

const StyledTable = styled(Table)`
  .rt-table {
    overflow: hidden;
  }
`

// Called when one row is updated, to check whether the table needs updated.
export const changePriceList = ({
  value,
  changeForm,
  tax,
  medTax,
  table,
  row,
  priceRows,
  pricingScheme, // pre or post tax
  portalMedicalSame,
  deactivated, // is true if the triggering row is inactive
}) => {
  // Update recreational and medical prices with the new entered value
  const newValue = updateRowPrices({
    changeForm,
    value,
    table,
    rowIndex: row,
    constMap,
    recTax: tax,
    medTax,
    pricingScheme,
    portalMedicalSame,
  })
  const isPreTax = pricingScheme === constMap.PRE
  let lowRow
  let lowRowIndex
  let deferred = [] // inactive rows below the first active row
  priceRows.forEach((obj, index) => { // for each row
    let currentRow = false
    if (row === index) { // if this row is the one that was edited
      currentRow = true
    }
    // Is active and both currentRow and deactivated are not true
    if (get(obj, constMap.ACTIVE) && !(currentRow && deactivated)) {
      if (currentRow) { // If is current row, set lowRow with value equal to newValue
        lowRow = isPreTax ? { pre: newValue } : { post: newValue }
      } else { // if not currentRow, set lowRow to currentRow
        lowRow = obj
      }
      lowRowIndex = index
      deferred.forEach((obj1) => { // Calculate rows deferred because they had no low row to base on
        let forwardValue // value to be scaled back to these deferred rows
        if (currentRow) { // If currentRow, set forwardValue to the newValue
          forwardValue = newValue
        } else { // If not currentRow, set forwardValue to the row's price value
          forwardValue = isPreTax ? get(obj, constMap.PRE) : get(obj, constMap.POST)
        }
        const forwardScaled = scale(forwardValue, sizeMap[index].scale, sizeMap[obj1.row].scale)
        // Update recreational and medical prices with the new `forwardScaled` value
        updateRowPrices({
          changeForm,
          value: forwardScaled,
          table,
          rowIndex: obj1.row,
          constMap,
          recTax: tax,
          medTax,
          pricingScheme,
          portalMedicalSame,
        })
      })
      deferred = [] // Empty deferred now that it has been calculated
    } else if (lowRow) { // Is inactive and lowRow was set before
      const lowValue = isPreTax ? get(lowRow, constMap.PRE) : get(lowRow, constMap.POST)
      const scaled = scale(lowValue, sizeMap[lowRowIndex].scale, sizeMap[index].scale)
      // Update recreational and medical prices with the new `scaled` value
      updateRowPrices({
        changeForm,
        value: scaled,
        table,
        rowIndex: index,
        constMap,
        recTax: tax,
        medTax,
        pricingScheme,
        portalMedicalSame,
      })
    } else if (isPreTax) { // Is inactive and lowRow has not been set AND is pre tax
      deferred.push({ row: index, pre: get(obj, constMap.PRE) })
    } else { // Is inactive and lowRow has not been set AND is post tax
      deferred.push({ row: index, post: get(obj, constMap.POST) })
    }
  })
  deferred.forEach((obj) => { // If deferred still has entities, set them undefined
    // Recreational pricing table rows
    changeForm(`${table}[${obj.row}].${constMap.PRE}`, undefined)
    changeForm(`${table}[${obj.row}].${constMap.POST}`, undefined)
    changeForm(`${table}[${obj.row}].${constMap.TAX}`, undefined)

    if (portalMedicalSame) {
      // Medical pricing table rows
      changeForm(`${constMap.MED}[${obj.row}].${constMap.PRE}`, undefined)
      changeForm(`${constMap.MED}[${obj.row}].${constMap.POST}`, undefined)
      changeForm(`${constMap.MED}[${obj.row}].${constMap.TAX}`, undefined)
    }
  })
  return value
}

const columns = ({
  values,
  tax,
  medTax,
  changeForm,
  pre,
  table,
  userPermissions,
  archived,
  portalMedicalSame,
}) => {
  const isMedical = (table === constMap.MED)
  return ([{
    ...StatusColumn,
    Header: 'Active',
    sortable: false,
    Cell: ({ original }) => ( // eslint-disable-line react/prop-types
      <FormToggle
        checkedStatusText=""
        uncheckedStatusText=""
        name={`${table}[${original.size}].${constMap.ACTIVE}`}
        disabled={!get(userPermissions, 'write', true) || archived}
        onChange={() => {
          if (get(values, `${table}[${original.size}].${constMap.ACTIVE}`)) {
            changePriceList({
              value: undefined,
              changeForm,
              tax: isMedical ? medTax : tax, // If this is the medical table, put medTax for tax
              medTax: isMedical ? {} : medTax,
              table,
              row: original.size,
              priceRows: get(values, `${table}`),
              pricingScheme: pre ? constMap.PRE : constMap.POST,
              portalMedicalSame,
              deactivated: true,
            })
          }
        }}
      />
    ),
  }, {
    Header: 'Size',
    accessor: 'size',
    sortable: false,
    getTdProps: () => ({ style: { fontSize: '16px' } }),
    Cell: ({ value }) => sizeMap[value].name,
  }, {
    Header: (
      <>
        <TwoLine top={`${pre ? 'base' : 'estimated '}`} bottom={`${pre ? '' : 'base '} price`} />
        {!pre && <TooltipWithIcon text={estimatedBasePrice} />}
      </>
    ),
    accessor: 'base',
    sortable: false,
    getTdProps: () => ({ style: { paddingRight: '37px', fontWeight: 'bold', fontSize: '16px' } }),
    Cell: ({ original }) => ( // eslint-disable-line react/prop-types
      <Fragment>
        {pre ?
          <FormTextField
            placeholder="0.00"
            prefix="$"
            parse={value =>
              changePriceList({
                value,
                changeForm,
                tax: isMedical ? medTax : tax,
                medTax: isMedical ? {} : medTax,
                table,
                row: original.size,
                priceRows: get(values, `${table}`),
                pricingScheme: constMap.PRE,
                portalMedicalSame,
                deactivated: false,
              })
            }
            type="text"
            name={`${table}[${original.size}].${constMap.PRE}`}
            disabled={!userPermissions.write || !get(values, `${table}[${original.size}].${constMap.ACTIVE}`, false) || archived}
            validate={combineValidators(
              required,
              numberValidator,
              positiveNumber,
              maxDecimalPlaces(2),
            )}
            onBlur={(e) => {
              const targetValue = e.target.value
              if (targetValue === '0' || Number(targetValue)) {
                changeForm(`${table}[${original.size}].${constMap.PRE}`, showTwoDecimals(targetValue))
              }
            }}
          />
          :
          displayNonFields(values, `${table}[${original.size}].${constMap.PRE}`)
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
    Cell: ({ original }) => // eslint-disable-line react/prop-types
      <Fragment>{displayNonFields(values, `${table}[${original.size}].${constMap.TAX}`)}</Fragment>,
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
    Cell: ({ original }) => ( // eslint-disable-line react/prop-types
      <Fragment>
        {pre ?
          displayNonFields(values, `${table}[${original.size}].${constMap.POST}`)
          :
          <FormTextField
            placeholder="0.00"
            prefix="$"
            validate={combineValidators(
              required,
              numberValidator,
              positiveNumber,
              valueGreaterThanMin(isMedical ? medTax.fixed : tax.fixed, 'Final price must be > fixed tax: $'),
              maxDecimalPlaces(2),
            )}
            parse={value =>
              changePriceList({
                value,
                changeForm,
                tax: isMedical ? medTax : tax,
                medTax: isMedical ? {} : medTax,
                table,
                row: original.size,
                priceRows: get(values, `${table}`),
                pricingScheme: constMap.POST,
                portalMedicalSame,
                deactivated: false,
              })
            }
            type="text"
            name={`${table}[${original.size}].${constMap.POST}`}
            disabled={!get(userPermissions, 'write', true) || !get(values, `${table}[${original.size}].${constMap.ACTIVE}`, false) || archived}
            onBlur={(e) => {
              const targetValue = e.target.value
              if (targetValue === '0' || Number(targetValue)) {
                changeForm(`${table}[${original.size}].${constMap.POST}`, showTwoDecimals(targetValue))
              }
            }}
          />
        }
      </Fragment>
    ),
  }])
}

// TODO: data should come from selected pricegroup, not the data from the custom tab
const uneditableColumns = ({ values, table, pre }) => [{
  Header: 'Size',
  accessor: 'size',
  sortable: false,
  getTdProps: () => ({ style: { paddingRight: '37px', fontSize: '16px' } }),
  Cell: ({ value }) => sizeMap[value].name,
}, {
  Header: (
    <>
      <TwoLine top={`${pre ? 'base' : 'estimated '}`} bottom={`${pre ? '' : 'base '} price`} />
      {!pre && <TooltipWithIcon text={estimatedBasePrice} />}
    </>
  ),
  accessor: 'base',
  sortable: false,
  getTdProps: () => ({ style: { paddingRight: '37px', fontSize: '16px' } }),
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    showTwoDecimals(`$${get(values, `${table}[${original.size}].${constMap.PRE}`, '0.00')}`)
  ),
}, {
  Header:
  <Fragment>
    <TwoLine top="estimated" bottom="tax" />
    <TooltipWithIcon text={estimatedTax} />
  </Fragment>,
  accessor: 'estimated',
  sortable: false,
  Cell: ({ original }) => <Fragment>${showTwoDecimals(get(values, `${table}[${original.size}].${constMap.TAX}`, '0.00'))}</Fragment>, // eslint-disable-line react/prop-types
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
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    showTwoDecimals(`$${get(values, `${table}[${original.size}].${constMap.POST}`, '0.00')}`)
  ),
}]

const data = [{
  id: 1,
  size: 0,
}, {
  id: 2,
  size: 1,
}, {
  id: 3,
  size: 2,
}, {
  id: 4,
  size: 3,
}, {
  id: 5,
  size: 4,
}, {
  id: 6,
  size: 5,
}]

const PricingTable = ({
  values,
  tax,
  medTax,
  changeForm,
  pre,
  table,
  uneditable,
  userPermissions,
  archived,
  portalMedicalSame,
}) => (
  <StyledTable
    data={data}
    columns={uneditable ?
      uneditableColumns({ values, table, pre })
      :
      columns({
        values,
        tax,
        medTax,
        changeForm,
        pre,
        table,
        userPermissions,
        archived,
        portalMedicalSame,
      })
    }
    getTrProps={() => ({ style: { height: '78px' } })}
    noHover
  />
)

PricingTable.propTypes = {
  values: PropTypes.object.isRequired,
  tax: PropTypes.object,
  medTax: PropTypes.object.isRequired,
  changeForm: PropTypes.func,
  pre: PropTypes.bool,
  table: PropTypes.string.isRequired,
  uneditable: PropTypes.bool,
  userPermissions: UserPermissionsPropType,
  archived: PropTypes.bool,
  portalMedicalSame: PropTypes.bool,
}

export default PricingTable
