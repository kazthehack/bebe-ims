import React from 'react'

import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import styled from 'styled-components'

const StyledGrid = styled(Grid)`
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10;
  padding-top: 1.6rem;
  padding-bottom: 1.6rem;
  margin-bottom: 1.6rem;
  margin-top: 0;
`

const WellTitle = styled(Subheader)`
  line-height: inherit;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 1.6rem;
`

const Well = ({ title, children, style, className }) => (
  <StyledGrid fluid style={style} className={className}>
    <Row>
      <WellTitle>{title}</WellTitle>
      <Col xs={12} sm={12} md={12} lg={12}>
        {children}
      </Col>
    </Row>
  </StyledGrid>
)

Well.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
}

Well.defaultProps = {
  style: {},
}

export default Well
