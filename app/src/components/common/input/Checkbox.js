import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import AltCheckbox from 'components/common/input/AltCheckbox'
import colors from 'styles/colors'
/* eslint no-confusing-arrow: 0 */

const StyledContainer = styled.div`
  cursor: pointer;
  position: relative;
  overflow: visible;
  display: table;
  height: auto;
  width: min-content;
`

const StyledInput = styled.input`
  position: absolute;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'inherit')};
  pointer-events: all;
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  left: 0px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
`

const StyledFlexDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const StyledDiv = styled.div`
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  float: left;
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 24px;
  float: ${props => props.boxOnRight ? 'right' : 'left'};
  margin-right: ${props => props.boxOnRight ? '0px' : '16px'};
  margin-left: ${props => props.boxOnRight ? '16px' : '0px'};
  height: 24px;
`

const StyledCheckmarkSVG = styled.svg`
  display: inline-block;
  color: ${colors.gray};
  fill: ${props => props.disabled ? colors.grayDark : colors.blue};
  height: 24px;
  width: 24px;
  user-select: none;
  transition: opacity ${({ show }) => show ? '0ms' : '450ms'} cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform ${({ show }) => show ? '800ms' : '0ms'} cubic-bezier(0.23, 1, 0.32, 1) ${({ show }) => show ? '0ms' : '450ms'};
  position: absolute;
  opacity: ${({ show }) => show ? 1 : 0};
  transform: scale(${({ show }) => show ? 1 : 0});
`

const StyledBorderSVG = styled.svg`
  display: inline-block;
  fill: ${({ disabled }) => (disabled ? colors.grayDark : colors.grayDark2)};
  height: 24px;
  width: 24px;
  user-select: none;
  transition: opacity ${({ show }) => show ? '1000ms' : '650ms'} cubic-bezier(0.23, 1, 0.32, 1) ${({ show }) => show ? '200ms' : '150ms'};
  position: absolute;
  opacity: ${({ show }) => show ? 1 : 0};
`

const StyledLabel = styled.label`
  float: ${props => props.boxOnRight ? 'left' : 'right'};
  position: relative;
  display: block;
  width: 100%;
  line-height: 24px;
  color: ${colors.grayDark2};
  font-family: Roboto, sans-serif;
  text-align: ${props => props.boxOnRight ? 'right' : 'left'};
`

const DashedBox = styled.div`
  margin: 3px;
  width: 18px;
  height: 18px;
  background-color: ${props => props.disabled ? colors.grayDark : colors.blue};
  border-radius: 2px;
  transform: scale(${({ show }) => show ? 1 : 0});
  opacity: ${({ show }) => show ? 1 : 0};
  transition: opacity ${({ show }) => show ? '0ms' : '450ms'} cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform ${({ show }) => show ? '800ms' : '0ms'} cubic-bezier(0.23, 1, 0.32, 1) ${({ show }) => show ? '0ms' : '450ms'};
  display: flex;
  align-items: center;
  justify-content:center;
`

const Dash = styled.div`
  width: 12px;
  height: 2.7px;
  background-color: ${colors.white};
`

const BORDER_SVG = 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'
const CHECKMARK_SVG = 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'

// TODO: Fix this component so it works without being controlled.
const Checkbox = ({
  checked,
  partiallyChecked,
  label,
  boxOnRight,
  labelStyle,
  containerStyle,
  ...props
}) => {
  const fullyChecked = checked && !partiallyChecked
  const atAllChecked = checked || !!partiallyChecked
  return (
    <StyledContainer style={containerStyle}>
      <StyledInput
        type="checkbox"
        checked={atAllChecked}
        {...props}
      />
      <StyledFlexDiv>
        {boxOnRight ?
          <StyledLabel boxOnRight style={labelStyle}>
            {label}
          </StyledLabel> :
          null
        }
        <StyledDiv boxOnRight={boxOnRight}>
          <StyledBorderSVG
            viewBox="0 0 24 24"
            show={!atAllChecked}
            {...props}
          >
            <path d={BORDER_SVG} />
          </StyledBorderSVG>
          <StyledCheckmarkSVG
            viewBox="0 0 24 24"
            show={fullyChecked}
            {...props}
          >
            <path d={CHECKMARK_SVG} />
          </StyledCheckmarkSVG>
          <DashedBox
            show={partiallyChecked}
            {...props}
          >
            <Dash />
          </DashedBox>
        </StyledDiv>
        {boxOnRight ?
          null :
          <StyledLabel style={labelStyle}>
            {label}
          </StyledLabel>
        }
      </StyledFlexDiv>
    </StyledContainer>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  partiallyChecked: PropTypes.bool,
  label: PropTypes.string,
  boxOnRight: PropTypes.bool,
  labelStyle: PropTypes.object,
  containerStyle: PropTypes.object,
}

export const FormCheckbox = ({ name, value, onChange = () => {}, ...props }) => (
  <Field
    name={name}
    type="checkbox"
    value={value}
    render={({ input, meta }) => (
      <AltCheckbox
        {...input}
        {...props}
        meta={meta}
        onChange={(e) => { input.onChange(e); onChange(e) }}
      />
    )}
  />
)

FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
}

export class ControlledCheckbox extends Component {
  constructor(...args) {
    super(...args)
    this.updateValue = this.updateValue.bind(this)
    this.state = {
      checked: this.props.defaultChecked || this.props.checked,
    }
  }

  updateValue(e) {
    this.setState({ checked: e.target.checked })
  }

  render() {
    const { checked, defaultChecked, label, boxOnRight, ...props } = this.props
    return (
      <Checkbox
        onClick={this.updateValue}
        checked={this.state.checked}
        label={label}
        boxOnRight={boxOnRight}
        {...props}
      />
    )
  }
}

ControlledCheckbox.propTypes = {
  checked: PropTypes.bool,
  partiallyChecked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  label: PropTypes.string,
  boxOnRight: PropTypes.bool,
}

export default Checkbox
