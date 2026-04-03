//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import usePrevProps from 'utils/globalHook'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { get, lastIndexOf } from 'lodash'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Button from 'components/common/input/Button'
import NotificationsTable from 'components/Alerts/NotificationsTable'
import DropDownMenu from 'components/common/navigation/DropDownMenu'
import MenuItem from 'components/common/navigation/MenuItem'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ALERTS_POLL_INTERVAL } from 'constants/Settings'
import { compose } from 'recompose'
import { withState as withNotificationsState } from 'store/modules/notifications'
import { withVenueID } from '../Venue'

const styles = {
  notificationDropDown: {
    position: 'absolute',
    top: '-19px',
    right: '-28px',
    backgroundColor: colors.blackLight,
    color: colors.white,
    boxShadow: `0 3px 4px 0 ${colors.trans.black30}`,
    width: '473px',
    paddingTop: '7px',
    paddingRight: '0px',
    paddingLeft: '0px',
    whiteSpace: 'initial',
    zIndex: '1000',
    overflow: 'hidden',
  },
  notificationTriangle: {
    position: 'absolute',
    top: '-25px',
    left: '3px',
    borderBottom: `6px solid ${colors.blackLight}`,
  },
  link: {
    textDecoration: 'none',
  },
}

const NotificationsIcon = styled(ProductIcon)`
  font-size: 20px;
  color: ${colors.blue};
  cursor: pointer;
`

const AvatarButtonDiv = styled.div`
  cursor: pointer;
`

const NotificationsSection = styled.div`
  position: absolute;
  top: 18px;
  right: 70px;
  z-index: 9999;
`

const StyledNotificationItem = styled(MenuItem)`
  font-size: 12px;
  margin-bottom: -2px;
  background-color: #1c1c1c;
  :hover{
    background-color: #1c1c1c;
    border-color: ${colors.blue};
    color: ${colors.blue};
  }
`

const Badge = styled.div`
  color: ${colors.white};
  background-color: ${colors.red};
  border-radius: 35px;
  min-width: 16px;
  height: 16px;
  border: solid 1px ${colors.white};
  font-size: 10px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 16px;
  letter-spacing: normal;
  text-align: center;
  position: absolute;
  top: -7px;
  right: -7px;
  user-select: none;
  padding: 1px;
`

const StyledButton = styled(Button)`
  font-size: 11px;
  background: transparent;
  border-color: white;
  box-shadow: none;
  color: white;
  border-radius: 4px;
  font-weight: normal;
  height: 22px;
  margin: 10px 0px;
  :hover {
    background-color: ${colors.blue};
  }
`

const resetNotifications = (storeAlertsData, setPage, totalUnseenCountData) => {
  totalUnseenCountData.startPolling(ALERTS_POLL_INTERVAL)
  storeAlertsData.refetch({
    pageSize: 10,
    pagesSkipped: 0,
  })
  setPage(1)
}

const NotificationsBadge = ({
  notifications,
  storeAlertsData,
  dismissAlert,
  style,
  setNotificationsSeen,
  dismissAll,
  history,
  totalUnseenCount,
  totalUnseenCountData,
  selectedVenueId,
  notificationsUnseen,
  setNotificationsUnseen,
}) => {
  const [page, setPage] = useState(1)
  const [menuShown, setMenuShown] = useState(false)
  const prevProps = usePrevProps({ totalUnseenCount })

  useEffect(() => {
    setNotificationsUnseen({ count: totalUnseenCount })
    if (prevProps && prevProps.totalUnseenCount < totalUnseenCount) {
      storeAlertsData.refetch({
        pageSize: 10,
        pagesSkipped: 0,
      })
    }
  }, [totalUnseenCount])

  return (
    <NotificationsSection>
      <DropDownMenu
        style={{
          backgroundColor: colors.black,
          width: '456px',
        }}
        render={onClick => (
          <AvatarButtonDiv onClick={() => {
            setMenuShown(!menuShown)
            if (menuShown) {
              totalUnseenCountData.startPolling(ALERTS_POLL_INTERVAL)
            } else {
              totalUnseenCountData.stopPolling()
              setNotificationsUnseen({ count: 0 })
            }
            setNotificationsSeen({
              storeId: selectedVenueId,
            })
            onClick()
          }}
          >
            <NotificationsIcon type="notifications" />
            {get(notificationsUnseen, 'count') > 0 &&
              <Badge>
                {(get(notificationsUnseen, 'count') > 9) ? '9+' : get(notificationsUnseen, 'count')}
              </Badge>
            }
          </AvatarButtonDiv>
        )}
        menuStyle={styles.notificationDropDown}
        triangleStyle={styles.notificationTriangle}
        resetNotifications={
          () => resetNotifications(storeAlertsData, setPage, totalUnseenCountData)
        }
        menuDisplayed={menuShown}
        onClickOutside={() => setMenuShown(false)}
      >
        <StyledNotificationItem>
          <StyledButton
            onClick={() => {
              dismissAll()
              // Possibly also mark all as seen? Right now all will already be marked as seen
            }}
          >
            MARK ALL AS READ
          </StyledButton>
        </StyledNotificationItem>
        <NotificationsTable
          storeAlerts={notifications}
          storeAlertsData={storeAlertsData}
          dismissAlert={dismissAlert}
          style={style}
          history={history}
          setMenuShown={setMenuShown}
          dropDown
        />
        {notifications.length !== get(storeAlertsData, 'store.portalNotifications.totalCount') &&
          <StyledNotificationItem onClick={() => {
            setPage(page + 1)
            storeAlertsData.fetchMore({
              variables: {
                pageSize: 10,
                pagesSkipped: page,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                // Scroll to the last notification
                const lastItem = lastIndexOf(get(prev, 'store.portalNotifications.edges'))
                setTimeout(() => {
                  const element = document.getElementById(`notification-${lastItem}`)
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                })
                return prev.store && {
                  store: {
                    ...prev.store,
                    portalNotifications: {
                      ...get(prev, 'store.portalNotifications'),
                      edges: [
                        ...get(prev, 'store.portalNotifications.edges'),
                        ...get(fetchMoreResult, 'store.portalNotifications.edges'),
                      ],
                    },
                  },
                }
              },
            })
          }}
          >
            SHOW MORE
          </StyledNotificationItem>
        }
        <Link
          to="/notifications"
          style={styles.link}
          onClick={() => {
            storeAlertsData.refetch({
              pageSize: 50,
              pageSkipped: 0,
            })
          }}
        >
          <StyledNotificationItem>
            VIEW ALL NOTIFICATIONS
          </StyledNotificationItem>
        </Link>
      </DropDownMenu>
    </NotificationsSection>
  )
}

NotificationsBadge.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeAlertsData: PropTypes.object, // GQL object, needed for polling, etc.
  style: PropTypes.object,
  setNotificationsSeen: PropTypes.func,
  dismissAlert: PropTypes.func,
  dismissAll: PropTypes.func,
  history: PropTypes.object,
  totalUnseenCount: PropTypes.number,
  totalUnseenCountData: PropTypes.object,
  selectedVenueId: PropTypes.string,
  notificationsUnseen: PropTypes.object,
  setNotificationsUnseen: PropTypes.func,
}

export default compose(
  withVenueID,
  withNotificationsState,
)(NotificationsBadge)
