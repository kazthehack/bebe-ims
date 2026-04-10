//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import Copyright from 'components/common/display/Copyright'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const MENU_WIDTH = 176
const PAGE_PAD = 64

const StyledContent = styled.div`
  width: 100%;
  ${({ $fullBleed }) => ($fullBleed
    ? css`
      padding-right: 12px;
      padding-left: ${MENU_WIDTH + 12}px;
      padding-bottom: 20px;
    `
    : css`
      padding-right: ${PAGE_PAD}px;
      padding-left: ${MENU_WIDTH + PAGE_PAD}px;
      padding-bottom: 72px;
    `)}

  @media (max-width: 1024px) {
    ${({ $fullBleed }) => ($fullBleed
    ? css`
      padding-left: 170px;
      padding-right: 10px;
      padding-bottom: 20px;
    `
    : css`
      padding-left: 166px;
      padding-right: 20px;
      padding-bottom: 56px;
    `)}
  }

  @media (max-width: 780px) {
    ${({ $fullBleed }) => ($fullBleed
    ? css`
      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 12px;
    `
    : css`
      padding-left: 16px;
      padding-right: 16px;
    `)}
  }
`

const Title = styled.div.attrs({
  className: 'pageTitle',
})`
  color: #4d4d4d;
  padding: 50px 0;
  font: 500 26px 'Roboto', sans-serif;

  @media (max-width: 1024px) {
    padding: 26px 0 18px;
    font: 600 22px 'Roboto', sans-serif;
  }
`

const Foot = styled.div`
  position: absolute;
  bottom: 0;
  width: calc(100% - ${MENU_WIDTH + PAGE_PAD + PAGE_PAD}px)

  @media (max-width: 1024px) {
    width: calc(100% - 186px);
  }

  @media (max-width: 780px) {
    width: calc(100% - 32px);
  }
`

// eslint-disable-next-line react/prop-types
export const StyledFooter = ({ footerOffset }) => (
  <div style={{ left: footerOffset || 0, bottom: 0 }}>
    <Foot>
      <Copyright />
    </Foot>
  </div>
)

const PageContent = ({ title, children, footerOffset, fullBleed }) => (
  <StyledContent $fullBleed={fullBleed}>
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
  fullBleed: PropTypes.bool,
}

export default PageContent
