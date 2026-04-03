import React, { useEffect } from 'react'
import usePrevProps from 'utils/globalHook'
import PropTypes from 'prop-types'
import { range, noop, get, size } from 'lodash'
import styled from 'styled-components'
import colors from 'styles/colors'
import { Icon } from 'components/common/display'
import Table from './Table'

const PaginationContainer = styled.div`
  display: inline-block;
  background-color: ${colors.white};
  border-style: solid;
  border-width: 1px 0px 1px 1px;
  border-color: #eeeeee;
  border-radius: 2px;
`
const PageBoxContainer = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: ${({ selected }) => (selected ? '500' : '300')};
  letter-spacing: 0.6px;
  text-align: center;
  border-right: solid 1px #eeeeee;
  color: ${({ selected }) => (selected ? colors.blue : colors.grayDark2)};
  cursor: ${({ selected }) => (selected ? 'auto' : 'pointer')}
`
const PageFlexBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PageBox = ({ children, selected, ...props }) => (
  <PageBoxContainer
    selected={selected}
    {...props}
  >
    <PageFlexBox>
      { children }
    </PageFlexBox>
  </PageBoxContainer>
)
PageBox.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
}

// TODO: this is just a basic mockup of a pagination component, just to get some UI on the screen.
// once we start working with actual pagination, we'll want to revisit this.
const Pagination = styled(({
  currentPage,
  totalPages,
  onPageSelect = noop,
  ...props
}) => {
  const min = Math.max(1, currentPage - 2)
  const max = Math.min(totalPages, currentPage + 2)
  const pages = range(min, max + 1) // range end is exclusive
  return (
    <PaginationContainer {...props} >
      { /* Left Arrow */ }
      <PageBox
        onClick={() => onPageSelect(1)}
        selected={currentPage < 2}
      >
        <Icon style={{ color: (currentPage < 2) ? colors.grayLight : colors.grayDark2 }} name="enter-left2" />
      </PageBox>
      { /* Number Buttons */ }
      { pages.map(value => (
        <PageBox
          key={value}
          selected={value === currentPage}
          onClick={value === currentPage ?
            () => {} :
            () => onPageSelect(value)
          }
        >
          {value}
        </PageBox>
      )) }
      { /* Right Arrow */ }
      <PageBox
        onClick={() => onPageSelect(totalPages)}
        selected={currentPage >= totalPages}
      >
        <Icon style={{ color: (currentPage >= totalPages) ? colors.grayLight : colors.grayDark2 }} name="enter-right2" />
      </PageBox>
    </PaginationContainer>
  )
})`
  margin-top: 16px;
  position: absolute;
  right: 0;
`

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageSelect: PropTypes.func,
}

export const PaginatedTable = ((props) => {
  const {
    queryResults,
    paginationStyle,
    pageSize = 50,
    data = [],
    dataSize = 0,
    noPolling,
    searchedTerm = '',
    setPage = () => {},
    multiSort,
    setSort = () => {},
    table,
    sortField,
  } = props

  const prevProps = usePrevProps({ searchedTerm })

  const onPageSelect = (page) => {
    setPage({ page: page - 1 })

    if (queryResults) {
      queryResults.fetchMore({
        variables: {
          pagesSkipped: page - 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return fetchMoreResult
        },
      })
    }
  }

  const totalPages = dataSize ? Math.ceil(dataSize / pageSize) : Math.ceil(size(data) / pageSize)
  const pageToShow = get(table, 'page', 0)

  // Special case where user tried to go to another page and search a term
  useEffect(() => {
    if (prevProps) {
      if (prevProps.searchedTerm !== searchedTerm) {
        onPageSelect(1)
        if (window.scrollTo) { window.scrollTo(0, 0) }
      }
    }
  }, [searchedTerm])

  return (
    <>
      <Table
        {...props}
        page={noPolling ? 0 : pageToShow}
        pageSize={pageSize}
        dataSize={dataSize}
        multiSort={multiSort}
        setSort={setSort}
        table={table}
        sortField={sortField}
      />
      {(totalPages > 1) && <Pagination
        currentPage={pageToShow + 1}
        totalPages={totalPages}
        onPageSelect={onPageSelect}
        style={paginationStyle}
        dataSize={dataSize}
      />}
    </>
  )
})

PaginatedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  paginationStyle: PropTypes.object,
  pageSize: PropTypes.number,
  searchedTerm: PropTypes.string,
  dataSize: PropTypes.number,
  queryResults: PropTypes.object,
  noPolling: PropTypes.bool,
  multiSort: PropTypes.bool,
  setSort: PropTypes.func,
  setPage: PropTypes.func,
  table: PropTypes.object,
  sortField: PropTypes.string,
}

export default Pagination
