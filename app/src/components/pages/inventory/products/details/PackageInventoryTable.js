//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table } from 'components/Table'
import colors from 'styles/colors'
import Button from 'components/common/input/Button'
import { get } from 'lodash'
import { compose } from 'recompose'
import withLinkNavigationConfirmation from 'components/Modal/withLinkNavigationConfirmation'
import { packageColumns } from 'components/pages/inventory/packages/Packages'

const CustomRemoveButton = styled(Button)`
  border-radius: 2px;
  border: solid 1px ${colors.red};
  height: 27px;
  width: 104px;
  font-size: 14px;
`

const columns = (values, form) => [{
  ...packageColumns.active,
  accessor: 'active',
}, {
  ...packageColumns.receivedDate,
  accessor: 'dateReceived',
}, {
  ...packageColumns.tag,
  accessor: 'providerInfo.tag',
}, {
  ...packageColumns.name,
  accessor: 'providerInfo.metrcProduct.name',
}, {
  ...packageColumns.facilityName,
  Header: 'Source',
  accessor: 'producerName',
}, {
  ...packageColumns.amountRemaining,
  accessor: 'quantity',
}, {
  accessor: 'remove',
  width: 120,
  Cell: ({ original, row }) => ( // eslint-disable-line react/prop-types
    <CustomRemoveButton
      plainDelete
      onClick={(e) => {
        e.stopPropagation()
        if (get(values.assignedPackages, original.id)) {
          form.change(`assignedPackages.${original.id}`, false)
        } if (get(values.originalAssignedPackages, original.id)) {
          form.change(`originalAssignedPackages.${original.id}`, false)
        }
        values.copyPackages.splice(row._index, 1) // eslint-disable-line no-underscore-dangle
      }}
    >
      Remove
    </CustomRemoveButton>
  ),
}]

const PackageInventoryTable = ({ data, values, form, pristine, onNavAway }) => (
  <Table
    data={data}
    columns={columns(values, form)}
    getTbodyProps={() => ({ style: { maxHeight: '280px' } })}
    getTrProps={(state, rowInfo) => ({
      onClick: () => {
        onNavAway(pristine, `/inventory/packages/${rowInfo.original.id}`)
      },
    })}
  />
)

PackageInventoryTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  values: PropTypes.object,
  pristine: PropTypes.bool,
  form: PropTypes.object,
  onNavAway: PropTypes.func,
}

export default compose(
  withLinkNavigationConfirmation({ title: 'Discard changes', message: 'Discard changes made to this product record?' }),
)(PackageInventoryTable)
