/* eslint-disable no-empty-pattern */
/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import { toLower } from 'lodash'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { DATE_TIME_12_FORMAT } from 'constants/Settings'
import { PAYMENT_TYPES } from 'constants/paymentTypes'
import DetailItem from './DetailItem'
import { defaultValues } from '../Data'

const StyledTitle = styled.div`
  height: 21px;
  font-family: Roboto;
  font-size: 18px;
  color: #000000;
  margin-bottom: 8px;
`

const StyledContainer = styled.div`
  display: flex;
  flex: 0 50%;
  flex-direction: column;
`

const DetailList = ({
  receiptId = defaultValues.receiptId,
  saleAt = defaultValues.saleAt,
  paymentType = defaultValues.paymentType,
  terminalName = defaultValues.terminalName,
  employee = defaultValues.employee,
  saleType = defaultValues.saleType,
  storeTimezone,
}) => (
  <StyledContainer>
    <StyledTitle>{'Transaction Details'}</StyledTitle>
    <DetailItem label={'Receipt ID:'} value={receiptId} />
    <DetailItem
      label={'Sale at:'}
      value={
        `${moment.utc(saleAt).tz(storeTimezone).format(DATE_TIME_12_FORMAT)}`
      }
    />
    <DetailItem
      label={'Payment Type:'}
      value={PAYMENT_TYPES[toLower(paymentType)] || paymentType}
    />
    <DetailItem label={'Terminal Name:'} value={terminalName} />
    <DetailItem label={'Employee:'} value={employee} />
    <DetailItem
      label={'Sale Type:'}
      value={
        `${saleType}`[0] ? `${saleType}`[0].toUpperCase()
        + `${saleType}`.slice(1).toLowerCase() : `${saleType}`
      }
    />
  </StyledContainer>
)

export default DetailList
