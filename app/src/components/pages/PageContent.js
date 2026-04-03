//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import Copyright from 'components/common/display/Copyright'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const MENU_WIDTH = 176
const PAGE_PAD = 64

const StyledContent = styled.div`
  width: 100%;
  padding-right: ${PAGE_PAD}px;
  padding-left: ${MENU_WIDTH + PAGE_PAD}px;
  padding-bottom: 72px;
`

const Title = styled.div.attrs({
  className: 'pageTitle',
})`
  color: #4d4d4d;
  padding: 50px 0;
  font: 500 26px 'Roboto', sans-serif;
`

const Foot = styled.div`
  position: absolute;
  bottom: 0;
  width: calc(100% - ${MENU_WIDTH + PAGE_PAD + PAGE_PAD}px)
`

// eslint-disable-next-line react/prop-types
export const StyledFooter = ({ footerOffset }) => (
  <div style={{ left: footerOffset || 0, bottom: 0 }}>
    <Foot>
      <Copyright />
    </Foot>
  </div>
)

const PageContent = ({ title, children, footerOffset }) => (
  <StyledContent>
    {title && <Title>{title}</Title>}
    <div style={{ position: 'relative' }}>
      {children}
    </div>
    <StyledFooter footerOffset={footerOffset} />
  </StyledContent>
)

PageContent.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  footerOffset: PropTypes.number,
}

export default PageContent
