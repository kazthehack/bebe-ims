import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Control = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const Button = styled.button`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border: 1px solid ${({ $filled }) => ($filled ? '#25384c' : '#bec8d3')};
  border-radius: 4px;
  background: ${({ $filled, disabled }) => (disabled ? '#e2e8f0' : ($filled ? '#25384c' : '#f0f3f6'))};
  color: ${({ $filled, disabled }) => (disabled ? '#8a9aab' : ($filled ? '#fff' : '#2f4256'))};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 700;
`

const Input = styled.input`
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $size }) => `${$size}px`};
  border: 1px solid #bec8d3;
  border-radius: 4px;
  background: #f0f3f6;
  color: #243648;
  text-align: center;
  padding: 0 8px;
`

const QuantityStepper = ({
  value,
  onChange,
  onDecrement,
  onIncrement,
  disabled,
  inputWidth,
  buttonSize,
  filledButtons,
  min,
  step,
  placeholder,
}) => (
  <Control>
    <Button type="button" onClick={onDecrement} disabled={disabled} $filled={filledButtons} $size={buttonSize}>-</Button>
    <Input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      $size={buttonSize}
      $width={inputWidth}
    />
    <Button type="button" onClick={onIncrement} disabled={disabled} $filled={filledButtons} $size={buttonSize}>+</Button>
  </Control>
)

QuantityStepper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  inputWidth: PropTypes.number,
  buttonSize: PropTypes.number,
  filledButtons: PropTypes.bool,
  min: PropTypes.number,
  step: PropTypes.number,
  placeholder: PropTypes.string,
}

QuantityStepper.defaultProps = {
  disabled: false,
  inputWidth: 74,
  buttonSize: 30,
  filledButtons: false,
  min: 1,
  step: 1,
  placeholder: '1',
}

export default QuantityStepper
