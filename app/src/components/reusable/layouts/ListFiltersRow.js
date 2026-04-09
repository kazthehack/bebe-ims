import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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

const FilterSelect = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  min-width: ${({ $minWidth }) => $minWidth || '180px'};
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
        <FilterSelect
          key={filter.key}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          $minWidth={filter.minWidth}
        >
          {(filter.options || []).map((option) => (
            <option key={`${filter.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>
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
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    minWidth: PropTypes.string,
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
