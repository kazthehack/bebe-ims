//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { StatusColumn, PaginatedTable, TwoLine, withFixedHeaderDataTable, TableActionBar, SearchableCellText } from 'components/Table'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { withState as withTableState } from 'store/modules/settings/discounts'
import { StyledTitle } from 'components/pages/settings/SettingsStyles'
import Spinner from 'components/common/display/Spinner'
import { ProductIcon } from 'components/common/display/ProductIcon'
import colors from 'styles/colors'
import Button from 'components/common/input/Button'
import { Link } from 'react-router-dom'
import { StyledDropDownMenu, StyledMenuItem } from 'components/pages/StyledDropDownMenu'
import { graphql } from 'api/operationCompat'
import { compose } from 'recompose'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { withVenueID } from 'components/Venue'
import { fetchDiscounts } from 'ops'
import { capitalize, get } from 'lodash'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import CrmNavigation from '../CrmNavigation'

const NewDiscountButton = styled(Button)`
  width: 170px;
`
const styles = {
  linkStyle: {
    textDecoration: 'none',
    color: 'white',
  },
  productIcon: {
    color: colors.white,
    fontSize: '12px',
    float: 'right',
    padding: '3px 10px 0px 0px',
  },
}

const searchObj = [{
  fieldName: 'name',
  searchType: 'fuzzy',
}]

const getColumns = table => (
  [{
    ...StatusColumn,
    Header: 'Active',
  }, {
    Header: 'Name',
    accessor: 'name',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => <SearchableCellText text={value} table={table} />,
  }, {
    Header: 'Amount',
    accessor: 'amount',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value, original }) => (
      `${original.category === 'CUSTOM' ? 'Up to ' : ''}${(original.amountType === 'PERCENTAGE') ? `${value}% off` : `$${value} off`}`
    ),
    width: 135,
  }, {
    Header: 'Applies to',
    accessor: 'appliesTo',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => capitalize(value),
    width: 125,
  }, {
    Header: <TwoLine top="Approval" bottom="Required" />,
    accessor: 'requiresApproval',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
    width: 135,
    getHeaderProps: () => ({ style: { padding: '0 27px 0 0', display: 'flex', justifyContent: 'center' } }),
    getTdProps: () => ({ style: { padding: '0 27px 0 0', display: 'flex', justifyContent: 'center' } }),
  }]
)

// eslint-disable-next-line react/prop-types
const DiscountsListPure = ({
  data,
  userPermissions,
  discounts,
  tableResult,
  tableSearchTerm,
  setSearchTerm,
  setResult,
  setSort,
  setPage,
}) => {
  const discountData = get(data, 'store') ? data.store.discounts.edges.map(({ node }) => node) : []
  const unarchivedDiscountData = [...discountData].filter(v => !v.archivedDate)
  const loading = get(data, 'loading', true)

  return (
    <div className="DiscountsListPure">
      <SingleItemGrid>
        <TableActionBar
          buttons={
            // Do not render if user doesn't have write permissions
            get(userPermissions, 'write') && // using a get here to prevent failing test while permission is undefined
            <StyledDropDownMenu
              render={onClick => (
                <NewDiscountButton
                  onClick={onClick}
                  primary
                >
                  New Discount <ProductIcon type="dropDown" style={styles.productIcon} />
                </NewDiscountButton>
              )}
            >
              <Link style={styles.linkStyle} to="/crm/discounts/new/subtotal">
                <StyledMenuItem>Receipt Subtotal</StyledMenuItem>
              </Link>
              <Link style={styles.linkStyle} to="/crm/discounts/new/lineitem">
                <StyledMenuItem>Line Item</StyledMenuItem>
              </Link>
            </StyledDropDownMenu>
          }
          search={
            <SearchBox
              dataSource={unarchivedDiscountData}
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
          columns={getColumns(discounts.table)}
          data={tableResult || unarchivedDiscountData}
          loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
          loading={loading}
          rowLink={(state, rowInfo) => (`/crm/discounts/${rowInfo.original.id}/edit`)}
          defaultSorted={[{
            id: 'active',
            desc: true,
          }, {
            id: 'name',
            desc: false,
          }]}
          getTbodyProps={() => ({ style: { overflow: 'hidden' } })}
          searchedTerm={tableSearchTerm}
          setSort={setSort}
          table={discounts.table}
          setPage={setPage}
        />
      </SingleItemGrid>
    </div>
  )
}

DiscountsListPure.propTypes = {
  data: PropTypes.shape({
    store: PropTypes.shape({
      discounts: PropTypes.shape({
        edges: PropTypes.array.isRequired,
      }).isRequired,
    }),
  }),
  userPermissions: UserPermissionsPropType,
  discounts: PropTypes.object,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  setSort: PropTypes.func,
  setPage: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
}

export const DiscountsList = compose(
  withVenueID,
  graphql(fetchDiscounts, { // TODO: create reusable withDiscounts HOC
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withQueryErrorPageOnError('data', true),
  withTableState,
)(DiscountsListPure)

const DiscountsTabPure = ({ userPermissions }) => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <StyledTitle>Discounts</StyledTitle>
    </div>
    <CrmNavigation />
    <DiscountsList
      userPermissions={userPermissions}
    />
  </div>
)

DiscountsTabPure.propTypes = {
  userPermissions: UserPermissionsPropType,
}

const DiscountsTab = compose(
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withFixedHeaderDataTable(),
)(DiscountsTabPure)

export default DiscountsTab
