//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 01/24/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import React from 'react'
import styled from 'styled-components'

import Subheader from 'components/common/display/Subheader'

const SectionHeader = styled(Subheader)`
  color: #4d4d4d;
  font-size: 26;
  font-weight: 500;
  border-bottom: 0;
  margin-bottom: 20;
  margin-top: 32px;
  padding-top: 0;
`

export default props =>
  <SectionHeader {...props} />
