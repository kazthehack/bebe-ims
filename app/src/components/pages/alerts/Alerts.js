//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { get } from 'lodash'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import Spinner from 'components/common/display/Spinner'
import { withVenueID } from 'components/Venue'
import { renderWhileLoading } from 'utils/hoc'
import withAlerts from 'components/Alerts/withAlerts'
import withDismissAlert from 'components/Alerts/withDismissAlert'
import { withQueryErrorPageOnError } from 'components/pages/ErrorPage'
import NotificationsTable from 'components/Alerts/NotificationsTable'
import withSetNotificationsSeen from 'components/Alerts/withSetNotificationsSeen'
import withDismissAll from 'components/Alerts/withDismissAll'
import { withState as withTableState } from 'store/modules/notifications'
import SearchBox from 'components/common/input/PoweredTableSearch'
import colors from 'styles/colors'

/*
 * adds a 30 second delay to restart polling,
 * so the user can have time to change their mind, and not get 'polled over'
*/
// questionable how helpful this is, doesn't seem to be working as it used to now that we are
// polling notifications from 2 different plaes, however it does seem to help a little bit
// Keeping commented for now
/* function delayStartPolling(startPolling) {
  setTimeout(() => {
    startPolling(ALERTS_POLL_INTERVAL)
  }, 30000)
} */

const StyledTab = styled.button`
  max-width: 110px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.43px;
  text-align: center;
  color: ${colors.blue};
  background-color: transparent;
  border: none;
  outline:none;
  cursor: pointer;
  &.active {
    border-bottom: 2px solid ${colors.blue};
  }
`

const StyledActionItem = styled.div`
  height: 18px;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.54px;
  text-align: right;
  color: #1875f0;
  cursor: pointer;
  margin-bottom: 10px;
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const searchObj = [{
  fieldName: 'eventTs',
  searchType: 'fuzzy',
}, {
  fieldName: 'eventBody',
  searchType: 'exact',
}]

// added unread flag for the background color of each row, not sure if correct
const Alerts = ({
  storeAlerts,
  storeAlertsData,
  totalNumAlerts,
  dismissAlert,
  setNotificationsSeen,
  history,
  dismissAll,
  notificationsTable,
  tableResult,
  tableSearchTerm,
  setSearchTerm,
  setResult,
  setPage,
  selectedVenueId,
  tableFilter,
  setFilter,
}) => {
  useEffect(() => {
    setNotificationsSeen({
      storeId: selectedVenueId,
    })
  })
  useEffect(() => {
    setResult({
      result: get(storeAlertsData, 'store.portalNotifications.edges', []).map(data => data.node),
    })
  }, [get(storeAlertsData, 'store.portalNotifications.edges')])
  const changeTab = ({ level }) => {
    setFilter({ level })
    setPage({ page: 0 }) // to reset the pagination
  }
  const totalAlerts = get(storeAlertsData, 'store.portalNotifications.totalCount', 0)
  return (
    <PageContent title="Notifications">
      <StyledHeader>
        <SearchBox
          dataSource={storeAlerts}
          fieldSearchDefinitions={searchObj}
          setSearchTerm={setSearchTerm}
          setResult={setResult}
          result={tableResult}
          searchTerm={tableSearchTerm}
          total={totalAlerts}
          showAllResults
        />
        {/* Tab links */}
        <div className="tab">
          <StyledTab className={`tablinks ${tableFilter === undefined ? 'active' : ''}`} onClick={() => changeTab({ level: undefined })}>ALL NOTIFICATIONS</StyledTab>
          <StyledTab className={`tablinks ${tableFilter === 'warning' ? 'active' : ''}`} onClick={() => changeTab({ level: 'warning' })}>WARNINGS ONLY</StyledTab>
          <StyledTab className={`tablinks ${tableFilter === 'info' ? 'active' : ''}`} onClick={() => changeTab({ level: 'info' })}>INFORMATIONAL ONLY</StyledTab>
        </div>
        <div style={{ textAlign: 'right' }}>
          <StyledActionItem
            onClick={() => {
              dismissAll()
            }}
          >
          MARK ALL AS READ
          </StyledActionItem>
        </div>
      </StyledHeader>
      {/* Tab content */}
      <NotificationsTable
        className="tabcontent"
        storeAlerts={storeAlerts}
        storeAlertsData={storeAlertsData}
        totalNumAlerts={totalNumAlerts}
        loadingText={(<Spinner size={6} interval={2} wrapStyle={{ paddingTop: '48px' }} />)}
        loading={storeAlerts ? storeAlerts.loading : true}
        dismissAlert={dismissAlert}
        dismissAll={dismissAll}
        history={history}
        getTrProps={(state, rowInfo) => ({
          style: {
            backgroundColor: get(rowInfo.original, 'dismissedAt') ? '#ffffff' : '#dae6f7',
            height: '40px',
          },
        })}
        tableResult={tableResult}
        setPage={setPage}
        notificationsTable={notificationsTable}
        tableSearchTerm={tableSearchTerm}
      />
    </PageContent>
  )
}

Alerts.propTypes = {
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
  dismissAlert: PropTypes.func.isRequired,
  setNotificationsSeen: PropTypes.func.isRequired,
  history: PropTypes.object,
  totalNumAlerts: PropTypes.number,
  dismissAll: PropTypes.func,
  setPage: PropTypes.func,
  tableResult: PropTypes.arrayOf(PropTypes.object),
  notificationsTable: PropTypes.object,
  selectedVenueId: PropTypes.string,
  setSearchTerm: PropTypes.func,
  setResult: PropTypes.func,
  tableSearchTerm: PropTypes.string,
  tableFilter: PropTypes.string,
  setFilter: PropTypes.func,
}

export default compose(
  withVenueID,
  withTableState,
  withAlerts, // storeAlertsData
  withDismissAlert,
  withDismissAll,
  withSetNotificationsSeen,
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, 'storeAlertsData', 'selectedVenueId'),
  withQueryErrorPageOnError('storeAlertsData', true),
)(Alerts)
