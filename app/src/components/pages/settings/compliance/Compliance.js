//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { get, round } from 'lodash'
import Button from 'components/common/input/Button'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withVenueSettings } from 'components/Venue'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { Link } from 'react-router-dom'
import { PaginatedTable, TableActionBar, SearchableCellText, TwoLine } from 'components/Table'
import SearchBox from 'components/common/input/PoweredTableSearch'
import { StyledDropDownMenu, StyledMenuItem } from 'components/pages/StyledDropDownMenu'
import { getComplianceList } from 'ops'
import { graphql } from 'api/operationCompat'
import colors from 'styles/colors'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { PAGE_POLL_INTERVAL } from 'constants/Settings'
import FauxLink from 'components/common/display/FauxLink'
import { withState as withComplianceState } from 'store/modules/settings/compliance'
import SettingsNavigation from '../SettingsNavigation'

const SEARCH_TYPE = 'compliance'

const searchObj = [{
  fieldName: 'name',
  searchType: 'fuzzy',
}]

const getFormatedLimit = (amount, unit) => {
  if (amount === 'N/A') return amount
  if (unit === 'GRAMS') return `${round(amount, 2)} g`
  if (unit === 'EACH') return `${amount} count`
  if (unit === 'MILLILITERS') return `${amount} ml`
  if (unit === 'FLUID_OUNCES') return `${amount} fl oz`
  return `${amount}`
}

/* eslint-disable react/prop-types */
const columns = table => [{
  Header: 'Name',
  accessor: 'name',
  Cell: ({ value }) =>
    <FauxLink><SearchableCellText text={value} searchType={SEARCH_TYPE} table={table} /></FauxLink>,
}, {
  Header: <TwoLine top="MEDICAL DAILY" bottom="LIMIT" />,
  accessor: 'limitQuantity.amountMedicalDailylimit',
  Cell: ({ original: { limitQuantity } }) =>
    getFormatedLimit(limitQuantity.amountMedicalDailylimit, limitQuantity.unit),
}, {
  Header: <TwoLine top="MEDICAL MONTHLY" bottom="LIMIT" />,
  accessor: 'limitQuantity.amountMedicalMonthlylimit',
  Cell: ({ original: { limitQuantity } }) =>
    getFormatedLimit(limitQuantity.amountMedicalMonthlylimit, limitQuantity.unit),
}, {
  Header: <TwoLine top="RECREATIONAL TRANSACTION" bottom="LIMIT" />,
  accessor: 'limitQuantity.amountRecreationalTransactionlimit',
  Cell: ({ original: { limitQuantity } }) =>
    getFormatedLimit(limitQuantity.amountRecreationalTransactionlimit, limitQuantity.unit),
}]
/* eslint-enable react/prop-types */

const NewComplianceLimitButton = styled(Button)`
  width: 238px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.white}
`

const styles = {
  iconStyle: {
    color: colors.white,
    fontSize: '12px',
    float: 'right',
    padding: '3px 10px 0px 0px',
  },
}

const NewComplianceDropDown = () => (
  <StyledDropDownMenu
    render={onClick => (
      <NewComplianceLimitButton onClick={onClick} primary>
        New Compliance Limit <ProductIcon type="dropDown" style={styles.iconStyle} />
      </NewComplianceLimitButton>
    )}
  >
    <StyledLink to="/settings/compliance/new/recreational"><StyledMenuItem>Recreational</StyledMenuItem></StyledLink>
    <StyledLink to="/settings/compliance/new/medical"><StyledMenuItem>Medical</StyledMenuItem></StyledLink>
  </StyledDropDownMenu>
)

// eslint-disable-next-line react/prop-types
const ComplianceTabPure = ({
  userPermissions,
  complianceList,
  complianceListData,
  setSearchTerm,
  setPage,
  setSort,
  setResult,
  setSorted,
  tableResult,
  tableSearchTerm,
  complianceTable,
}) => {
  const dataStore = tableResult || complianceList
  const dataMap = dataStore.map(item => ({
    ...item,
    // add unit to limitQuantity here so it's accessible in sortMethod
    limitQuantity: {
      unit: item.unit,
      amount: item.limitQuantity,
      timeframe: item.timeframe,
      amountMedicalDailylimit: item.timeframe === 'DAILY' ? item.limitQuantity : 'N/A',
      amountMedicalMonthlylimit: item.timeframe === 'MONTHLY' ? item.limitQuantity : 'N/A',
      amountRecreationalTransactionlimit: item.timeframe === 'TRANSACTION' ? item.limitQuantity : 'N/A',
    },
  }))

  return (
    <div>
      <Title>Compliance</Title>
      <SettingsNavigation />
      <TableActionBar
        buttons={
          // Do not render if user doesn't have write permissions
          userPermissions.write &&
            <NewComplianceDropDown primary>New Price Group</NewComplianceDropDown>
        }
        search={
          <SearchBox
            dataSource={complianceList}
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
        columns={columns(complianceTable)}
        data={dataMap}
        loadingText={(<Spinner size={6} wrapStyle={{ paddingTop: '48px' }} />)}
        loading={get(complianceListData, 'loading', true)}
        rowLink={(state, rowInfo) => (`/settings/compliance/details/${rowInfo.original.id}`)}
        defaultSorted={[{
              id: 'name',
              desc: false,
            }]}
        searchedTerm={tableSearchTerm}
        setPage={setPage}
        setSort={setSort}
        table={complianceTable}
        setSorted={setSorted}
      />
    </div>
  )
}

ComplianceTabPure.propTypes = {
  userPermissions: UserPermissionsPropType,
  complianceList: PropTypes.arrayOf(PropTypes.object),
  complianceListData: PropTypes.object,
  setSearchTerm: PropTypes.func,
  setSort: PropTypes.func,
  setResult: PropTypes.func,
  setPage: PropTypes.func,
  setSorted: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  tableSearchTerm: PropTypes.string,
  complianceTable: PropTypes.object,
}

const ComplianceTab = compose(
  withAuthenticatedEmployee, // authenticatedUserData
  withComplianceState,
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withVenueSettings(),
  graphql(getComplianceList, {
    name: 'complianceListData',
    options: ({ selectedVenueId }) => ({
      variables: {
        storeID: selectedVenueId,
      },
      pollInterval: PAGE_POLL_INTERVAL,
    }),
    props: ({ complianceListData, ...props }) => ({
      complianceListData,
      complianceList: get(complianceListData, 'store.complianceLimits.edges', []).map(({ node }) => node),
      ...props,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withQueryErrorPageOnError('complianceListData', true),
)(ComplianceTabPure)

export default ComplianceTab
