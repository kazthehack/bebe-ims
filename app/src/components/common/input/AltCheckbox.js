import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { TooltipWithIcon } from 'components/common/display/Tooltip'

/*
* This is an alternative checkbox to the one in Checkbox.js. It has all the same functionality
* but is much simpler, leveraging the css checked class. There's a slight visual issue with the
* checkbox displaying differently by a pixel here or there in different locations, however.
* TODO: fix visual inconsistencies
*/

const StyledContainer = styled.div`
  position: relative;
  overflow: visible;
  display: table;
  height: auto;
`

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 2px;
  border: ${({ disabled }) => (disabled ? `solid 2px ${colors.grayDark}` : `solid 2px ${colors.grayDark2}`)};
  appearance: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  margin: ${({ boxOnRight }) => (boxOnRight ? '1px 0 0 24px' : '1px 24px 0 0')};
  position: relative;
  transition: all 300ms;
  ::before { /* This is the blue/gray background of the checkbox while checked */
    position: absolute;
    transition: all 300ms;
    content: "";
    width: 18px;
    height: 18px;
    background-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.blue)};
    opacity: 0;
    top: -2px;
    left: -2px;
    border-radius: 2px;
  }
  ::after { /* This is the white checkmark of the checkbox while checked */
    position: absolute;
    transition: all 300ms;
    content: "";
    display: inline-block;
    height: ${({ partial }) => (partial ? '0' : '3px')};
    width: ${({ partial }) => (partial ? '9.5px' : '8px')};
    top: ${({ partial }) => (partial ? '6px' : '3px')};
    left: ${({ partial }) => (partial ? '1px' : '1px')};
    border-left: 2.8px solid ${colors.white};
    border-bottom: 2.8px solid ${colors.white};
    transform: ${({ partial }) => (partial ? 'none' : 'rotate(-45deg)')};
    opacity: 0;
  }
  :checked { /* make the components opaque when checked */
    border-color: ${({ disabled }) => (disabled ? colors.grayDark : colors.blue)};
    ::before {
      opacity: 1;
    }
    ::after {
      opacity: 1;
    }
  }
`

const NewStyledLabel = styled.label`
  display: inline-flex;
  color: ${colors.grayDark2};
  height: 20px;
  line-height: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  vertical-align: -webkit-baseline-middle;
  vertical-align: -moz-middle-with-baseline;
`

const TextDiv = styled.div`
  margin-top: 1px;
`

const Checkbox = ({
  checked,
  partial,
  label,
  boxOnRight,
  labelStyle,
  labelContainerStyle,
  containerStyle,
  disabled,
  tooltip,
  ...props
}) => (
  <StyledContainer style={containerStyle}>
    <NewStyledLabel disabled={disabled} boxOnRight={boxOnRight} style={labelContainerStyle}>
      {boxOnRight &&
        <TextDiv style={labelStyle}>
          {label}
          {tooltip && <TooltipWithIcon text={tooltip} style={{ cursor: 'default' }} />}
        </TextDiv>
      }
      <StyledCheckbox
        type="checkbox"
        partial={partial}
        checked={checked}
        boxOnRight={boxOnRight}
        disabled={disabled}
        {...props}
      />
      {!boxOnRight && <TextDiv style={labelStyle}>{label}</TextDiv>}
    </NewStyledLabel>
    {tooltip && !boxOnRight && <TooltipWithIcon text={tooltip} />}
  </StyledContainer>
)

Checkbox.propTypes = {
  checked: PropTypes.bool,
  partial: PropTypes.bool,
  label: PropTypes.string,
  boxOnRight: PropTypes.bool,
  labelStyle: PropTypes.object,
  labelContainerStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  tooltip: PropTypes.node,
}

export default Checkbox
