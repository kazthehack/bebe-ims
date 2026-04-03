//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from 'components/common/display/Icon'
import { Link } from 'react-router-dom'
import colors from 'styles/colors'

const StyledIcon = styled(Icon)`
  padding-top: 1.5px;
  margin-right: 8px;
`

const LinkWrapperDiv = styled.div`
  height: 30px;
  line-height: 30px;
  padding: 9px 0 9px 0;
  margin-left: 32px;
`

const linkStyles = `
  color: ${colors.blue};
  text-decoration: none;
  letter-spacing: 0.5px;
  font-size: 15px;
  :hover {
    text-decoration: underline;
  }
`

const StyledAnchor = styled.a`${linkStyles}`
const StyledLink = styled(Link)`${linkStyles}`

const ButtonRowLink = ({ text, iconName = 'square', to, style, href }) => (
  <LinkWrapperDiv style={style}>
    {
      !href
      ? <StyledLink to={to}><StyledIcon name={iconName} />{text}</StyledLink>
      : <StyledAnchor href={href}><StyledIcon name={iconName} />{text}</StyledAnchor>
    }
  </LinkWrapperDiv>
)

ButtonRowLink.propTypes = {
  text: PropTypes.string,
  iconName: PropTypes.string,
  to: PropTypes.string,
  style: PropTypes.object,
  href: PropTypes.string,
}

export default ButtonRowLink
