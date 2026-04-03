/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { truncateStringNumberToFixedDecimals } from 'utils/strings'
import { unitsToSuffixMap } from 'constants/Units'
import DiscountItem from './DiscountItem'
import { defaultSaleItem, defaultDiscount } from '../Data'
import RewardItem from './RewardItem'

export const defaults = {
  name: defaultSaleItem.name,
  amount: defaultSaleItem.amount,
  status: 'sale',
  discounts: [
    defaultDiscount,
  ],
}

const StyledTotalItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1px;
  min-height: 48px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  justify-content: space-between;
  align-items: flex-end;
  padding: 0px 16px;
  background-color: white;
`

const StyledItemsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 11px;
  padding-bottom: 15px;
`

const StyledDiscountItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 95%;
`

const StyledItemStatusText = styled.div`
  width: 75px;
  font-family: Arial;
  font-size: 18px;
  color: #d0021b;
  padding-right: 20px;
`

const StyledItemLabelText = styled.div`
  min-height: 19px;
  font-weight: 300;
  font-size: 16px;
  color: #636363;
  padding-right: 20px;
`

const StyledItemValueText = styled.div`
  font-size: 16px;
  font-family: Roboto;
  font-weight: 500;
  text-align: right;
  color: #636363;
`

const getStatusString = (status = defaults.status, isAlwaysVisible = false) => {
  if (status !== 'sale' && status) {
    return `${status}`.toLowerCase().includes('return') ? 'Returned' : 'Voided'
  }
  return isAlwaysVisible ? status : ''
}

const getUnitSuffix = quantityUnit => (quantityUnit === 'GRAMS' ? unitsToSuffixMap.GRAMS : '')

const TotalItem = ({
  name = defaultSaleItem.name,
  amount = defaultSaleItem.amount,
  status = defaults.status,
  quantitySold = defaultSaleItem.quantitySold,
  quantityUnit = defaultSaleItem.quantityUnit,
  discounts = [],
  rewards = [],
}) => (
  <StyledTotalItem>
    <StyledItemsContainer>
      <StyledItemLabelText>{`${truncateStringNumberToFixedDecimals(quantitySold)}${getUnitSuffix(quantityUnit)} × ${name}`}</StyledItemLabelText>
      <StyledItemStatusText>{getStatusString(status)}</StyledItemStatusText>
      <StyledItemValueText>{truncateStringNumberToFixedDecimals(amount)}</StyledItemValueText>
    </StyledItemsContainer>
    <StyledDiscountItemsContainer>
      {!!discounts.length && discounts.map((v, i) => <DiscountItem key={`${v.name + i}`} {...v} />)}
      {!!rewards.length && rewards.map((v, i) => <RewardItem key={`${v.name + i}`} {...v} />)}
    </StyledDiscountItemsContainer>
  </StyledTotalItem>
)

export default TotalItem
