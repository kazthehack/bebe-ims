import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import Accordian from 'components/common/container/Accordian'

const Wrapper = styled.div`
  background-color: ${colors.white};
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0;
`

const ClearFiltersButton = styled.div`
  height: 20px;
  width: 95px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${colors.red};
  text-decoration: underline;
`
// TODO: maybe add apply filters button here instead of packageFilters
const Filters = ({ setFilters, children }) => {
  const clearFiltersButton = (
    <ClearFiltersButton
      onClick={() => setFilters({ filters: null })}
    >
      Clear Filters
    </ClearFiltersButton>
  )

  return (
    <Wrapper>
      <Accordian
        displayContent={children}
        label="Filters"
        actionButton={clearFiltersButton}
        renderWhenClosed={false}
      />
    </Wrapper>
  )
}

Filters.propTypes = {
  setFilters: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Filters
