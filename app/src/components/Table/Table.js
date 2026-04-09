//  Copyright (c) 2017-2019 First Foundry LLC. All rights reserved.
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactTable, { ReactTableDefaults } from 'react-table'
import 'react-table/react-table.css'
import styled from 'styled-components'
import { invoke, merge, find, isFunction, get, ceil, isEmpty } from 'lodash'
import colors from 'styles/colors'
import { withRouter } from 'react-router-dom'
import StatusIcon from 'components/common/display/StatusIcon'
import { compose } from 'recompose'

const selectedRowStyle = {
  borderRadius: '4px',
  boxShadow: '0 1px 3px 0',
  border: `solid 1px ${colors.blue}`,
}

const SortArrowBase = styled.div`
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
`
const SortArrowUp = styled(SortArrowBase)`
  border-bottom: 4px solid ${({ sorted }) => (sorted === 'asc' ? colors.grayDark2 : '#cccccc')};
`
const SortArrowDown = styled(SortArrowBase)`
  margin-top: 6px;
  border-top: 4px solid ${({ sorted }) => (sorted === 'desc' ? colors.grayDark2 : '#cccccc')};
`
const SortFlexContainer = styled.div`
  display: flex;
`
const SortSpacer = styled.span`
  margin-right: 20px;
`
const SortArrowContainer = styled.div`
  margin-left: 12px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TableViewport = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

/* eslint-disable react/prop-types */
const HeaderWithArrows = (Header, centered) => (props) => {
  const { column: { sorted } } = props
  return (
    <SortFlexContainer>
      { /* if header is centered, add a spacer equal width as the arrows
           so that adding the arrows doesn't push the centering over */}
      { centered && <SortSpacer /> }
      {isFunction(Header) ? <Header {...props} /> : Header}
      { sorted && (
        <SortArrowContainer>
          <SortArrowUp sorted={sorted} />
          <SortArrowDown sorted={sorted} />
        </SortArrowContainer>
      )}
    </SortFlexContainer>
  )
}

const Table = (props) => {
  const {
    columns,
    data,
    getTdProps = () => {},
    onSortedChange = () => {},
    getTrProps = () => {},
    noHover = false,
    rowLink, history,
    showPagination = false,
    pageSize = 200,
    selected,
    setSorted = () => {},
    defaultSorted,
    fetchData = () => {},
    dataSize,
    isManual = false,
    table,
    setSort = () => {},
    multiSort = false,
    sortField = 'sort',
    className,
  } = props

  const savedSortingRule = get(table, sortField, defaultSorted)
  const searchedTerm = table ? table.searchedTerm : ''

  // Check and assign table sort
  const [state, setState] = useState({
    sorted: savedSortingRule,
  })

  // Whenever the global search state is updated for this table
  // if anything different is searched, clear the sorting
  // so the results are shown based on their fuzzy search score
  // Otherwise, use the savedSortingRule
  useEffect(() => {
    setState({ sorted: savedSortingRule })
  }, [table, searchedTerm])

  const tableColumns = columns.map((column) => {
    // Add sort state to columns
    const sortedState = find(state.sorted, {
      id: isFunction(column.accessor) ? column.id : column.accessor,
    })
    let direction = null
    if (sortedState) {
      direction = sortedState.desc ? 'desc' : 'asc'
    }
    return {
      sorted: direction,
      ...column,
      // Add sort arrows to header
      Header: HeaderWithArrows(column.Header, column.centerSortArrows),
    }
  })

  const handleSorting = (newSorted) => {
    setState({ sorted: newSorted })
    setSorted(newSorted)

    setSort({ sort: newSorted })
    if (!isEmpty(newSorted)) {
      const sort = multiSort ? newSorted : newSorted[0]
      onSortedChange(sort)
    }
  }

  return (
    <TableViewport>
      <StyledTable
        {...props}
        manual={isManual} // handle sorting and pagination server-side
        onFetchData={(tableState) => {
          // Refetch query
          fetchData({ pagesSkipped: tableState.page })
        }}
        pages={ceil(dataSize / pageSize)}
        showPagination={showPagination}
        minRows={0}
        data={data}
        column={{ ...ReactTableDefaults.column, resizable: false }}
        columns={tableColumns}
        defaultPageSize={pageSize}
        // allow columns to extend getTdProps per column
        getTdProps={(tState, rowInfo, column, instance) => merge(
          // table-level getTdProps
          getTdProps(tState, rowInfo, column, instance),
          // per column getTdProps
          invoke(column, 'getTdProps', tState, rowInfo, column, instance),
        )}
        getTrProps={(tState, info, column, instance) => {
          // This calls getTrProps for the FIRST column that has it for each row
          const columnProps = columns.find((col, i) => (get(columns, `[${i}].getTrProps`)))
          const columnTrProps = invoke(columnProps, 'getTrProps', tState, info, column, instance)
          const trProps = getTrProps(tState, info, column, instance)
          const rowClick = get(trProps, 'onClick', () => {})
          // Covering both cases because many tables use node and some take it out.
          const isSelected = (get(info, 'original.id', false) === selected) || (get(info, 'original.node.id', false) === selected)
          const style = get(trProps, 'style', {})
          const selectedStyle = isSelected ? Object.assign(style, selectedRowStyle) : style
          const rowStyle = noHover ? selectedStyle : Object.assign({ cursor: 'pointer' }, selectedStyle)
          return ({
            style: rowStyle,
            className: noHover ? className : `tableHover ${className}`,
            ...trProps,
            onClick: (e, handleOriginal) => {
              if (rowClick) rowClick(e, info)
              if (handleOriginal) handleOriginal()
              if (rowLink && (e.metaKey || e.ctrlKey)) {
                window.open(rowLink(tState, info, column, instance), '_blank')
              } else if (rowLink) history.push(rowLink(tState, info, column, instance))
            },
            // This implementation means that column-level trProps overrules all others
            ...columnTrProps,
          })
        }}
        onSortedChange={newSort => handleSorting(newSort)}
        sorted={state.sorted}
      />
    </TableViewport>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.node,
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    Cell: PropTypes.func,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  getTdProps: PropTypes.func,
  defaultSorted: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    desc: PropTypes.bool.isRequired,
  })),
  onSortedChange: PropTypes.func,
  getTrProps: PropTypes.func,
  noHover: PropTypes.bool,
  rowLink: PropTypes.func,
  history: PropTypes.object.isRequired,
  showPagination: PropTypes.bool,
  pageSize: PropTypes.number,
  selected: PropTypes.string,
  setSorted: PropTypes.func,
  multiSort: PropTypes.bool,
}

const StyledTable = styled(ReactTable)`
  /* background-color: blue; */
  border: 0 !important;
  background: ${colors.white};
  .rt-thead.-header {
    box-shadow: none !important;
  }
  .rt-th.-sort-asc, .rt-thead .rt-th.-sort-desc {
    box-shadow: none !important;
  }
  .rt-noData {
    text-align: center;
    line-height: 59px;
    position: relative !important;
    left: initial !important;
    top: initial !important;
    transform: initial !important;
    padding: 0 !important;
  }
  .rt-thead {
    border-bottom: 1px solid ${colors.grayLight2};
  }
  .rt-tr {
    display: flex !important;;
    align-items: center;
    height: 59px;
  }
  .rt-th {
    color: #4d4d4d;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    outline: none;
    user-select: none;
    text-align: left;
  }
  .rt-td {
    color: ${colors.grayDark2};
    font-size: 14px;
    text-align: left;
  }
  /* This is supposed to be applied, but it seems inconsistently applied. */
  .rt-tr > .rt-th:first-child, .rt-td:first-child {
    padding-left: 32px;
  }
  .rt-thead .rt-th, .rt-tbody .rt-td {
    border-right: 0 !important;
    border-left: 0 !important;
  }
  .rt-tbody a {
    color: ${colors.blue};
    font-size: 14px;
    font-weight: normal;
    text-decoration: none;
  }

  .table-error {
    border: 1px solid red !important;
  }

  @media (max-width: 1024px) {
    min-width: 760px;

    .rt-tr {
      height: 50px;
    }

    .rt-th {
      font-size: 11px;
      letter-spacing: 0.25px;
    }

    .rt-td {
      font-size: 12px;
    }

    .rt-tr > .rt-th:first-child, .rt-td:first-child {
      padding-left: 14px;
    }
  }
`

// TODO: why is this wrapped with withRouter? that's scary
export default compose(
  withRouter,
)(Table)

export const TableWithoutRouter = () => Table

// TODO: the name should be changed to statusColumn since this is an object
export const StatusColumn = {
  Header: 'Status',
  accessor: 'active',
  width: 130, // 50 for text, + 80 for 40px margins
  Cell: ({ value }) => <StatusIcon active={value} />, // eslint-disable-line react/prop-types
  getHeaderProps: () => ({ style: { padding: '0 20px' } }), // 40px margins minus 20px added for sorting arrows
  getTdProps: () => ({ style: { padding: '0 40px', display: 'flex', justifyContent: 'center' } }),
  centerSortArrows: true,
  resizable: false,
}

// TODO: the name should be changed to centeredColumn since this is an object
export const CenteredColumn = {
  style: { textAlign: 'center' },
  getHeaderProps: () => ({ style: { display: 'flex', justifyContent: 'center' } }),
}
