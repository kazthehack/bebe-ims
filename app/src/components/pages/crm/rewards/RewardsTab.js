//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { StatusColumn, PaginatedTable, withFixedHeaderDataTable, TableActionBar, SearchableCellText } from 'components/Table'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { StyledDropDownMenu, StyledMenuItem } from 'components/pages/StyledDropDownMenu'
import Spinner from 'components/common/display/Spinner'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { withState as withTableState } from 'store/modules/crm/rewards'
import { Link } from 'react-router-dom'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import Title from 'components/common/display/Title'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { get, map, capitalize } from 'lodash'
import CrmNavigation from '../CrmNavigation'
import withRewardsList from './withRewardsList'

const StyledArrowIcon = styled(ProductIcon)`
  color: white;
  font-size: 12px;
  float: right;
  padding: 3px 4px 0px 0px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`

const searchObj = [{
  fieldName: 'name',
  searchType: 'fuzzy',
}, {
  fieldName: 'amount',
  searchType: 'exact',
}, {
  fieldName: 'appliesTo',
  searchType: 'exact',
}, {
  fieldName: 'pointCost',
  searchType: 'exact',
}]

const columns = table => [{
  ...StatusColumn,
}, {
  Header: 'Name',
  accessor: 'name',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${value}`} table={table} />
  ),
}, {
  Header: 'Amount',
  accessor: 'amount',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value, original }) => (
    <SearchableCellText text={`${original.amountType !== 'PERCENTAGE' ? '$' : ''}${value}${original.amountType === 'PERCENTAGE' ? '%' : ''} off`} table={table} />
  ),
}, {
  Header: 'Applies To',
  accessor: 'appliesTo',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${capitalize(value)}`} table={table} />
  ),
}, {
  Header: 'Points Cost',
  accessor: 'pointCost',
  // eslint-disable-next-line react/prop-types
  Cell: ({ value }) => (
    <SearchableCellText text={`${value}`} table={table} />
  ),
}]

const NewRewardButton = () => (
  <StyledDropDownMenu
    render={onClick => (
      <Button primary onClick={onClick}>
        New Reward <StyledArrowIcon type="dropDown" />
      </Button>
    )}
  >
    <StyledLink to="/crm/rewards/new/subtotal">
      <StyledMenuItem>Receipt Subtotal</StyledMenuItem>
    </StyledLink>
    {/* Removed fo the 0.12 release */}
    {/* <StyledLink to="/crm/rewards/new/lineitem">
      <StyledMenuItem>Line Item</StyledMenuItem>
    </StyledLink> */}
  </StyledDropDownMenu>
)

const RewardsListTab = ({
  setSearchTerm,
  setResult,
  tableResult,
  tableSearchTerm,
  setSort,
  setPage,
  rewardsTable,
  rewardsList,
  userPermissions,
}) => {
  const rewards = map(get(rewardsList, 'store.rewards.edges'), reward => reward.node)
  return (
    <div>
      <SingleItemGrid>
        <TableActionBar
          buttons={
            userPermissions.write &&
            <NewRewardButton />
          }
          search={
            <SearchBox
              dataSource={rewards}
              fieldSearchDefinitions={searchObj}
              type={'rewards'}
              setSearchTerm={setSearchTerm}
              setResult={setResult}
              result={tableResult}
              searchTerm={tableSearchTerm}
              showAllResults
            />
          }
        />
        <PaginatedTable
          columns={columns(rewardsTable)}
          data={tableResult || rewards}
          loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
          loading={rewardsList ? rewardsList.loading : true}
          defaultSorted={[{
            id: 'active',
            desc: true,
          }]}
          rowLink={(state, rowInfo) => (`/crm/rewards/${rowInfo.original.id}/edit`)}
          searchedTerm={tableSearchTerm}
          setSort={setSort}
          setPage={setPage}
          table={rewardsTable}
        />
      </SingleItemGrid>
    </div>
  )
}

RewardsListTab.propTypes = {
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
  setSort: PropTypes.func,
  setPage: PropTypes.func,
  rewardsTable: PropTypes.arrayOf(PropTypes.object),
  rewardsList: PropTypes.object,
  userPermissions: UserPermissionsPropType,
}

const RewardsList = compose(
  withTableState,
  withAuthenticatedEmployee,
  withPermissions('BASIC_SETTINGS'),
  withRewardsList,
  withFixedHeaderDataTable(120, {
    width: '1100px',
    widthS: '1100px',
  }),
)(RewardsListTab)

const RewardsTab = () => (
  <div>
    <Title>Customer Relationship Management</Title>
    <CrmNavigation />
    <RewardsList />
  </div>
)

export default RewardsTab
