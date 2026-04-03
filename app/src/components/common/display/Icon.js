import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const IconSpan = styled.span`
  display: inline-block;
`

const Icon = ({
  name = 'square',
  className = '',
  ...props
}) => (
  <IconSpan className={`icon-${name} ${className}`} {...props} />
)

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
}

export default Icon
