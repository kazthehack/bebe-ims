import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'

// TODO: Add animations to fade in and out
const DropDown = styled.div`
  background-color: ${colors.trans.gray72};
  position: absolute;
  border-radius: 8px;
  color: ${colors.white};
  z-index: 100;
  top: 6px;
  padding: 24px 0 8px 0;
  min-width: 210px;
`

const Triangle = styled.div`
  position: absolute;
  height: 0;
  width: 0;
  border-left: 6px solid transparent;
  border-right:  6px solid transparent;
  border-bottom: 6px solid ${colors.trans.gray72};
  left: 98px;
`

const MenuDiv = styled.div`
  position: absolute;
  margin-top: 55px;
  outline: none;
`

const ButtonDiv = styled.div`
  display: inline-flex;
  margin-left: 10px;
`

/**
 * DropDownMenu component. Accepts a render prop which acts as the clickable item to show the menu,
 * and accepts a children prop that renders as the menu items. Uses a ref to close if the user
 * clicks outside the menu while it is open.
 */
class DropDownMenu extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      menuDisplay: false,
    }
    this.buttonClicked = this.buttonClicked.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.menuDisplayed !== this.props.menuDisplayed && !this.props.menuDisplayed) {
      this.hideMenu()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.props.resetNotifications && this.state.menuDisplay) {
        // Reset the notifications dropdown to the first 9 and start the polling again
        this.props.resetNotifications()
      }
      this.hideMenu()
      if (this.props.onClickOutside) {
        this.props.onClickOutside()
      }
    }
  }

  buttonClicked = () => {
    if (this.props.resetNotifications && this.state.menuDisplay) {
      // Reset the notifications dropdown to the first 9 and start the polling again
      this.props.resetNotifications()
    }
    this.setState({ menuDisplay: !this.state.menuDisplay })
  }

  hideMenu = () => {
    this.setState({ menuDisplay: false })
  }


  render() {
    return (
      <ButtonDiv ref={this.setWrapperRef}>
        <div>{this.props.render(this.buttonClicked)}</div>
        <Menu
          display={this.state.menuDisplay}
          menuStyle={this.props.menuStyle}
          triangleStyle={this.props.triangleStyle}
        >
          {this.props.children}
        </Menu>
      </ButtonDiv>
    )
  }
}

DropDownMenu.propTypes = {
  render: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  menuStyle: PropTypes.object,
  triangleStyle: PropTypes.object,
  resetNotifications: PropTypes.func,
  menuDisplayed: PropTypes.bool,
  onClickOutside: PropTypes.func,
}

const Menu = ({ display, children, menuStyle, triangleStyle }) => (
  display ? (
    <MenuDiv>
      <Triangle style={triangleStyle} />
      <DropDown style={menuStyle} >
        {children}
      </DropDown>
    </MenuDiv>
  ) :
    null
)

Menu.propTypes = {
  display: PropTypes.bool,
  children: PropTypes.node.isRequired,
  menuStyle: PropTypes.object,
  triangleStyle: PropTypes.object,
}

export default DropDownMenu
