//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 10/2/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import { Grid, Row } from 'react-styled-flexboxgrid'
import Title from 'components/common/display/Title'
import SettingsNavigation from '../SettingsNavigation'
import ConnectedAppsHOC from './ConnectedAppsHOC'

const ConnectedAppsPure = () => (
  <div>
    <Title>Connected Apps</Title>
    <SettingsNavigation />
    <Grid fluid style={{ padding: 0, margin: 0 }}>
      <Row style={{ margin: '48px 0 0 0' }}>
        <ConnectedAppsHOC />
      </Row>
    </Grid>
    <div style={{ clear: 'both' }} />
  </div>
)


export default ConnectedAppsPure
