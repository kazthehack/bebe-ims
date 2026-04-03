import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import mockProductsNewData from 'data/mockProductsNewData'
import { PaginatedTable } from 'components/Table'
import { getColumns, selectMappedProductsCollection } from 'components/pages/inventory/products/Products'
import mountWithMocks from 'utils/test/mountWithMocks'

const defaultSorted = [{
  id: 'posActive',
  desc: true,
}, {
  id: 'name',
  desc: false,
}]

const sortByNameAscendingOnly = [{
  id: 'name',
  desc: false,
}]

const mappedProductsData = selectMappedProductsCollection(mockProductsNewData)

describe('Product List: <PaginatedTable />', () => {
  test('Products list with default sorting', () => {
    // Mount the Products component with default sorting
    const wrapper = mountWithMocks(() => (
      <BrowserRouter>
        <PaginatedTable
          data={mappedProductsData}
          columns={getColumns()}
          defaultSorted={defaultSorted}
        />
      </BrowserRouter>
    ))
    // Iterate through the rows of the table
    wrapper.find('TrGroupComponent').forEach((tableRow, rowIndex) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (columnIndex === 0) { // First column - Active toggle
          const toggle = tableData.find('StyledComponent').prop('active')
          expect(toggle).toBe(mappedProductsData[rowIndex].posActive)
        } else if (columnIndex === 1) { // Second column - ID
          const id = tableData.find('SearchableCellText').prop('text')
          expect(id).toBe(mappedProductsData[rowIndex].inventoryId)
        } else if (columnIndex === 3) { // Fourth Column - NAME
          const name = tableData.find('SearchableCellText').prop('text')
          expect(name).toBe(mappedProductsData[rowIndex].name)
        } else if (columnIndex === 4) { // Fifth Column - TYPE
          const type = tableData.find('SearchableCellText').prop('text')
          expect(type).toBe(mappedProductsData[rowIndex].salesType.name)
        } else if (columnIndex === 5) { // Sixth Column - USABLE PACKAGES
          const usablePackage = tableData.find('StyledComponent').find('span').text()
          if (rowIndex === 0) {
            expect(parseInt(usablePackage, 10)).toEqual(1)
          } else {
            expect(parseInt(usablePackage, 10)).toEqual(2)
          }
        } else if (columnIndex === 6) { // Seventh Column - EMPTY PACKAGES
          const emptyPackage = tableData.find('StyledComponent').find('span').text()
          expect(parseInt(emptyPackage, 10)).toEqual(0)
        }
      })
    })
  })

  test('Custom Sorting', () => {
    // Mount the Products component with custom sorting
    const customSortWrapper = mountWithMocks(() => (
      <BrowserRouter>
        <PaginatedTable
          data={mappedProductsData}
          columns={getColumns()}
          defaultSorted={sortByNameAscendingOnly}
        />
      </BrowserRouter>
    ))
    customSortWrapper.find('TrGroupComponent').forEach((tableRow, rowIndex) => {
      // For each row, iterate through the columns
      tableRow.find('TdComponent').forEach((tableData, columnIndex) => {
        if (rowIndex === 0) { // checking first row if sorting is correct
          if (columnIndex === 3) { // NAME COLUMN
            const name = tableData.find('SearchableCellText').prop('text')
            expect(name).toBe(mappedProductsData[rowIndex].name)
          }
        }
      })
    })
  })
})
