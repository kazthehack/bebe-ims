import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { isEmpty, get } from 'lodash'
import colors from 'styles/colors'

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  position: relative;
  height: 55px;
  color: ${colors.blue};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0;
  text-decoration: none;
  padding: 0 24px;
  text-align: center;
  box-sizing: border-box;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;

  &.active {
    background-color: ${colors.white}; // TODO: does not exist in colors.js, talk with design about this
    font-weight: 500;
    cursor: auto;
    border-left-color: ${colors.grayLight2};
    border-right-color: ${colors.grayLight2};
    position: relative;
    top: 1px;
    border-bottom: 1px solid ${colors.white};
  }
  &.active:first-of-type {
    border-left-color: ${colors.white};
  }

  &.active:before {
    position: absolute;
    top: 0;
    right: -1px;
    content: "";
    display: inline-block;
    width: calc(100% + 2px);
    height: 3px;
    border-radius: 2px 2px 0 0;
    background-color: ${colors.blue};
  }
`

const StyledNavBarHeader = styled.div`
  display: flex;
  margin-bottom: 0px;
  width: 100%;
  border-bottom: 1px solid ${colors.grayLight2};
`

const NavigationBar = ({ links }) => (
  <StyledNavBarHeader>
    {links.map(({ exact, to, content, dynamic, hide }) => (!hide ? (
      <StyledNavLink
        key={to}
        exact={exact}
        to={to}
        activeClassName="active"
        isActive={dynamic ?
          (match, location) => {
            if (isEmpty(get(match, 'params', {})) && (location.pathname === to)) {
              return true
            }
            if (location.pathname.includes(to) && // TODO: fully implement this pattern matching
            dynamic.find(i => i.find(j => location.pathname.includes(j)))) {
              return true
            }
            return false
          }
          : undefined
        }
      >
        {content}
      </StyledNavLink>
    ) : undefined))}
  </StyledNavBarHeader>
)

NavigationBar.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    exact: PropTypes.bool,
    to: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
  })).isRequired,
}

export default NavigationBar
