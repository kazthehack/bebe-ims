//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React, { useState } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import PropTypes from 'prop-types'
import search from 'utils/search'
import { TableSearchField } from 'components/Table'
import { isEmpty } from 'lodash'

const StyledDiv = styled.div`
  font-size: 12px;
  margin-top: 8px;
  color: ${colors.grayDark2};
`

const SearchBox = ({
  dataSource = [],
  fieldSearchDefinitions = [],
  type = 'none',
  wrapperStyle,
  setSearchTerm,
  setResult,
  result = [],
  searchTerm,
  total,
  showAllResults = false,
}) => {
  let count = (total || total === 0) ? total : result.length
  const [noResults, setNoResults] = useState(false)

  const handleOnSearch = (searchText) => {
    setSearchTerm({ searchTerm: searchText })
    const res = search(searchText, fieldSearchDefinitions, dataSource)
    count = res.length
    if (isEmpty(res) && showAllResults) {
      setNoResults(true)
      setResult({ result: dataSource })
      return
    }
    setResult({ result: res })
  }

  return (
    <div style={{ display: 'block' }}>
      <TableSearchField
        searchTerm={searchTerm || ''}
        onSearch={handleOnSearch}
        searchType={type}
        wrapperStyle={wrapperStyle}
      />
      {searchTerm && (
        <StyledDiv>
          {`${noResults || count === 0 ? 'No' : count} results for `}
          <b>
            &quot;
            {searchTerm}
            &quot;
          </b>
          {noResults && showAllResults ? ' - Showing all results' : ''}
        </StyledDiv>
      )}
    </div>
  )
}

SearchBox.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  fieldSearchDefinitions: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
  wrapperStyle: PropTypes.object,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  result: PropTypes.arrayOf(PropTypes.object),
  searchTerm: PropTypes.string,
  total: PropTypes.number,
  showAllResults: PropTypes.bool,
}

export default (SearchBox)
