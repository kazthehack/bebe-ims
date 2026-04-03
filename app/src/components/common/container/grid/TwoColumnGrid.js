//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 02/09/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'

import UnstyledGrid from './UnstyledGrid'

const TwoColumnGrid = ({ children }) => (
  <UnstyledGrid>
    <Row>
      {React.Children.map(children, child =>
        child && <Col lg={6} md={6} sm={12} xs={12}>{child}</Col>)
      }
    </Row>
  </UnstyledGrid>
)

TwoColumnGrid.propTypes = {
  children: PropTypes.node,
}

export default TwoColumnGrid
