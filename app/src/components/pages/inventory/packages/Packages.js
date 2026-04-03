//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get, filter, isEmpty } from 'lodash'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { Link } from 'react-router-dom'
import {
  StatusColumn,
  PaginatedTable,
  withFixedHeaderDataTable,
  TwoLine,
  TableActionBar,
  CenteredColumn,
  SearchableCellText,
  Filters,
} from 'components/Table'
import Title from 'components/common/display/Title'
import StatusIcon from 'components/common/display/StatusIcon'
import { ProductIcon } from 'components/common/display/ProductIcon'
import FillBar from 'components/common/display/FillBar'
import Spinner from 'components/common/display/Spinner'
import { withVenueID, withVenueSettings } from 'components/Venue'
import { compose, withState } from 'recompose'
import ReactGA from 'react-ga'
import colors from 'styles/colors'
import { DATE_FORMAT } from 'constants/Settings'
import moment from 'moment-timezone'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { withNotifications } from 'components/Notifications'
import { packageSearchConfig } from 'constants/SearchConfigs'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { withState as withTableState } from 'store/modules/inventory/packages'
import usePrevProps from 'utils/globalHook'
import { fromNowShortHand } from 'utils/strings'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import withMetrcImport from './withMetrcImport'
import InventoryNavigationBar from '../InventoryNavigation'
import withPaginatedPackageList from './withPaginatedPackageList'
import withFilteredPackageIDs from './withFilteredPackageIDs'
import { PackageButtonWithSpinner } from './PackageButton'
import PackageFiltersForm from './PackageFilters'

const PAGE_SIZE = 50
const INITIAL_PAGES_SKIPPED = 0

// Reusable object containing the packages table columns
export const packageColumns = {
  active: {
    ...StatusColumn,
    Header: 'active',
    accessor: 'node.active',
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      typeof value === 'boolean' ? <StatusIcon active={value} /> : ''
    ),
  },
  attentionNeeded: ({
    ...CenteredColumn,
    Header: <TwoLine top="attention" bottom="needed" />,
    accessor: 'node.needsAttention',
    width: 80,
    getTdProps: () => ({ style: { color: colors.blue } }),
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      value && <ProductIcon type="error" />
    ),
  }),
  receivedDate: {
    Header: <TwoLine top="received" bottom="date" />,
    accessor: 'node.dateReceived',
    Cell: ({ value }) => (value ? moment.tz(value, 'UTC').format(DATE_FORMAT) : ''),
    width: 100,
  },
  tag: table => ({
    Header: 'tag',
    accessor: 'node.providerInfo.tag',
    getTdProps: () => ({ style: { color: colors.blue, fontFamily: 'Roboto Condensed, sans-serif', direction: 'rtl' } }),
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <SearchableCellText text={value} table={table} />
    ),
  }),
  category: table => ({
    Header: 'category',
    accessor: 'node.providerInfo.metrcProduct.category',
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <SearchableCellText text={value} table={table} />
    ),
  }),
  name: table => ({
    Header: 'name',
    accessor: 'node.providerInfo.metrcProduct.name',
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <SearchableCellText text={value} table={table} />
    ),
  }),
  facilityName: table => ({
    Header: <TwoLine top="facility" bottom="name" />,
    accessor: 'node.facilityName',
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <SearchableCellText text={value} table={table} />
    ),
  }),
  associatedProduct: table => ({
    Header: <TwoLine top="associated" bottom="product" />,
    accessor: 'node.product.name',
    Cell: ({ value }) => ( // eslint-disable-line react/prop-types
      <SearchableCellText text={value} table={table} />
    ),
  }),
  amountRemaining: {
    Header: <TwoLine top="amount" bottom="remaining" />,
    width: 160,
    Cell: ({ original }) => { // eslint-disable-line react/prop-types
      const nodeValue = original.node || original
      return (
        nodeValue
        && (
          <FillBar
            amount={parseFloat(nodeValue.quantity)}
            total={parseFloat(nodeValue.initialQuantity)}
            unit={nodeValue.unit || ' '}
            style={{ width: '130px', display: 'inline-block' }}
            key={`bar${nodeValue.id}`}
          />
        )
      )
    },
    accessor: 'node.quantity', // accessor needed for sorting based on the current quantity
  },
}

// Prepare the columns for the packages table
const getPackageColumns = table => [
  packageColumns.active,
  packageColumns.attentionNeeded,
  packageColumns.receivedDate,
  packageColumns.tag(table),
  packageColumns.category(table),
  packageColumns.name(table),
  packageColumns.facilityName(table),
  packageColumns.associatedProduct(table),
  packageColumns.amountRemaining,
]

// Used by Table component
const defaultSorting = [{
  id: 'node.active',
  desc: true,
}, {
  id: 'node.dateReceived',
  desc: true,
}, {
  id: 'node.finishedDate',
  desc: true,
},
]

// eslint-disable-next-line react/prop-types
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
}) => {
  const prevProps = usePrevProps({ pagination })
  const updatePagination = ({ pagesSkipped }) => {
    if (get(prevProps, 'pagination.paginationState.pagesSkipped') !== pagesSkipped) {
      pagination.setPaginationState(state => ({ ...state, pagesSkipped }))
    }
  }

  return (
    <PaginatedTable
      columns={getPackageColumns(table)}
      data={data}
      loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
      loading={loading}
      rowLink={(state, rowInfo) => (`/inventory/packages/${rowInfo.original.node.id}`)}
      defaultSorted={defaultSorting}
      searchedTerm={searchTerm}
      fetchData={updatePagination}
      dataSize={dataSize}
      isManual
      multiSort={multiSort}
      table={table}
      setPage={setPage}
      setSort={setSort}
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
}

const PackagesListPure = styled(({
  className,
  packagesListData,
  userPermissions,
  metrcImport,
  venueSettings,
  paginationState,
  setPaginationState,
  setPage,
  setSort,
  packagesTable,
  tableResult,
  tableSearchTerm,
  setSearchTerm,
  tableFilters,
  setFilters,
  setResult,
  filteredPackageIDs,
}) => {
  const packagesList = get(packagesListData, 'store.packages.edges', [])
  const totalPackages = get(packagesListData, 'store.packages.totalCount', 0)
  const storeBrands = filter(get(packagesListData, 'store.brands', []), brand => !isEmpty(brand.name))
  const storeStrains = filter(get(packagesListData, 'store.strains', []), strain => !isEmpty(strain.name))
  const storeSalesTypes = get(packagesListData, 'store.salesTypes', [])

  const loading = get(packagesListData, 'loading', true)
  const timeSinceLastSynced = fromNowShortHand(get(venueSettings, 'store.packagesLastImportedAt'))
  const [syncLoading, setSyncLoading] = useState(false)

  const packageData = get(filteredPackageIDs, 'store.packages')
  const totalNeedsAttention = get(packageData, 'totalCount')

  useEffect(() => {
    filteredPackageIDs.refetch()
  }, [get(packagesListData, 'store.packages.edges')])

  return (
    <div className={className}>
      <Title>Packages</Title>
      <InventoryNavigationBar />
      <TableActionBar
        buttons={(
          // Do not render if user doesn't have write permissions
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {userPermissions.write && (
              <>
                <Link style={{ textDecoration: 'none' }} to={`packages/fix/${get(packageData, 'edges[0].node.id')}`}>
                  <PackageButtonWithSpinner
                    disabled={!totalNeedsAttention}
                    buttonText="fix packages"
                    boxTopLine="attention"
                    boxBottomLine={`${totalNeedsAttention} PKG`}
                    style={{ marginRight: '8px' }}
                    data={filteredPackageIDs}
                    onClick={() => {
                      ReactGA.event({
                        category: GATypes.eventCategories.packageFixFlow,
                        action: GATypes.eventActions.started,
                      })
                    }}
                  />
                </Link>
                <PackageButtonWithSpinner
                  data={venueSettings}
                  disabled={syncLoading}
                  spinner={syncLoading}
                  onClick={() => {
                    ReactGA.event({
                      category: GATypes.eventCategories.package,
                      action: GATypes.eventActions.synced,
                      label: 'ALL',
                    })
                    metrcImport(setSyncLoading)
                  }}
                  buttonText="metrc sync"
                  boxTopLine="last sync"
                  boxBottomLine={`${timeSinceLastSynced} AGO`}
                />
              </>
            )
          }
          </div>
        )}
        search={
          <SearchBox
            dataSource={packagesList}
            fieldSearchDefinitions={packageSearchConfig}
            setSearchTerm={setSearchTerm}
            setResult={setResult}
            result={tableResult}
            searchTerm={tableSearchTerm}
            total={totalPackages}
            showAllResults
          />
        }
      />
      <Filters setFilters={setFilters}>
        <PackageFiltersForm
          storeBrands={storeBrands}
          storeStrains={storeStrains}
          storeSalesTypes={storeSalesTypes}
          setFilters={setFilters}
          filters={tableFilters}
          setPage={setPage}
        />
      </Filters>
      <SingleItemGrid>
        <TableWrap
          data={packagesList}
          dataSize={get(packagesListData, 'store.packages.totalCount', 0)}
          loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
          loading={loading}
          rowLink={(state, rowInfo) => (`/inventory/packages/${rowInfo.original.node.id}`)}
          pagination={{ paginationState, setPaginationState }}
          searchTerm={tableSearchTerm}
          defaultSorted={defaultSorting}
          multiSort
          table={packagesTable}
          setPage={setPage}
          setSort={setSort}
        />
      </SingleItemGrid>
    </div>
  )
})`
  position: relative;
`

PackagesListPure.propTypes = {
  packagesListData: PropTypes.object,
  defaultSort: PropTypes.arrayOf(PropTypes.object),
  venueSettings: PropTypes.object,
}

const Packages = compose(
  withVenueID,
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('INVENTORY'), // userPermissions
  withTableState,
  withState('paginationState', 'setPaginationState', {
    pageSize: PAGE_SIZE,
    pagesSkipped: INITIAL_PAGES_SKIPPED,
  }),
  withPaginatedPackageList,
  withFilteredPackageIDs,
  withVenueSettings({ needsLoading: false }),
  withQueryErrorPageOnError(['packagesListData', 'venueSettings'], true),
  withNotifications,
  withMetrcImport,
  withFixedHeaderDataTable(),
)(PackagesListPure)

export default Packages
