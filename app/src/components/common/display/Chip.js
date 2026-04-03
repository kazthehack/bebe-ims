import React from 'react'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import styled from 'styled-components'

const StyledContainer = styled.div`
  color: ${colors.gray};
  background-color: ${props => (props.active ? props.color || colors.blue : colors.white)};
  cursor: pointer;
  display: inline-block;
  margin-right: 10px;
  margin-top: 9px;
  position: relative;
  width: fit-content;
  border-radius: 4px;
  border: 1px solid ${colors.blueishGray};
  font-weight: normal;
`

const StyledLabel = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 11px;
  line-height: 11px;
  text-align: center;
  user-select: none;
  color: ${props => (props.active ? colors.white : colors.gray)};
`

const Chip = ({ active, onClick, children, className, color, style }) => (
  <StyledContainer
    onClick={onClick}
    className={className}
    active={active}
    color={color}
    style={style}
  >
    <StyledLabel active={active}>
      {children}
    </StyledLabel>
  </StyledContainer>
)

Chip.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

Chip.defaultProps = {
  children: {},
}

export default Chip
