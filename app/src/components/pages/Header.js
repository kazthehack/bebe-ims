//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import styled from 'styled-components'
import UserSection from 'components/common/display/UserSection'
import logo from 'assets/logo-dashboard-cropped.png'
import colors from 'styles/colors'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import ShareStoreModal from './ShareStore'

const StyledHeaderContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1400;
  background: linear-gradient(90deg, #14263f 0%, ${colors.blueDark} 55%, #29496f 100%);
  color: ${colors.white};
  width: 100%;
  height: 100px;
  border-bottom: 0;
  box-shadow: rgba(0, 0, 0, 0.28) 0px 3px 12px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;

  @media (max-width: 1024px) {
    height: 78px;
    font-size: 12px;
  }
`

const StyledLeftContainer = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 5px;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 4px;
  }
`

const StyledLogo = styled.img`
  height: 96px;
  width: auto;
  display: block;
  margin: 0;

  @media (max-width: 1024px) {
    height: 70px;
  }
`
const StyledRightContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  @media (max-width: 1024px) {
    padding: 4px 8px 4px 4px;
  }
`

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notificationsOpen: false }
  }

  // This is not used anymore so probably can be removed
  toggleNotifications = () => this.setState({ notificationsOpen: !this.state.notificationsOpen })

  render() {
    return (
      <StyledHeaderContainer>
        <StyledLeftContainer>
          <StyledLogo src={logo} alt="Bebe Inventory" />
        </StyledLeftContainer>
        <StyledRightContainer>
          { APP_ENABLE_PUBLIC_DEMO_MODE && <ShareStoreModal /> }
          <UserSection />
        </StyledRightContainer>
      </StyledHeaderContainer>
    )
  }
}

export default Header
