//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import colors from 'styles/colors'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
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

const MenuItem = ({
  exact,
  to,
  icon,
  label,
  sideNavigationTriggered = () => {},
}) => (
  <div>
    <StyledNavLink
      exact={exact}
      to={to}
      activeStyle={styles.active}
      onClick={() => sideNavigationTriggered(to)}
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
  sideNavigationTriggered: PropTypes.func.isRequired,
}

const ConnectedMenuItem = compose(
  withNavigationState,
)(MenuItem)

const Menu = ({ enableDareMode }) => (
  <div className="sideMenu">
    <ConnectedMenuItem exact to="/daily" label="Home" icon="home" />
    <ConnectedMenuItem to="/web-pos" label="Web POS" icon="cashier" />
    <ConnectedMenuItem to="/sales" label="Sales" icon="reports" />
    <ConnectedMenuItem to="/inventory" label="Inventory" icon="box" />
    <ConnectedMenuItem to="/products" label="Products" icon="plant" />
    <ConnectedMenuItem to="/supplies" label="Supplies" icon="bag" />
    <ConnectedMenuItem to="/sites" label="Sites" icon="home" />
    <ConnectedMenuItem to="/events" label="Events" icon="calendar" />
    <ConnectedMenuItem to="/crm" label="CRM" icon="profile" />
    <ConnectedMenuItem to="/employees" label="Employees" icon="users" />
    <ConnectedMenuItem to="/reports" label="Reports" icon="reports" />
    <ConnectedMenuItem to="/settings" label="Settings" icon="cogs" />
    <VersionBreak />
    <AppVersionContainer>
      <VersionSpan>App Version: {APP_VERSION}</VersionSpan>
    </AppVersionContainer>
  </div>
)

Menu.propTypes = {
  enableDareMode: PropTypes.bool,
}

export default Menu
