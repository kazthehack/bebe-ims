//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import DropDownMenu from 'components/common/navigation/DropDownMenu'
import MenuItem from 'components/common/navigation/MenuItem'
import React from 'react'
import styled from 'styled-components'

/* This dropdown menu offsets the dropdown menu and arrow for reuse on Index pages
 * with Tables and TableActionBars -- e.g. Discounts, Taxes, Compliance
 */
export const StyledDropDownMenu = ({ ...props }) => (
  <DropDownMenu
    menuStyle={{ top: 0 }}
    triangleStyle={{ top: -6 }}
    {...props}
  />
)

export const StyledMenuItem = styled(MenuItem)`
  padding-left: 20px;
  justify-content: flex-start;
  padding-left: 20px;
  padding-right: 20px;
`
