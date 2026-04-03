import React from 'react'
import PropTypes from 'prop-types'
import { compose, withProps } from 'recompose'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { withFixedHeaderDataTable, PaginatedTable, CenteredColumn, StatusColumn, TwoLine, TableActionBar, SearchableCellText } from 'components/Table'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import colors from 'styles/colors'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withState as withTableState } from 'store/modules/inventory/priceGroups'
import withPriceGroups from './withPriceGroupsAndAssociatedProducts'
import InventoryNavigationBar from '../InventoryNavigation'

const NewPriceGroupButton = styled(Button)`
  width: 174px;
`
const styles = {
  rowMore: {
    cursor: 'pointer',
  },
  col5right: {
    width: '5%',
    columnWidth: '5%',
    minWidth: 40,
    textAlign: 'right',
  },
  col20: {
    width: '20%',
    columnWidth: '20%',
  },
  col20center: {
    width: '20%',
    columnWidth: '20%',
    textAlign: 'center',
  },
  topRight: {
    position: 'absolute',
    top: '0',
    right: '0',
  },
  positionRelative: {
    position: 'relative',
  },
  downArrow: {
    color: colors.white,
    fontSize: '12px',
  },
  iconStyle: {
    marginRight: 10,
    color: 'inherit',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  name: {
    color: colors.blue,
  },
  inactive: {
    color: colors.grayLight,
  },
  marginR: {
    marginRight: '30px',
  },
}

const columns = table => ([{
  ...StatusColumn,
  Header: 'Active',
}, {
  accessor: 'name',
  Header: 'Name',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => <SearchableCellText text={value} table={table} />,
}, {
  id: 'inactiveProducts',
  Header: <TwoLine top="inactive" bottom="products" />,
  accessor: original => (original.inactiveProductsCount),
  // eslint-disable-next-line react/prop-types
  Cell: ({ original }) => (
    <span style={styles.inactive}>
      {original.inactiveProductsCount}
    </span>
  ),
  width: 128,
  ...CenteredColumn,
}, {
  Header: <TwoLine top="active" bottom="products" />,
  accessor: 'activeProductsCount',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (<span>{value}</span>),
  width: 128,
  style: {
    ...styles.marginR,
    ...CenteredColumn.style,
  },
  headerStyle: {
    ...styles.marginR,
    ...CenteredColumn.getHeaderProps().style,
  },
}])

function aggregateProductPriceGroups(gqlMessyData) {
  const newObject = {}
  if (!gqlMessyData.loading && gqlMessyData.store) {
    const priceGroups = get(gqlMessyData, 'store.priceGroups.edges', [])
    const products = get(gqlMessyData, 'store.products.edges', [])

    // Initialize all Price Group aggregate counts to 0 for only shared price groups
    priceGroups.forEach((pg) => {
      const priceGroup = get(pg, 'node', [])
      if (priceGroup.shared) {
        newObject[priceGroup.id] = {
          ...priceGroup,
          type: priceGroup.salesType.name,
          activeProductsCount: 0,
          inactiveProductsCount: 0,
        }
      }
    })

    // Aggregate flat data from products table
    // only increment the appropriate count if price group is shared
    products.forEach((product) => {
      const priceGroup = get(product, 'node.priceGroup', [])
      if (!newObject[priceGroup.id]) {
        // console.log(`${priceGroup.id} Must not be a shared price group, else we have error here`)
      } else {
        newObject[priceGroup.id][(product.node.posActive) ? 'activeProductsCount' : 'inactiveProductsCount'] += 1
      }
    })
  }
  return Object.values(newObject)
}

const searchObj = [{
  fieldName: 'name',
  searchType: 'fuzzy',
}, {
  fieldName: 'type',
  searchType: 'fuzzy',
}]

const PriceGroups = ({
  className,
  priceGroupsMessyData,
  userPermissions,
  mappedPriceGroupsData,
  // eslint-disable-next-line react/prop-types
  setSorted,
  priceGroupsTable,
  tableResult,
  tableSearchTerm,
  setSort,
  setPage,
  setSearchTerm,
  setResult,
}) => (
  <div className={className} style={styles.positionRelative} >
    <Title>Price groups</Title>
    <InventoryNavigationBar />
    <TableActionBar
      buttons={
          // Do not render if user doesn't have write permissions
          userPermissions.write &&
          <Link to="price-groups/new">
            <NewPriceGroupButton primary>New Price Group</NewPriceGroupButton>
          </Link>
        }
      search={
        <SearchBox
          dataSource={mappedPriceGroupsData}
          fieldSearchDefinitions={searchObj}
          setSearchTerm={setSearchTerm}
          setResult={setResult}
          result={tableResult}
          searchTerm={tableSearchTerm}
          showAllResults
        />
        }
    />
    <SingleItemGrid>
      <PaginatedTable
        loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
        loading={get(priceGroupsMessyData, 'loading', true)}
        data={tableResult || mappedPriceGroupsData}
        columns={columns(priceGroupsTable)}
        rowLink={(state, rowInfo) => (`/inventory/price-groups/edit/${rowInfo.original.id}`)}
        defaultSorted={[{
            id: 'name',
            desc: false,
          }]}
        searchedTerm={tableSearchTerm}
        setSorted={setSorted}
        setSort={setSort}
        setPage={setPage}
        table={priceGroupsTable}
      />
    </SingleItemGrid>
  </div>
)

PriceGroups.propTypes = {
  className: PropTypes.string,
  userPermissions: UserPermissionsPropType,
  priceGroupsMessyData: PropTypes.shape({
    store: PropTypes.shape({
      priceGroups: PropTypes.object,
      products: PropTypes.shape({
        edges: PropTypes.arrayOf(PropTypes.shape({
          node: PropTypes.shape({
            posActive: PropTypes.PropTypes.bool,
            priceGroup: PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              active: PropTypes.bool.isRequired,
            }),
          }),
        })),
      }),
    }),
  }),
  mappedPriceGroupsData: PropTypes.arrayOf(PropTypes.object),
  priceGroupsTable: PropTypes.object,
  setSort: PropTypes.func,
  setPage: PropTypes.func,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
}

export default compose(
  withPriceGroups({ name: 'priceGroupsMessyData' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withProps(({ priceGroupsMessyData }) => ({
    mappedPriceGroupsData: aggregateProductPriceGroups(priceGroupsMessyData),
  })),
  withQueryErrorPageOnError(['priceGroupsMessyData'], true),
  withFixedHeaderDataTable(),
  withTableState,
)(PriceGroups)
