import React, { useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Dropdown = styled.details`
  position: relative;
  display: inline-flex;
`

const Trigger = styled.summary`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: ${({ $minWidth }) => $minWidth || '180px'};
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

  &::-webkit-details-marker {
    display: none;
  }
`

const Caret = styled.span`
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
  min-width: ${({ $menuWidth }) => $menuWidth || '180px'};
  max-height: 260px;
  overflow: auto;
  padding: 6px;
  border: 1px solid #d9e0e8;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(17, 26, 37, 0.12);
`

const OptionButton = styled.button`
  width: 100%;
  border: 0;
  background: ${({ $active }) => ($active ? '#edf2f8' : 'transparent')};
  color: #243648;
  text-align: left;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #edf2f8;
  }
`

const DropdownSelectFilter = ({ value, onChange, options, minWidth, menuWidth }) => {
  const detailsRef = useRef(null)
  const selectedLabel = useMemo(() => {
    const match = (options || []).find((option) => option.value === value)
    return match ? match.label : ((options && options[0] && options[0].label) || 'Select')
  }, [options, value])

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
      <Trigger $minWidth={minWidth}>
        {selectedLabel}
        <Caret aria-hidden="true" />
      </Trigger>
      <Menu $menuWidth={menuWidth || minWidth}>
        {(options || []).map((option) => (
          <OptionButton
            key={option.value}
            type="button"
            $active={option.value === value}
            onClick={() => {
              onChange(option.value)
              if (detailsRef.current) detailsRef.current.open = false
            }}
          >
            {option.label}
          </OptionButton>
        ))}
      </Menu>
    </Dropdown>
  )
}

DropdownSelectFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  minWidth: PropTypes.string,
  menuWidth: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
}

DropdownSelectFilter.defaultProps = {
  minWidth: '180px',
  menuWidth: '',
}

export default DropdownSelectFilter
