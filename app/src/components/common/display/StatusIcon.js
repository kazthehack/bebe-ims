//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 02/08/2017
//  @author: Forest Belton <forest@firstfoundry.co>

import React from 'react'
import styled from 'styled-components'

const StatusIcon = styled(({ active, ...props }) => <div {...props} />)`
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background-color: ${props => (props.active ? '#18f086' : '#ff6666')};
`

export default StatusIcon
