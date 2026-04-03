/* eslint-disable no-empty-pattern */
/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import AdjustmentItem, { defaultHeaders } from './AdjustmentItem'
import { defaultValues } from '../Data'

const StyledTitle = styled.div`
  height: 21px;
  font-family: Roboto;
  font-size: 18px;
  color: #000000;
  margin-bottom: 8px;
  padding-top: 30px;
`

const AdjustmentList = ({ adjustments = defaultValues.adjustments }) => (
  <>
    <StyledTitle>{'Transaction Adjustments'}</StyledTitle>
    <AdjustmentItem isHeader {...defaultHeaders} />
    {!!adjustments.length && adjustments.map((v, i) => <AdjustmentItem key={`${v.employeeId + i}`} {...v} />)}
  </>
)

export default AdjustmentList
