import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'

const Center = styled.div`
  text-align: center;
  color: ${colors.grayDark2};
  letter-spacing: 0.9px;
  font-size: 11px;
  padding-bottom: 8px;
  font-weight: 300;
`

const Copyright = ({ offset }) => (
  <Center offset={offset}>
    &copy; {(new Date()).getFullYear()} BEBE Inventory. All rights reserved
    {' • Terms of Service'}
  </Center>
)

Copyright.propTypes = {
  offset: PropTypes.number,
}

export default Copyright
