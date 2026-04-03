//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import { StatusColumn, withFixedHeaderDataTable, PaginatedTable, CenteredColumn, SearchableCellText } from 'components/Table'
import StatusIcon from 'components/common/display/StatusIcon'
import Subheader from 'components/common/display/Subheader'
import Spinner from 'components/common/display/Spinner'
import colors from 'styles/colors'
import styled from 'styled-components'
import { Icon } from 'components/common/display'

const StyledTable = styled(PaginatedTable)`
  overflow: hidden;

  .rt-table {
    max-height: 335px;
  }
  .rt-th:first-child {
    padding-left: 0px !important;
  }
`

const CenteredIcon = styled(Icon)`
  text-align: center;
`

const columns = [{
  ...StatusColumn,
  accessor: 'node.posActive',
  Cell: ({ original }) => ( // eslint-disable-line react/prop-types
    original.node && <StatusIcon active={original.node.posActive} />
  ),
  Header: 'Active',
  width: 120,
  ...CenteredColumn,
}, {
  accessor: 'node.id',
  Header: 'ID',
  getTdProps: () => ({ style: { color: colors.blue, fontFamily: 'Roboto Condensed, sans-serif' } }),
  width: 140,
  // eslint-disable-next-line react/prop-types
  Cell: ({ original }) => (
    <SearchableCellText text={`${original.node.inventoryId}`} />
  ),
}, {
  accessor: 'node.medicalOnly',
  Header: 'Med',
  sortable: true,
  width: 100,
  Cell: ({ value }) => (value ? <CenteredIcon name="first-aid" /> : null), // eslint-disable-line react/prop-types
  ...CenteredColumn,
}, {
  Header: 'Name',
  accessor: 'node.name',
  width: 200,
  // eslint-disable-next-line react/prop-types
  Cell: ({ original }) => (
    <SearchableCellText text={`${original.node.name}`} />
  ),
}, {
  Header: 'Type',
  accessor: 'node.salesType.name',
  // eslint-disable-next-line react/prop-types
  Cell: ({ original }) => (
    <SearchableCellText text={`${original.node.salesType.name}`} />
  ),
}]

const PriceGroupsAssociatedProductsTable = ({
  data,
  loading,
  // eslint-disable-next-line react/prop-types
  setSorted,
}) => (
  <div style={{ position: 'relative' }}>
    <Subheader
      textSizeOption={2}
      color={colors.blueishGray}
    >
      Attached Products
    </Subheader>
    <SingleItemGrid>
      <StyledTable
        loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
        loading={loading}
        data={data}
        columns={columns}
        rowLink={(state, rowInfo) => (`/inventory/products/edit/${rowInfo.original.node.id}`)}
        defaultSorted={[{
          id: 'node.name',
          desc: false,
        }]}
        setSorted={setSorted}
      />
    </SingleItemGrid>
  </div>
)

PriceGroupsAssociatedProductsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
}

export default compose(
  withFixedHeaderDataTable(),
)(PriceGroupsAssociatedProductsTable)
