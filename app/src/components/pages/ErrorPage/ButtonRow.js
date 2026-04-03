//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import ButtonRowLink from './ButtonRowLink'

const NavButtonRow = styled.div`
  display: ${({ nav }) => (nav ? 'flex' : 'inline-flex')};
  flex-direction: ${({ nav }) => (nav ? 'column' : 'row')};
  height: ${({ nav }) => (nav ? 'auto' : '48px')};
  width: ${({ nav }) => (nav ? 'auto' : '682px')};
  margin-right: ${({ nav }) => (nav ? 'auto' : '77px')};
`

const navLinkWrapperStyle = {
  padding: '0',
  margin: '0 0 8px 0',
  display: 'block',
}

const ButtonRow = ({ nav, history, logout }) => (
  <>
    <NavButtonRow nav={nav}>
      <Button white onClick={() => { history.goBack() }} style={nav && { marginBottom: '38px' }}>Back</Button>
    </NavButtonRow>
    <NavButtonRow nav={nav}>
      {!logout
        ? <ButtonRowLink iconName="home5" text="Home Page" to="/" style={nav && navLinkWrapperStyle} />
        : <ButtonRowLink iconName="exit" text="Logout" to="/login" onClick={logout} style={nav && navLinkWrapperStyle} />
      }
    </NavButtonRow>
    {/* TODO: This should be added back and linked to the FAQ page once the page is ready */}
    {false && (
      <NavButtonRow nav={nav}>
        <ButtonRowLink iconName="question-circle" text="FAQ" to="/" style={nav && navLinkWrapperStyle} />
      </NavButtonRow>
    )}
    <NavButtonRow nav={nav}>
      <ButtonRowLink iconName="headset" text="Contact Bloom Support" to="/" style={nav && navLinkWrapperStyle} href="mailto:support@bloomup.co" />
    </NavButtonRow>
  </>
)

ButtonRow.propTypes = {
  nav: PropTypes.bool,
  history: PropTypes.object.isRequired,
  logout: PropTypes.func,
}

export default ButtonRow
