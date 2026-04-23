import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QuantityStepper from './QuantityStepper'

const Control = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

const ActionButton = styled.button`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #2f4256;
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
`

const ActionIcon = styled.span`
  font-size: 14px;
  line-height: 1;
`

const QuantityAdjustControl = ({
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
  actionOnClick,
  actionLabel,
  actionTitle,
  actionAriaLabel,
  actionIcon,
  actionIconClass,
}) => (
  <Control>
    <QuantityStepper
      value={value}
      onChange={onChange}
      onDecrement={onDecrement}
      onIncrement={onIncrement}
      disabled={disabled}
      inputWidth={inputWidth}
      buttonSize={buttonSize}
      filledButtons={filledButtons}
      min={min}
      step={step}
      placeholder={placeholder}
    />
    {actionOnClick && (
      <ActionButton
        type="button"
        onClick={actionOnClick}
        aria-label={actionAriaLabel}
        title={actionTitle}
        $size={buttonSize}
      >
        {actionIconClass
          ? <i className={actionIconClass} aria-hidden="true" />
          : (actionIcon ? <ActionIcon aria-hidden="true">{actionIcon}</ActionIcon> : actionLabel)}
      </ActionButton>
    )}
  </Control>
)

QuantityAdjustControl.propTypes = {
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
  actionOnClick: PropTypes.func,
  actionLabel: PropTypes.string,
  actionTitle: PropTypes.string,
  actionAriaLabel: PropTypes.string,
  actionIcon: PropTypes.string,
  actionIconClass: PropTypes.string,
}

QuantityAdjustControl.defaultProps = {
  disabled: false,
  inputWidth: 74,
  buttonSize: 30,
  filledButtons: false,
  min: 1,
  step: 1,
  placeholder: '1',
  actionOnClick: null,
  actionLabel: 'Action',
  actionTitle: '',
  actionAriaLabel: '',
  actionIcon: '',
  actionIconClass: '',
}

export default QuantityAdjustControl
