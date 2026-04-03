//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import colors from 'styles/colors'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Spinner from 'components/common/display/Spinner'
import { Table, PaginatedTable, SearchableCellText } from 'components/Table'
import alertTypeActions from 'components/Alerts/withAlertTypes'
import { fromNowShortHand } from 'utils/strings'
import * as GATypes from 'constants/GoogleAnalyticsTypes'

const NotificationsIcon = styled(ProductIcon)`
  font-size: 20px;
  color: ${({ dropDown }) => (dropDown ? 'white' : '#2e2e2e')};
  margin-left: 11px;
`

const StyledTable = styled(({ dropDown, ...props }) => (
  dropDown ? <Table {...props} /> : <PaginatedTable {...props} noPolling purpose="notifications" />
))`
  background-color: ${({ dropDown }) => (dropDown ? '#323e51' : 'white')};
  .rt-tr > .rt-th:first-child, .rt-td:first-child {
    padding-left: 4px;
  }
  .rt-tbody {
    max-height: ${({ dropDown }) => (dropDown ? '440px' : 'auto')};
    overflow-x: hidden;
  }
  .rt-thead {
    display: none !important;
  }
  .rt-td {
    display: flex;
    align-items: center;
    color: ${({ dropDown }) => (dropDown ? 'white' : '#2e2e2e')};
    font-size: 11px;
  }
  .rt-noData {
    color: ${({ dropDown }) => (dropDown ? 'white' : '#2e2e2e')};
    background-color: ${({ dropDown }) => (dropDown ? '#323e51' : 'white')};
  }
  .rt-tr {
    max-height: 120px;
    height: 100%;
  }
`

const StyledButton = styled(Button)`
  font-size: 11px;
  background: transparent;
  border-color: ${({ dropDown }) => (dropDown ? 'white' : '#2e2e2e')};
  box-shadow: none;
  text-transform: capitalize;
  color: ${({ dropDown }) => (dropDown ? 'white' : '#2e2e2e')};
  border-radius: 4px;
  font-weight: normal;
  height: 22px;
`

const ViewButton = styled(StyledButton)`
  margin-right: 10px;
  width: 44px;
`

const MarkButton = styled(StyledButton)`
  width: 100px;
`

const BodyDiv = styled.div`
  font-weight: 300;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow-wrap: anywhere;
  overflow: hidden;
`

/* eslint-disable react/prop-types */
export const notificationsColumns = ({
  dismissAlert,
  dropDown,
  history,
  setMenuShown,
  table,
}) => ([{
  accessor: 'iconName',
  sortable: false,
  width: 40,
  Cell: ({ value }) => (
    <NotificationsIcon dropDown={dropDown} type={value} />
  ),
}, {
  accessor: 'eventTs',
  sortable: true,
  width: 40,
  style: { fontWeight: 'bold' },
  Cell: ({ value }) => fromNowShortHand(value),
}, {
  accessor: 'eventBody',
  width: dropDown ? 200 : undefined,
  sortable: true,
  style: { fontSize: '13px' },
  Cell: ({ value }) => (
    <BodyDiv>
      <SearchableCellText text={value} table={table} />
    </BodyDiv>
  ),
}, {
  accessor: '', // not really used, but columns need unique accessors to sort properly
  sortable: true,
  width: 175,
  Cell: ({ original }) => {
    const type = get(original, 'notificationType', '').replace('PortalNotificationMetadataType.', '')
    const baseURL = alertTypeActions[type] || '/'
    const url = original.notificationDetails ? baseURL.replace(':', original.notificationDetails)
      : baseURL
    return (
      <span>
        <ViewButton
          dropDown={dropDown}
          onClick={() => {
            ReactGA.event({
              category: GATypes.eventCategories.notification,
              action: GATypes.eventActions.viewed,
              label: type,
            })
            if (setMenuShown) {
              setMenuShown(false)
            }

            history.push(url)

            if (!original.dismissedAt) {
              dismissAlert({
                notificationId: original.id,
                dismissDate: new Date().toISOString(),
              })
            }
          }}
        >
          View
        </ViewButton>
        <MarkButton
          dropDown={dropDown}
          onClick={(e) => {
            e.stopPropagation() // prevent row click action from triggering
            // notification is being dismissed now
            dismissAlert({
              notificationId: original.id,
              dismissDate: (original.dismissedAt)
              ? null
              : new Date().toISOString(), // null -> undismiss
            })
          }}
        >
          {original.dismissedAt ? 'Mark as Unread' : 'Mark as Read'}
        </MarkButton>
      </span>
    )
  },
}])
/* eslint-enable react/prop-types */

const NotificationsTable = ({
  storeAlerts,
  storeAlertsData,
  totalNumAlerts,
  dismissAlert,
  getTrProps = (state, rowInfo) => ({
    style: {
      backgroundColor: get(rowInfo.original, 'dismissedAt') ? '#1c1c1c' : colors.blueDark,
      maxHeight: '120px',
      alignItems: 'flex-start',
    },
    id: `notification-${get(rowInfo, 'row._index')}`,
  }),
  dropDown,
  history,
  setPage,
  tableResult,
  notificationsTable,
  setMenuShown,
  tableSearchTerm,
}) => (
  <StyledTable
    dropDown={dropDown}
    data={tableResult || storeAlerts}
    queryResults={storeAlertsData}
    dataSize={totalNumAlerts}
    columns={
      notificationsColumns({
        dismissAlert,
        dropDown,
        history,
        setMenuShown,
        table: notificationsTable,
      })
    }
    isManual
    loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
    loading={storeAlerts ? storeAlerts.loading : true}
    getTrProps={getTrProps}
    setPage={setPage}
    table={notificationsTable}
    searchedTerm={tableSearchTerm}
  />
)

NotificationsTable.propTypes = {
  storeAlerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    iconName: PropTypes.string,
    eventTs: PropTypes.string,
    eventBody: PropTypes.string,
    notificationDetails: PropTypes.string,
    notificationType: PropTypes.string,
    read: PropTypes.bool,
  })),
  storeAlertsData: PropTypes.object, // GQL object, needed for polling, etc.
  dismissAlert: PropTypes.func,
  getTrProps: PropTypes.func,
  dropDown: PropTypes.bool,
  history: PropTypes.object,
  totalNumAlerts: PropTypes.number,
  setPage: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  notificationsTable: PropTypes.object,
  setMenuShown: PropTypes.func,
  tableSearchTerm: PropTypes.string,
}

export default NotificationsTable
