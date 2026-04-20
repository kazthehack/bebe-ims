import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DropdownCheckboxFilter from 'components/reusable/controls/DropdownCheckboxFilter'
import DropdownSelectFilter from 'components/reusable/controls/DropdownSelectFilter'

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const SearchInput = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  min-width: 280px;
  padding: 0 10px;
  background: #f0f3f6;
`

const ListFiltersRow = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  right,
}) => (
  <Row>
    <Left>
      <SearchInput
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
      {(filters || []).map((filter) => (
        filter.type === 'multi-checkbox' ? (
          <DropdownCheckboxFilter
            key={filter.key}
            label={filter.label || 'Filter'}
            title={filter.title || filter.label || 'Filter'}
            options={filter.options || []}
            selectedValues={filter.selectedValues || []}
            onToggle={filter.onToggle}
            onChangeSelected={filter.onChangeSelected}
            width={filter.minWidth || '180px'}
            menuWidth={filter.menuWidth || filter.minWidth || '180px'}
          />
        ) : (
          <DropdownSelectFilter
            key={filter.key}
            value={filter.value}
            onChange={filter.onChange}
            minWidth={filter.minWidth}
            menuWidth={filter.menuWidth}
            options={filter.options || []}
          />
        )
      ))}
    </Left>
    {right}
  </Row>
)

ListFiltersRow.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  filters: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['single-select', 'multi-checkbox']),
    value: PropTypes.string,
    onChange: PropTypes.func,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    onToggle: PropTypes.func,
    onChangeSelected: PropTypes.func,
    label: PropTypes.string,
    title: PropTypes.string,
    minWidth: PropTypes.string,
    menuWidth: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })).isRequired,
  })),
  right: PropTypes.node,
}

ListFiltersRow.defaultProps = {
  searchPlaceholder: 'Search',
  filters: [],
  right: null,
}

export default ListFiltersRow
