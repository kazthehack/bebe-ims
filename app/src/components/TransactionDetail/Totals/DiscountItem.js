/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { truncateStringNumberToFixedDecimals } from 'utils/strings'
import { defaultDiscount } from '../Data'

const StyledDiscountItem = styled.div`
  display: flex;
  margin-bottom: 1px;
  width: 100%;
  height: 32px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`

const StyledLabel = styled.div`
  min-width: 50%;
  height: 19px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a90e2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledValue = styled.div`
  min-width: 15%;
  height: 19px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #4a90e2;
`

const DiscountItem = ({
  name = defaultDiscount.name,
  discountName = defaultDiscount.discountName,
  amount = defaultDiscount.amount,
  value = defaultDiscount.value,
  // unitType = defaultData.unitType, // in-case this is needed in the future
}) => {
  const valString = `${(amount || value) || (0).toFixed(2)}`
  return (
    <StyledDiscountItem>
      <StyledLabel>{`${discountName || name}`}</StyledLabel>
      <StyledValue>{`-${truncateStringNumberToFixedDecimals(valString)}`}</StyledValue>
    </StyledDiscountItem>
  )
}

export default DiscountItem
