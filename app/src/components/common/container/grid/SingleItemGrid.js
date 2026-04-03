//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 02/08/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'

import UnstyledGrid from './UnstyledGrid'

const SingleItemGrid = ({ children }) => (
  <UnstyledGrid>
    <Row>
      <Col lg={12} md={12} sm={12} xs={12}>
        {children}
      </Col>
    </Row>
  </UnstyledGrid>
)

SingleItemGrid.propTypes = {
  children: PropTypes.node,
}

export default SingleItemGrid
