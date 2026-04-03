// Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'components/Table'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import styled from 'styled-components'

const StyledTable = styled(Table)`
  .rt-table {
    overflow: hidden;
  }
`

const styleProps = { style: { display: 'flex', justifyContent: 'center' } }

const columns = [{
  accessor: 'totalReceived',
  Header: 'Total received',
  getTdProps: () => styleProps,
  getHeaderProps: () => styleProps,
}, {
  accessor: 'totalSold',
  Header: 'Total sold',
  getTdProps: () => styleProps,
  getHeaderProps: () => styleProps,
}, {
  accessor: 'totalReturned',
  Header: 'Total returned',
  getTdProps: () => styleProps,
  getHeaderProps: () => styleProps,
}, {
  accessor: 'totalLost',
  Header: 'Total loss',
  getTdProps: () => styleProps,
  getHeaderProps: () => styleProps,
}, {
  accessor: 'currentStock',
  Header:
  <Fragment>
    Expected Stock
    <TooltipWithIcon
      text="This is the number expected in your store inventory including resellable returns."
      style={{ marginTop: '1px' }}
    />
  </Fragment>,
  getTdProps: () => styleProps,
  getHeaderProps: () => styleProps,
}]

const NCInventoryTable = ({ data }) => (
  <StyledTable
    data={data}
    columns={columns}
    noHover
    sortable={false}
  />
)

NCInventoryTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default NCInventoryTable
