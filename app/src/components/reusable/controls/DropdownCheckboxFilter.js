import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Checkbox from 'components/common/input/Checkbox'

const Dropdown = styled.details`
  position: relative;
  display: inline-flex;
`

const Trigger = styled.summary`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: ${({ $width }) => $width};
  height: 38px;
  box-sizing: border-box;
  list-style: none;
  cursor: pointer;
  user-select: none;
  padding: 0 10px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  background: #f0f3f6;
  color: #243648;
  font-size: 14px;
  font-weight: 400;

  &::-webkit-details-marker {
    display: none;
  }
`

const Chevron = styled.span`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #65788b;
  flex-shrink: 0;
`

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 5;
  min-width: ${({ $menuWidth }) => $menuWidth};
  padding: 10px;
  border: 1px solid #d9e0e8;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(17, 26, 37, 0.12);
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`

const Title = styled.div`
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
`

const OptionsColumn = styled.div`
  display: grid;
  gap: 8px;
`

const QuickActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`

const QuickActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #2f4256;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`

const DropdownCheckboxFilter = ({
  label,
  title,
  options,
  selectedValues,
  onToggle,
  onChangeSelected,
  width,
  menuWidth,
}) => {
  const detailsRef = useRef(null)

  useEffect(() => {
    const handleOutsidePointer = (event) => {
      if (!detailsRef.current || !detailsRef.current.open) return
      if (detailsRef.current.contains(event.target)) return
      detailsRef.current.open = false
    }
    document.addEventListener('mousedown', handleOutsidePointer)
    document.addEventListener('touchstart', handleOutsidePointer)
    return () => {
      document.removeEventListener('mousedown', handleOutsidePointer)
      document.removeEventListener('touchstart', handleOutsidePointer)
    }
  }, [])

  return (
    <Dropdown ref={detailsRef}>
      <Trigger $width={width}>
        {label}
        <Chevron aria-hidden="true" />
      </Trigger>
      <Menu $menuWidth={menuWidth}>
        <HeaderRow>
          <Title>{title || label}</Title>
          {onChangeSelected && (
            <QuickActions>
              <QuickActionButton
                type="button"
                onClick={() => onChangeSelected(options.map((option) => option.value))}
              >
                Select All
              </QuickActionButton>
              <QuickActionButton
                type="button"
                onClick={() => onChangeSelected([])}
              >
                Clear All
              </QuickActionButton>
            </QuickActions>
          )}
        </HeaderRow>
        <OptionsColumn>
          {options.map((option) => (
            <Checkbox
              key={option.value}
              checked={selectedValues.includes(option.value)}
              label={option.label}
              onChange={() => onToggle(option.value)}
            />
          ))}
        </OptionsColumn>
      </Menu>
    </Dropdown>
  )
}

DropdownCheckboxFilter.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onChangeSelected: PropTypes.func,
  width: PropTypes.string,
  menuWidth: PropTypes.string,
}

DropdownCheckboxFilter.defaultProps = {
  title: '',
  onChangeSelected: null,
  width: '180px',
  menuWidth: '180px',
}

export default DropdownCheckboxFilter
