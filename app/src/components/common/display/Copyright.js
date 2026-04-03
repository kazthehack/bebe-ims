import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'

const linkStyle = {
  textDecoration: 'none',
  color: colors.grayDark2,
}

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
    &copy;{(new Date()).getFullYear()} Bloom All rights reserved
    • <a style={linkStyle} href="https://www.bloomup.co/privacy-policy" rel="noopener noreferrer" target="_blank">Terms of Service</a>
    &nbsp;
    • <a style={linkStyle} href="http://bloomup.co/" rel="noopener noreferrer" target="_blank">bloomup.co</a>
  </Center>
)

Copyright.propTypes = {
  offset: PropTypes.number,
}

export default Copyright
