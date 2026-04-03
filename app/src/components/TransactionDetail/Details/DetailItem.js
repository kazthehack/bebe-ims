/* eslint-disable react/prop-types */
//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'

export const defaultData = {
  label: '',
  value: '', // could be anything
}

const StyledDetailItem = styled.div`
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

const StyledLabel = styled.div`
  height: 16px;
  font-size: 14px;
  font-family: Roboto;
  color: var(--brownish-grey);
  white-space: nowrap;
  overflow: hidden;
`

const StyledValue = styled.div`
  height: 16px;
  font-size: 14px;
  font-family: Roboto;
  color: var(--brownish-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DetailItem = ({
  label = defaultData.label,
  value = defaultData.value,
}) => (
  <StyledDetailItem>
    <StyledLabel>{`${label || 'Unknown Item'}`}</StyledLabel>
    <StyledValue>{`${value}`}</StyledValue>
  </StyledDetailItem>
)

export default DetailItem
