/* eslint-disable no-empty-pattern */
/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { truncateStringNumberToFixedDecimals } from 'utils/strings'
import TotalItem from './TotalItem'
import { defaultValues } from '../Data'

const StyledTotalList = styled.div`
  height: 100%;
`

const StyledSummary = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  justify-content: flex-end;
  align-items: center;
  background-color: white;
`

const StyledSummaryItem = styled.div`
  display: flex;
  width: calc(100% - 30px);
  height: 32px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
`

const StyledSummaryItemLabelBig = styled.div`
  width: 288px;
  height: 25px;
  font-family: Roboto;
  font-weight: bold;
  font-size: 22px;
  color: #636363;
`

const StyledSummaryItemValueBig = styled.div`
  width: 90px;
  height: 25px;
  font-family: Roboto;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #636363;
`

const StyledSummaryItemLabelSmall = styled.div`
  height: 19px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #636363;
`

const StyledSummaryItemValueSmall = styled.div`
  height: 19px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #636363;
`

const TotalList = ({
  saleItems = defaultValues.saleItems,
  subTotal = defaultValues.subTotal,
  tax = defaultValues.tax,
  total = defaultValues.total,
  tendered = defaultValues.tendered,
}) => {
  // TODO: There are more stuff in portal that doesn't do this, keep an eye out.
  const subTotalString = `${subTotal || (0).toFixed(2)}`
  const formattedSubTotal = truncateStringNumberToFixedDecimals(subTotalString)
  const taxString = `${tax || (0).toFixed(2)}`
  const formattedTax = truncateStringNumberToFixedDecimals(taxString)
  const totalString = `${total ? `${total}` : total}`
  const formattedTotal = truncateStringNumberToFixedDecimals(totalString)
  const tenderedString = `${tendered || (0).toFixed(2)}`
  const formattedTendered = truncateStringNumberToFixedDecimals(tenderedString)

  return (
    <StyledTotalList>
      {!!saleItems.length && saleItems.map((v, i) =>
        <TotalItem key={`TotalItem:${v.name + i}`} {...v} />)
      }
      <StyledSummary>
        <StyledSummaryItem>
          <StyledSummaryItemLabelSmall>{'Subtotal'}</StyledSummaryItemLabelSmall>
          <StyledSummaryItemValueBig>{formattedSubTotal}</StyledSummaryItemValueBig>
        </StyledSummaryItem>
        <StyledSummaryItem>
          <StyledSummaryItemLabelSmall>{'+ Tax'}</StyledSummaryItemLabelSmall>
          <StyledSummaryItemValueSmall>{formattedTax}</StyledSummaryItemValueSmall>
        </StyledSummaryItem>
        <StyledSummaryItem>
          <StyledSummaryItemLabelBig>{'Total'}</StyledSummaryItemLabelBig>
          <StyledSummaryItemValueBig>{formattedTotal}</StyledSummaryItemValueBig>
        </StyledSummaryItem>
        <StyledSummaryItem>
          <StyledSummaryItemLabelBig>{'Tendered'}</StyledSummaryItemLabelBig>
          <StyledSummaryItemValueBig>{formattedTendered}</StyledSummaryItemValueBig>
        </StyledSummaryItem>
      </StyledSummary>
    </StyledTotalList>
  )
}

export default TotalList
