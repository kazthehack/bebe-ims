//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React, { useState } from 'react'
import colors from 'styles/colors'
import PropTypes from 'prop-types'
import { NavLink, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { APP_VERSION } from 'environment'
import { compose } from 'recompose'
import { withState as withNavigationState } from 'store/modules/navigation'

const styles = {
  active: {
    backgroundColor: colors.trans.white10,
    color: colors.white,
    display: 'block',
    borderLeft: `3px solid ${colors.blue}`,
    boxSizing: 'border-box',
  },
}

const StyledNavLink = styled(NavLink)`
  color: ${colors.blueishGray};
`

const StyledDiv = styled.div`
  width: 100%;
  height: 52px;
  line-height: 52px;
  text-align: center;
  vertical-align: middle;

  @media (max-width: 1024px) {
    height: 44px;
    line-height: 44px;
  }
`

const StyledIcon = styled(ProductIcon)`
  font-size: 17px;
  position: relative;
  top: 2px;
  margin-right: 4px;

  @media (max-width: 1024px) {
    font-size: 15px;
    margin-right: 3px;
  }
`

const AppVersionContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  bottom: 1em;
`

const VersionBreak = styled.hr`
  margin-top: 2em;
  border: 1px solid ${colors.blueishGray};
`

const VersionSpan = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: ${colors.blue};
  font-weight: bold;

  @media (max-width: 1024px) {
    font-size: 11px;
  }
`

const StyledItem = styled.span`
  position: absolute;
  left: 22px;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: bold;

  @media (max-width: 1024px) {
    left: 12px;
    font-size: 11px;
    letter-spacing: 0.4px;
  }
`

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 28, 41, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`

const ConfirmModal = styled.div`
  width: min(420px, 100%);
  background: #ffffff;
  border: 1px solid #cfdbeb;
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(23, 40, 59, 0.24);
  padding: 16px;
`

const ConfirmTitle = styled.div`
  color: #1d3045;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`

const ConfirmText = styled.div`
  color: #4e6379;
  font-size: 14px;
  margin-bottom: 14px;
`

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const ConfirmButton = styled.button`
  border: 1px solid #2c8cff;
  background: #2c8cff;
  color: #fff;
  border-radius: 8px;
  min-height: 38px;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 700;
`

const CancelButton = styled(ConfirmButton)`
  border: 1px solid #c7d5e7;
  background: #ffffff;
  color: #203247;
`

const MenuItem = ({
  exact,
  to,
  icon,
  label,
  onLinkClick,
  sideNavigationTriggered = () => {},
}) => (
  <div>
    <StyledNavLink
      exact={exact}
      to={to}
      activeStyle={styles.active}
      onClick={(event) => {
        if (onLinkClick) {
          onLinkClick(event, to)
          return
        }
        sideNavigationTriggered(to)
      }}
    >
      <StyledDiv>
        <StyledItem>
          <StyledIcon type={icon} />
          {` ${label}`}
        </StyledItem>
      </StyledDiv>
    </StyledNavLink>
  </div>
)

MenuItem.propTypes = {
  exact: PropTypes.bool,
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func,
  sideNavigationTriggered: PropTypes.func.isRequired,
}

const ConnectedMenuItem = compose(
  withNavigationState,
)(MenuItem)

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const resolveLastUpdated = () => {
  const versionDate = formatDate(APP_VERSION)
  if (versionDate) return versionDate
  const browserDate = formatDate(typeof document !== 'undefined' ? document.lastModified : '')
  if (browserDate) return browserDate
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const Menu = ({ enableDareMode }) => {
  const [showPosConfirm, setShowPosConfirm] = useState(false)
  const history = useHistory()

  const handleLinkClick = (event, to) => {
    if (to !== '/web-pos') return
    event.preventDefault()
    setShowPosConfirm(true)
  }

  const confirmEnterPos = () => {
    setShowPosConfirm(false)
    history.push('/web-pos')
  }

  return (
    <div className="sideMenu">
      {showPosConfirm && (
        <ConfirmOverlay>
          <ConfirmModal>
            <ConfirmTitle>POS Mode</ConfirmTitle>
            <ConfirmText>You are now switching into POS mode.</ConfirmText>
            <ConfirmActions>
              <CancelButton type="button" onClick={() => setShowPosConfirm(false)}>Cancel</CancelButton>
              <ConfirmButton type="button" onClick={confirmEnterPos}>Continue</ConfirmButton>
            </ConfirmActions>
          </ConfirmModal>
        </ConfirmOverlay>
      )}
      <ConnectedMenuItem exact to="/daily" label="Home" icon="home" />
      <ConnectedMenuItem to="/web-pos" label="Web POS" icon="cashier" onLinkClick={handleLinkClick} />
      <ConnectedMenuItem to="/sales" label="Sales" icon="reports" />
      <ConnectedMenuItem to="/inventory" label="Inventory" icon="box" />
      <ConnectedMenuItem to="/products" label="Products" icon="plant" />
      <ConnectedMenuItem to="/supplies" label="Supplies" icon="bag" />
      <ConnectedMenuItem to="/sites" label="Sites" icon="home" />
      <ConnectedMenuItem to="/events" label="Events" icon="calendar" />
      <ConnectedMenuItem to="/crm" label="PARTNERS" icon="profile" />
      <VersionBreak />
      <AppVersionContainer>
        <VersionSpan>Last Updated: {resolveLastUpdated()}</VersionSpan>
      </AppVersionContainer>
    </div>
  )
}

Menu.propTypes = {
  enableDareMode: PropTypes.bool,
}

export default Menu
