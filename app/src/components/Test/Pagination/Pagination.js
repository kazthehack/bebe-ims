import React from 'react'
import { range, map } from 'lodash'
import { PaginatedTable } from 'components/Table'

const columns = [{
  Header: 'a',
  accessor: 'a',
}, {
  Header: 'b',
  accessor: 'b',
}, {
  Header: 'c',
  accessor: 'c',
}]

const data = map(range(100), n => ({ a: n, b: n, c: n }))

const TestPaginatedTable = () => (
  <PaginatedTable data={data} columns={columns} />
)

export default TestPaginatedTable
