//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import Title from 'components/common/display/Title'
import { TwoLine, PaginatedTable, withFixedHeaderDataTable, TableActionBar, SearchableCellText } from 'components/Table'
import SearchBox from 'components/common/input/PoweredTableSearch'
import withAuthenticatedEmployee from 'components/common/display/withAuthenticatedEmployee'
import Spinner from 'components/common/display/Spinner'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { withState as withTableState } from 'store/modules/crm/customers'
import { get, map } from 'lodash'
import moment from 'moment-timezone'
import { DATE_FORMAT } from 'constants/Settings'
import formatPhoneNumber from 'utils/phoneNumber'
import CrmNavigation from '../CrmNavigation'
import withCustomersList from './withCustomersList'

const searchObj = [{
  fieldName: 'phoneNumber',
  searchType: 'exact',
}, {
  fieldName: 'email',
  searchType: 'fuzzy',
}, {
  fieldName: 'points.current',
  searchType: 'exact',
}, {
  fieldName: 'uuid',
  searchType: 'fuzzy',
}, {
  fieldName: 'joinedDate',
  searchType: 'exact',
}]

const columns = table => [{
  Header: <TwoLine top="Phone" bottom="Number" />,
  accessor: 'phoneNumber',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${formatPhoneNumber(value)}`} table={table} />
  ),
}, {
  Header: 'Email',
  accessor: 'email',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${value}`} table={table} />
  ),
}, {
  Header: 'UUID',
  accessor: 'uuid',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${value}`} table={table} />
  ),
}, {
  Header: <TwoLine top="Current" bottom="Points" />,
  accessor: 'points.current',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${value || 0}`} table={table} />
  ),
}, {
  Header: <TwoLine top="Date" bottom="Joined" />,
  accessor: 'joinedDate',
  Cell: ({ value }) => (value ? moment.tz(value, 'UTC').format(DATE_FORMAT) : ''),
}]

const CustomersListPure = ({
  setSearchTerm,
  setResult,
  tableResult,
  tableSearchTerm,
  setSort,
  setPage,
  customersTable,
  customersList,
}) => {
  const customersArray = map(get(customersList, 'store.loyaltyMembers.edges', []), value => get(value, 'node'))
  return (
    <div>
      <SingleItemGrid>
        <TableActionBar
          search={
            <SearchBox
              dataSource={customersArray}
              fieldSearchDefinitions={searchObj}
              setSearchTerm={setSearchTerm}
              setResult={setResult}
              result={tableResult}
              searchTerm={tableSearchTerm}
              showAllResults
            />
          }
        />
        <PaginatedTable
          columns={columns(customersTable)}
          data={tableResult || customersArray}
          loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
          loading={customersList ? customersList.loading : true}
          defaultSorted={[{
            id: 'name',
            desc: false,
          }]}
          rowLink={(state, rowInfo) => (`/crm/customer/${rowInfo.original.id}`)}
          searchedTerm={tableSearchTerm}
          setSort={setSort}
          setPage={setPage}
          table={customersTable}
        />
      </SingleItemGrid>
    </div>
  )
}

CustomersListPure.propTypes = {
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
  setSort: PropTypes.func,
  setPage: PropTypes.func,
  customersTable: PropTypes.object,
  customersList: PropTypes.object,
}

const CustomersList = compose(
  withTableState,
  withAuthenticatedEmployee,
  withCustomersList,
  withFixedHeaderDataTable(120, {
    width: '1100px',
    widthS: '1100px',
  }),
)(CustomersListPure)

const CustomersTab = () => (
  <div>
    <Title>Customer Relationship Management</Title>
    <CrmNavigation />
    <CustomersList />
  </div>
)

export default CustomersTab
