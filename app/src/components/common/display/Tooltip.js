//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TooltipSymbol from 'components/common/display/TooltipSymbol'
import 'react-tippy/dist/tippy.css'
import { Tooltip as TippyTt } from 'react-tippy'

const SpacerSpan = styled.div`
  margin: 3px 8px;
  display: inherit;
`

const StyledDiv = styled.div`
  text-align: left;
`

export const TooltipWithIcon = ({ text, iconColor, style, icon, ...props }) => (
  <TippyTt
    html={(<StyledDiv>{text}</StyledDiv>)}
    style={{ verticalAlign: 'middle' }}
    {...props}
  >
    <SpacerSpan style={style}><TooltipSymbol color={iconColor} icon={icon} /></SpacerSpan>
  </TippyTt>
)

TooltipWithIcon.defaultProps = {
  theme: 'light',
  position: 'top',
  trigger: 'mouseenter',
  arrow: true,
}

TooltipWithIcon.propTypes = {
  text: PropTypes.node,
  theme: PropTypes.string,
  position: PropTypes.string,
  trigger: PropTypes.string,
  arrow: PropTypes.bool,
  iconColor: PropTypes.string,
  style: PropTypes.object,
  icon: PropTypes.string,
}

export const Tooltip = ({ text, showTooltip, ...props }) => (
  <TippyTt
    html={(<StyledDiv>{text}</StyledDiv>)}
    disabled={!showTooltip || !text}
    {...props}
  />
)

Tooltip.defaultProps = {
  theme: 'light',
  position: 'top',
  trigger: 'mouseenter',
  arrow: true,
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  theme: PropTypes.string,
  position: PropTypes.string,
  trigger: PropTypes.string,
  arrow: PropTypes.bool,
  showTooltip: PropTypes.bool,
}
