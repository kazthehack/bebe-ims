//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import Avatar from 'components/common/display/Avatar'
import DropDownMenu from 'components/common/navigation/DropDownMenu'
import MenuItem from 'components/common/navigation/MenuItem'
import { Link, withRouter } from 'react-router-dom'
import withAuthenticatedEmployee from 'components/common/display/withAuthenticatedEmployee'
import { withLogout } from 'components/Auth'
import { renderWhileLoading } from 'utils/hoc'
import { compose, withProps } from 'recompose'
import withAlerts from 'components/Alerts/withAlerts'
import withTotalUnseenCount from 'components/Alerts/withTotalUnseenCount'
import withDismissAlert from 'components/Alerts/withDismissAlert'
import NotificationsBadge from 'components/Alerts/NotificationsBadge'
import withSetNotificationsSeen from 'components/Alerts/withSetNotificationsSeen'
import withDismissAll from 'components/Alerts/withDismissAll'
import { graphql } from 'api/operationCompat'
import { logoutUser } from 'ops'

const styles = {
  section: {
    padding: 0,
    position: 'relative',
    width: '100px',
    height: '50px',
  },
  notificationsSection: {
    position: 'absolute',
    top: '18px',
    right: '70px',
  },
  notificationsIcon: {
    fontSize: '20px',
    color: colors.blue,
    cursor: 'pointer',
  },
  drawer: {
    backgroundColor: colors.white,
    position: 'absolute',
    right: '-78px',
    border: 'solid 5px',
    borderColor: colors.blue,
  },
  avatarSection: {
    position: 'absolute',
    top: '13px',
    right: '24px',
    zIndex: 9999,
  },
  avatarButton: {
    cursor: 'pointer',
  },
  notificationDropDown: {
    position: 'absolute',
    top: '-19px',
    right: '-28px',
    backgroundColor: colors.black,
    color: colors.white,
    boxShadow: `0 3px 4px 0 ${colors.trans.black30}`,
    width: '455px',
    paddingTop: '5px',
    paddingRight: '0px',
    paddingLeft: '0px',
    whiteSpace: 'initial',
  },
  avatarDropDown: {
    position: 'absolute',
    top: '-19px',
    right: '-28px',
    boxShadow: `0 3px 4px 0 ${colors.trans.black30}`,
    width: '170px',
    height: '100px',
    color: colors.white,
  },
  notificationTriangle: {
    position: 'absolute',
    top: '-25px',
    left: '3px',
    borderBottom: `6px solid ${colors.black}`,
  },
  avatarTriangle: {
    position: 'absolute',
    top: '-25px',
    left: '8px',
    borderBottom: '6px solid rgba(28, 28, 28, 0.72)',
  },
  link: {
    textDecoration: 'none',
  },
}

const StyledMenuItem = styled(MenuItem)`
  justify-content: flex-start;
  padding-left: 26px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
`

const AvatarColumn = ({ currentUser, logout, doLogout }) => {
  const doLogoutUser = () => {
    doLogout().then(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    logout()
  }
  return (
    <div style={styles.avatarSection}>
      <DropDownMenu
        render={onClick => (
          <div onClick={onClick} style={styles.avatarButton} >
            <Avatar
              fullName={currentUser.name}
            />
          </div>
        )}
        menuStyle={styles.avatarDropDown}
        triangleStyle={styles.avatarTriangle}
      >
        <Link to="/profile" style={styles.link}>
          <StyledMenuItem>Profile</StyledMenuItem>
        </Link>
        <Link to="/login" style={styles.link}>
          <StyledMenuItem onClick={doLogoutUser}>
            Logout
          </StyledMenuItem>
        </Link>
      </DropDownMenu>
    </div>
  )
}

AvatarColumn.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  logout: PropTypes.func,
  doLogout: PropTypes.func,
}

const PureUserSection = ({
  authenticatedUserData,
  logout,
  storeAlerts,
  history,
  storeAlertsData,
  setNotificationsSeen,
  dismissAlert,
  dismissAll,
  totalUnseenCount,
  totalUnseenCountData,
  doLogout,
}) => (
  <div style={styles.section}>
    <NotificationsBadge
      notifications={storeAlerts}
      history={history}
      storeAlertsData={storeAlertsData}
      currentUser={authenticatedUserData.viewer}
      setNotificationsSeen={setNotificationsSeen}
      dismissAlert={dismissAlert}
      dismissAll={dismissAll}
      totalUnseenCount={totalUnseenCount}
      totalUnseenCountData={totalUnseenCountData}
    />
    <AvatarColumn
      currentUser={authenticatedUserData.viewer}
      logout={logout}
      doLogout={doLogout}
    />
  </div>
)

PureUserSection.propTypes = {
  authenticatedUserData: PropTypes.shape({
    viewer: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  storeAlerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    iconName: PropTypes.string,
    eventTs: PropTypes.string,
    eventBody: PropTypes.string,
    notificationDetails: PropTypes.string,
    notificationType: PropTypes.string,
    portalSeen: PropTypes.bool,
  })),
  logout: PropTypes.func,
  history: PropTypes.object,
  storeAlertsData: PropTypes.object, // GQL object, needed for polling, etc.
  setNotificationsSeen: PropTypes.func,
  dismissAlert: PropTypes.func,
  dismissAll: PropTypes.func,
  totalUnseenCount: PropTypes.number,
  totalUnseenCountData: PropTypes.object,
  doLogout: PropTypes.func,
}

const UserSection = compose(
  withAuthenticatedEmployee,
  // Add the page size for getNotifications query
  withProps(() => ({
    pageSize: 10,
    pagesSkipped: 0,
  })),
  withAlerts,
  withTotalUnseenCount,
  withDismissAlert,
  withDismissAll,
  withRouter,
  renderWhileLoading(() => (
    <div style={styles.section} />
  ), ['authenticatedUserData', 'storeAlertsData']),
  withLogout,
  graphql(logoutUser, {
    props: ({ mutate }) => ({
      doLogout: () => mutate({
        variables: { input: {} },
      }),
    }),
  }),
  withSetNotificationsSeen,
  // TODO: find a better way to notificate the user that the alerts not loaded correctly
  // withQueryErrorPageOnError(['authenticatedUserData', 'storeAlertsData'], false),
)(PureUserSection)

export default UserSection
