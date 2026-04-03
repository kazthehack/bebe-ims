//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 03/06/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import React from 'react'
import styled from 'styled-components'
import { Grid } from 'react-styled-flexboxgrid'

const UnstyledGrid = props => <Grid fluid {...props} />

export default styled(UnstyledGrid)`
  margin: 0;
  padding: 0;
`
