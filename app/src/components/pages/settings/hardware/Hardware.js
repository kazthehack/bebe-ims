//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { v4 as uuid } from 'uuid'
import { compose } from 'recompose'
import { graphql } from 'api/operationCompat'
import { fetchHardware } from 'ops'
import { renderIfEmpty, renderWhileLoading } from 'utils/hoc'
import withAuthenticatedEmployee, { withPermissions, UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { Table, StatusColumn, TwoLine } from 'components/Table'
import Spinner from 'components/common/display/Spinner'
import Title from 'components/common/display/Title'
import Button from 'components/common/input/Button'
import { withModals } from 'components/Modal'
import { withVenueID } from 'components/Venue'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import { ALERTS_POLL_INTERVAL } from 'constants/Settings'

import HardwareRemoveModal from './modals/HardwareRemoveModal'
import SettingsNavigation from '../SettingsNavigation'

const styles = {
  marginLR: {
    marginRight: '40px',
    marginLeft: '40px',
  },
  marginR: {
    marginRight: '40px',
  },
}

const RemoveButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 20px;
`

const StyledDiv = styled.div`
  width: 100%;
  position: relative;
`

const HardwareRow = styled.div`
  & > h4 {
    color: ${colors.grayDark2};
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform:uppercase;
    line-height: normal;
  }
  &:not(:first-child) {
      margin-top: 96px;
  }
`

// TODO: Handle 'installed'
const columns = [{
  ...StatusColumn,
  Header: 'Installed',
  accessor: 'installed',
}, {
  Header: <TwoLine top="hardware" bottom="type" />,
  accessor: 'type',
  Cell: ({ value }) => value || '',
  style: styles.marginLR,
  headerStyle: styles.marginLR,
  width: 135,
}, {
  Header: 'Model',
  accessor: 'model',
  Cell: ({ value }) => value,
  style: styles.marginLR,
  headerStyle: styles.marginLR,
}, {
  Header: 'IP Address',
  accessor: 'ip',
  Cell: ({ value }) => value,
  style: styles.marginLR,
  headerStyle: styles.marginLR,
  width: 135,
}, {
  Header: <TwoLine top="mac" bottom="address" />,
  accessor: 'mac',
  Cell: ({ value }) => value,
  style: styles.marginLR,
  headerStyle: styles.marginLR,
  width: 135,
}]

const hardwareTypeNames = {
  LABEL_PRINTER: 'Label Printer',
  RECEIPT_PRINTER: 'Receipt Printer',
  SCALE: 'Scale',
  BARCODE_SCANNER: 'Barcode Scanner',
  CASH_DRAWER: 'Cash Drawer',
}

const getHardwareData = hardware =>
  hardware.map(({ hardwareType, model, ipAddress, macAddress }) => ({
    type: hardwareTypeNames[hardwareType],
    model,
    ip: ipAddress,
    mac: macAddress,
  }))

// eslint-disable-next-line react/prop-types
const HardwareListPure = ({ pushModal, popModal, data, userPermissions, setSorted }) => (
  <div className="HardwareListPure">
    {data.store.terminals.edges.map(({ node = {} }) => (
      <Fragment key={node.name}>
        <HardwareRow key={uuid()}>
          <h4>{node.name}</h4>
          <div>
            <Table
              columns={columns}
              data={getHardwareData(node.hardware)}
              noHover
              defaultSorted={[{
                id: 'installed',
                desc: false,
              }, {
                id: 'type',
                desc: false,
              }]}
              style={{
                minWidth: '100%',
                display: 'inline-block',
              }}
              setSorted={setSorted}
            />
          </div>
          <StyledDiv>
            {userPermissions.write &&
            <RemoveButton primary onClick={() => pushModal(`HardwareRemoveModalPure-${node.name}`)}>
              REMOVE TERMINAL
            </RemoveButton>
            }
          </StyledDiv>
        </HardwareRow>
        <HardwareRemoveModal
          onRequestClose={popModal}
          name={node.name}
          terminalId={node.id}
        />
      </Fragment>
    ))}
  </div>
)

HardwareListPure.propTypes = {
  userPermissions: UserPermissionsPropType,
  pushModal: PropTypes.func,
  popModal: PropTypes.func,
  data: PropTypes.shape({
    store: PropTypes.shape({
      terminals: PropTypes.shape({
        edges: PropTypes.array.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
}

export const HardwareListWithModal = withModals(HardwareListPure)

// Blocked on login / passing through current store info
export const HardwareList = compose(
  withVenueID,
  graphql(fetchHardware, {
    options: props => ({
      variables: {
        storeID: props.selectedVenueId,
      },
      pollInterval: ALERTS_POLL_INTERVAL,
    }),
    skip: ({ selectedVenueId }) => !selectedVenueId,
  }),
  withAuthenticatedEmployee, // authenticatedUserData
  withPermissions('BASIC_SETTINGS'), // userPermissions
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '200px' }} />),
  withQueryErrorPageOnError('data', true),
  renderIfEmpty(
    () => <div>There is no hardware to display.</div>,
    ({ data }) => data.store.terminals.edges,
  ),
)(HardwareListWithModal)

export const Hardware = () => (
  <div>
    <Title>POS Hardware</Title>
    <SettingsNavigation />
    <HardwareList />
  </div>
)
