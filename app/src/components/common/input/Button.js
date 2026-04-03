import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
/* eslint no-confusing-arrow: 0 */

const StyledButton = styled.button`
  height: 48px;
  width: 208px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: solid 1px ${colors.grayLight2};
  background-color: ${colors.grayLight2};
  text-transform: uppercase;
  transition: all 0.3s;
  outline: none;
  box-shadow: 0 2px 10px 0 ${colors.trans.black10}, 0 2px 4px 0 ${colors.trans.black20};
  padding: 1px 7px 0px 7px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  :hover, :focus{
    box-shadow: ${props => (props.disabled ?
    `0 2px 10px 0 ${colors.trans.black10},
     0 2px 4px 0 ${colors.trans.black20}` :
    `0 2px 10px 0 ${colors.trans.black10},
     0 5px 20px -1px ${colors.trans.black20}`)};
  }
  :active{
    box-shadow: inset 0 5px 20px -1px ${colors.trans.black20};
  }
`

const Primary = styled(StyledButton)`
  border-radius: 2px;
  background-color: ${props => props.disabled ? colors.trans.blue30 : colors.blue};
  color: ${colors.white};
  border: ${props => props.disabled ? 'none' : `solid 1px ${colors.blue}`};
  :active{
    background-color: ${colors.trans.blue70};
  }
  :hover{

  }
`

const PlainDelete = styled.button`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 1px 0px 1px 0px;
  color: ${colors.red};
  box-shadow: 0 0px 0px 0;
  border none;
  outline: none;
  background-color: rgba(0,0,0,0);
  :active{
    color: #ff2222;
    letter-spacing: 0.8px;
  }
  :hover{
    color: #ff2222;
    letter-spacing: 0.8px;
  }
`

const White = styled(StyledButton)`
  background-color: ${colors.white};
  border: ${props => props.disabled ? `solid 2px ${colors.trans.blue30}` : `solid 2px ${colors.blue}`};
  color: ${props => props.disabled ? colors.trans.blue30 : colors.blue};
  box-shadow: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  :active{
    color: ${colors.gray};
    border: solid 2px ${colors.gray};
  }
  :hover{
    box-shadow: ${props => props.disabled ? 'none' : ''};
  }
`

const Link = styled(StyledButton)`
  color: ${props => props.disabled ? colors.trans.blue30 : colors.blue};
  border: none;
  background-color: transparent;
  box-shadow: none;
  :hover{
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    text-decoration: ${props => props.disabled ? 'none' : 'underline'};
    box-shadow: none;
  }
`

/**
 * A Button component to be reused throughout the app. Props:
 * primary, white - determines the style of the button. Cannot have both. Having neither will result
 *  in a grey default button.
 * disabled - disables the button. Default buttons cannot be disabled.
 * style - styles to override the defaults.
 * children - interior html displayed in the button.
 * onClick - onClick function to execute for the button.
 *648->Button has a link style in addition to primary and white
 */
const Button = ({ primary, plainDelete, children, white, link, ...props }) => {
  if (primary) {
    return (<Primary {...props}>{children}</Primary>)
  } else if (plainDelete) {
    return (<PlainDelete {...props}>{children}</PlainDelete>)
  } else if (white) {
    return (<White {...props}>{children}</White>)
  } else if (link) {
    return (<Link {...props}>{children}</Link>)
  }
  return (<StyledButton {...props}>{children}</StyledButton>)
}

Button.propTypes = {
  primary: PropTypes.bool,
  plainDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  white: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
}

Button.defaultProps = {
  type: 'button',
}

export default Button
