import React from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import colors from 'styles/colors'
import withAuthenticatedEmployee, { withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { withFixedHeaderDataTable, StatusColumn, PaginatedTable, TwoLine, TableActionBar, SearchableCellText } from 'components/Table'
import SearchBox from 'components/common/input/PoweredTableSearch'
import Button from 'components/common/input/Button'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import { get } from 'lodash'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { StyledDropDownMenu, StyledMenuItem } from 'components/pages/StyledDropDownMenu'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { titleCase } from 'utils/strings'
import { withState as withTableState } from 'store/modules/settings/taxes'
import { withVenueSettings } from 'components/Venue'

import withTaxList, { TaxListPropTypes } from './withTaxList'
import SettingsNavigation from '../SettingsNavigation'

const NewTaxButton = styled(Button)`
  width: 140px; // prevents dropdown buttons from having dropdown menus overflow to the right
`
const styles = {
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  wrapper: {
    width: '100%',
  },
  iconStyle: {
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

const tax = ({ table, enableDareMode }) => {
  const columns = [
    {
      ...StatusColumn,
      Header: 'Active',
    }, {
      Header: 'Name',
      accessor: 'name',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <SearchableCellText text={`${value}`} table={table} />,
    }, {
      Header: 'Amount',
      accessor: 'amount',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value, original }) => ((original.amountType === 'PERCENTAGE') ? `${value}%` : `$${value}`),
      width: 110,
    },
  ]
  if (!enableDareMode) {
    columns.push({
      Header: 'Tax Type',
      accessor: 'appliesTo',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => titleCase(value),
      width: 135,
    }, {
      Header: <TwoLine top="CUSTOMER" bottom="TYPE" />,
      accessor: 'customerType',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => titleCase(value),
      width: 135,
    })
  }
  return columns
}

const NewTaxButtonMenu = ({ enableDareMode }) => (
  <StyledDropDownMenu
    render={onClick => (
      <NewTaxButton onClick={onClick} primary>
        New Tax <ProductIcon type="dropDown" style={styles.iconStyle} />
      </NewTaxButton>
    )}
  >
    <Link style={styles.link} to="/settings/taxes/new/subtotal">
      <StyledMenuItem>Receipt Subtotal</StyledMenuItem>
    </Link>
    { !enableDareMode &&
      <Link style={styles.link} to="/settings/taxes/new/lineitem">
        <StyledMenuItem>Line Item</StyledMenuItem>
      </Link>
    }
  </StyledDropDownMenu>
)

NewTaxButtonMenu.propTypes = {
  enableDareMode: PropTypes.bool,
}

export const TaxListPure = ({
  taxList,
  taxListData,
  userPermissions,
  setSorted,
  taxesTable,
  tableSearchTerm,
  tableResult,
  setSort,
  setPage,
  setResult,
  setSearchTerm,
  venueSettings,
}) => (
  <div className="TaxListPure">
    <SingleItemGrid>
      <TableActionBar
        buttons={
            // Do not render if user doesn't have write permissions
            userPermissions.write &&
            <NewTaxButtonMenu enableDareMode={get(venueSettings, 'store.settings.enableDareMode')} />
          }
        search={
          <SearchBox
            dataSource={taxList}
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
        columns={tax({ table: taxesTable, enableDareMode: get(venueSettings, 'store.settings.enableDareMode') })}
        data={tableResult || taxList}
        loadingText={(<Spinner size={6} wrapStyle={{ paddingTop: '48px' }} />)}
        loading={get(taxListData, 'loading', true)}
        rowLink={(state, rowInfo) => (`/settings/taxes/${rowInfo.original.id}/edit`)}
        defaultSorted={[{
            id: 'name',
            desc: false,
          }]}
        getTrProps={() => ({ className: 'row-taxlist tableHover' })}
        searchedTerm={tableSearchTerm}
        setSorted={setSorted}
        table={taxesTable}
        setSort={setSort}
        setPage={setPage}
      />
    </SingleItemGrid>
  </div>
)

TaxListPure.propTypes = {
  ...TaxListPropTypes,
}

export const TaxList = compose(
  withTaxList({ name: 'taxListData' }),
  withVenueSettings({ name: 'venueSettings' }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  withQueryErrorPageOnError('taxListData', true),
  withFixedHeaderDataTable(20),
  withTableState,
)(TaxListPure)

const Taxes = () => (
  <div style={styles.wrapper}>
    <Title>Taxes</Title>
    <SettingsNavigation />
    <TaxList />
  </div>
)

export default Taxes
