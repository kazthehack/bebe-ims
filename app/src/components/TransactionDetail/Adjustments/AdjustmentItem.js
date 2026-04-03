/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { toLower, capitalize } from 'lodash'
import { DATE_FORMAT } from 'constants/Settings'
import { truncateStringNumberToFixedDecimals } from 'utils/strings'
import { defaultAdjustment } from '../Data'

const StyledAdjustmentItem = styled.div`
  display: flex;
  margin-bottom: 1px;
  width: 100%;
  min-width: 400px;
  height: 32px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
`

export const defaultHeaders = {
  date: 'Date',
  employeeId: 'Employee',
  type: 'Type',
  totalReturned: 'Total Returned',
  item: 'Item',
}

const StyledText = styled.div`
  width: 20%;
  height: 16px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: ${({ isHeader }) => (isHeader ? '500' : 'normal')};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--brownish-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`

const AdjustmentItem = ({
  date = defaultAdjustment.date,
  // employeeId = adjustment.employeeId,
  employeeName = defaultAdjustment.employeeName,
  type = defaultAdjustment.type,
  totalReturned = defaultAdjustment.totalReturned,
  item = defaultAdjustment.item,
  isHeader = false,
}) => (
  <StyledAdjustmentItem>
    <StyledText isHeader={isHeader}>
      {`${!isHeader ? moment.tz(date, 'America/Los_Angeles').utc().format(DATE_FORMAT) : defaultHeaders.date}`}
    </StyledText>
    <StyledText isHeader={isHeader}>{`${!isHeader ? employeeName : defaultHeaders.employeeId}`}</StyledText>
    <StyledText isHeader={isHeader}>{`${toLower(type).includes('return') ? 'Return' : capitalize(type)}`}</StyledText>
    <StyledText isHeader={isHeader}>{`${!isHeader ? `$${truncateStringNumberToFixedDecimals(totalReturned)}` : defaultHeaders.totalReturned}`}</StyledText>
    <StyledText isHeader={isHeader}>{`${item}`}</StyledText>
  </StyledAdjustmentItem>
)

export default AdjustmentItem
