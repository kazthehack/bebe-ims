//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { compose, withState } from 'recompose'
import Button from 'components/common/input/Button'
import { PaginatedTable, StatusColumn, CenteredColumn, TwoLine, withFixedHeaderDataTable, TableActionBar, SearchableCellText, Filters } from 'components/Table'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import Title from 'components/common/display/Title'
import { Link } from 'react-router-dom'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { StyledDropDownMenu, StyledMenuItem } from 'components/pages/StyledDropDownMenu'
import Spinner from 'components/common/display/Spinner'
import colors from 'styles/colors'
import styled from 'styled-components'
import usePrevProps from 'utils/globalHook'
import { get, pick, map, flatten } from 'lodash'
import { withVenueID, withVenueSettings } from 'components/Venue'
import { Icon } from 'components/common/display'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { withSalesTypes, defaultGroupings, salesTypeDataPropTypes } from 'components/SalesTypes'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { productSearchConfig } from 'constants/SearchConfigs'
import FauxLink from 'components/common/display/FauxLink'
import { withState as withTableState } from 'store/modules/inventory/products'
import InventoryNavigationBar from '../InventoryNavigation'
import withPaginatedProductsList, { defaultSorting } from './withPaginatedProductsList'
import ProductFiltersForm from './ProductFilters'

const PAGE_SIZE = 50
const INITIAL_PAGES_SKIPPED = 0

const styles = {
  positionRelative: {
    position: 'relative',
  },
  downArrow: {
    color: colors.white,
    fontSize: '12px',
    float: 'right',
    padding: '3px 4px 0px 0px',
  },
  iconStyle: {
    marginRight: 10,
    color: 'inherit',
  },
  newProductButton: {
    width: '160px',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
}

const StyledProductIcon = styled(ProductIcon)`
  margin-right: 10px;
`

const StyledPackageCount = styled.span`
  color: ${({ color }) => color};
`

const CenteredIcon = styled(Icon)`
  text-align: center;
`

const getIcon = (iconName, enableDareMode) => {
  if (enableDareMode && iconName === 'merch-shirt') {
    return 'shirt'
  }
  return iconName
}

const insert = (array, index, item) => array.splice(index, 0, item)

export const getColumns = (table, enableDareMode) => {
  const columns = [{
    ...StatusColumn,
    accessor: 'posActive',
    Header: 'Active',
    sortable: true,
  }, {
    accessor: 'inventoryId',
    Header: 'ID',
    sortable: true,
    width: !enableDareMode ? 140 : 280,
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <FauxLink style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
        {value && <SearchableCellText text={value} style={{ fontFamily: 'Roboto Condensed, sans-serif' }} table={table} />}
      </FauxLink>
    ),
  }, {
    accessor: 'name',
    Header: 'Name',
    sortable: true,
    Cell: ({ original, value }) => ( // eslint-disable-line react/prop-types
      <Fragment>
        {original &&
          <span>
            { original.hasCannabis ?
              <StyledProductIcon type="plant" /> :
              null
            }
            <SearchableCellText
              text={value}
              table={table}
            />
          </span>
        }
      </Fragment>
    ),
  }]

  if (!enableDareMode) {
    insert(columns, 2, {
      accessor: 'medicalOnly',
      Header: 'Med',
      sortable: true,
      width: 69,
      Cell: ({ value }) => (value ? <CenteredIcon name="first-aid" /> : null), // eslint-disable-line react/prop-types
      ...CenteredColumn,
    })
    columns.push(
      {
        accessor: 'salesType',
        Header: 'Type',
        sortMethod: (a, b) => (
          a.name >= b.name ? 1 : -1 // sorting alphabetically in ascending order
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <Fragment>
            {value &&
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <StyledProductIcon type={value ? getIcon(value.iconName, enableDareMode) : ''} />
                <SearchableCellText text={value ? value.name : ''} table={table} />
              </div>
            }
          </Fragment>
        ),
      }, {
        accessor: 'activePackageCount',
        Header: <TwoLine top="Usable" bottom="Packages" />,
        sortable: true,
        width: 128,
        Cell: ({ original }) => ( // eslint-disable-line react/prop-types
          <Fragment>
            {original.salesType &&
              <StyledPackageCount
                color={original.activePackageCount === 0 ? colors.red : colors.grayDark2}
              >
                {original.salesType.name === 'Merchandise' ? 'N/A' : original.activePackageCount}
              </StyledPackageCount>
            }
          </Fragment>
        ),
        ...CenteredColumn,
      }, {
        accessor: 'emptyPackageCount',
        Header: <TwoLine top="Empty" bottom="Packages" />,
        sortable: true,
        width: 134,
        Cell: ({ original }) => ( // eslint-disable-line react/prop-types
          <Fragment>
            {original.salesType &&
              // eslint-disable-next-line max-len
              <StyledPackageCount color={original.emptyPackageCount === 0 ? colors.grayLight : colors.red} >
                {original.salesType.name === 'Merchandise' ? 'N/A' : original.emptyPackageCount}
              </StyledPackageCount>
            }
          </Fragment>
        ),
        ...CenteredColumn,
      },
    )
  }
  return columns
}

export const selectMappedProductsCollection = products => (
  products.map(({ node }) => {
    const nodeProps = pick(node, 'posActive', 'inventoryId', 'medicalOnly', 'name', 'iconName', 'salesType', 'id', 'emptyPackageCount', 'activePackageCount')
    return {
      ...nodeProps,
      packages: {
        tags: node.packages ? node.packages.map(associatedPackage => get(associatedPackage, 'providerInfo.tag', '')) : [],
        sources: node.packages ? node.packages.map(associatedPackage => get(associatedPackage, 'source', '')) : [],
      },
    }
  })
)

const TableWrap = ({
  data,
  loading,
  dataSize,
  pagination,
  searchTerm,
  multiSort,
  table,
  setPage,
  setSort,
  enableDareMode,
}) => {
  const prevProps = usePrevProps({ pagination })

  const updatePagination = ({ pagesSkipped }) => {
    if (get(prevProps, 'pagination.paginationState.pagesSkipped') !== pagesSkipped) {
      pagination.setPaginationState(state => ({ ...state, pagesSkipped }))
    }
  }

  return (
    <PaginatedTable
      columns={getColumns(table, enableDareMode)}
      data={data}
      loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
      loading={loading}
      rowLink={(state, rowInfo) => (`/inventory/products/edit/${rowInfo.original.id}`)}
      defaultSorted={defaultSorting}
      searchedTerm={searchTerm}
      fetchData={updatePagination}
      dataSize={dataSize}
      isManual
      multiSort={multiSort}
      table={table}
      setSort={setSort}
      setPage={setPage}
    />
  )
}

TableWrap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  dataSize: PropTypes.number,
  pagination: PropTypes.object,
  searchTerm: PropTypes.string,
  multiSort: PropTypes.bool,
  table: PropTypes.object,
  setPage: PropTypes.func,
  setSort: PropTypes.func,
  enableDareMode: PropTypes.bool,
}

const NewProductButton = ({ dropDownList }) => (
  <StyledDropDownMenu
    render={onClick => (
      <Button primary onClick={onClick} style={styles.newProductButton}>
        New Product <ProductIcon type="dropDown" style={styles.downArrow} />
      </Button>
    )}
  >
    {dropDownList.map(val => (
      <Link key={val.id} style={styles.link} to={`/inventory/products/new/${val.id}`}>
        <StyledMenuItem>
          <ProductIcon
            type={val.iconName || val.id}
            style={styles.iconStyle}
          />
          {val.name}
        </StyledMenuItem>
      </Link>
    ))}
  </StyledDropDownMenu>
)

NewProductButton.propTypes = {
  dropDownList: PropTypes.arrayOf(PropTypes.object), // salesTypeData array
}

const Products = ({
  className,
  productsData,
  salesTypeData,
  userPermissions,
  productsTable,
  setSort,
  setPage,
  setSearchTerm,
  setResult,
  tableResult,
  tableSearchTerm,
  paginationState,
  setPaginationState,
  tableFilters,
  setFilters,
  venueSettings,
}) => {
  const productsList = get(productsData, 'store.products.edges', [])
  const totalProducts = get(productsData, 'store.products.totalCount', 0)
  const storeSalesTypes = salesTypeData.salesTypes
  const filterSalesTypes = flatten(map(storeSalesTypes, type =>
    map(type.salesTypes, s => ({ id: s.id, name: s.name }))))
  const mappedProductsData = selectMappedProductsCollection(productsList) || []
  const { enableDareMode } = get(venueSettings, 'store.settings')
  const merchOption = [{
    id: 'merchandise',
    iconName: 'shirt',
    name: 'Merchandise',
  }]
  return (
    <div className={className} style={styles.positionRelative}>
      <Title>Products</Title>
      <InventoryNavigationBar />
      <TableActionBar
        buttons={
          // Do not render if user doesn't have write permissions
          userPermissions.write &&
            <NewProductButton
              dropDownList={enableDareMode ? merchOption : storeSalesTypes}
            />
        }
        search={
          <SearchBox
            dataSource={mappedProductsData}
            fieldSearchDefinitions={productSearchConfig}
            setSearchTerm={setSearchTerm}
            setResult={setResult}
            result={tableResult}
            searchTerm={tableSearchTerm}
            total={totalProducts}
            showAllResults
          />
        }
      />
      { !enableDareMode &&
        <Filters setFilters={setFilters}>
          <ProductFiltersForm
            storeSalesTypes={filterSalesTypes}
            setFilters={setFilters}
            filters={tableFilters}
            setPage={setPage}
          />
        </Filters>
      }
      <SingleItemGrid style={{ overflow: 'visible', minHeight: '400' }}>
        <TableWrap
          data={mappedProductsData}
          dataSize={get(productsData, 'store.products.totalCount', 0)}
          loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
          loading={productsData ? productsData.loading : true}
          rowLink={(state, rowInfo) => (`/inventory/products/edit/${rowInfo.original.id}`)}
          pagination={{ paginationState, setPaginationState }}
          searchTerm={tableSearchTerm}
          defaultSorted={defaultSorting}
          multiSort
          table={productsTable}
          setPage={setPage}
          setSort={setSort}
          enableDareMode={enableDareMode}
        />
      </SingleItemGrid>
    </div>
  )
}

Products.propTypes = {
  className: PropTypes.string,
  salesTypeData: salesTypeDataPropTypes,
  productsData: PropTypes.shape({
    store: PropTypes.shape({
      products: PropTypes.shape({
        edges: PropTypes.arrayOf(PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            inventoryId: PropTypes.string,
            posActive: PropTypes.bool,
            medicalOnly: PropTypes.bool,
            packages: PropTypes.array,
          }),
        })),
      }),
    }),
  }),
  userPermissions: UserPermissionsPropType,
  productsTable: PropTypes.object,
  setPage: PropTypes.func,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  setSort: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
  paginationState: PropTypes.object,
  setPaginationState: PropTypes.func,
  tableFilters: PropTypes.object,
  setFilters: PropTypes.func,
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default compose(
  withVenueID,
  withVenueSettings({ name: 'venueSettings' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withTableState,
  withState('paginationState', 'setPaginationState', {
    pageSize: PAGE_SIZE,
    pagesSkipped: INITIAL_PAGES_SKIPPED,
  }),
  withPaginatedProductsList,
  withSalesTypes(defaultGroupings), // salesTypeData
  withQueryErrorPageOnError('productsData', true),
  withFixedHeaderDataTable(),
)(Products)
