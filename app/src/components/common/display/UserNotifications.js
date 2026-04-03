//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'

import Avatar from 'components/common/display/Avatar'
import DropDownMenu from 'components/common/navigation/DropDownMenu'
import MenuItem from 'components/common/navigation/MenuItem'
import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import List from 'components/common/container/List'
import MobileTearSheet from '../container/MobileTearSheet'

const styles = {
  list: {
    textAlign: 'left',
    marginLeft: '1.6rem',
    marginRight: '1.6rem',
    marginTop: '1.6rem',
    paddingTop: 0,
  },
  listSheet: {
    zIndex: 10000,
  },
}

// TODO refactor and style

const RightIconMenu = () => (
  <DropDownMenu
    render={onClick => <div onClick={onClick}>*</div>}
  >
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Archive</MenuItem>
  </DropDownMenu>
)

const UserNotifications = props => (
  <MobileTearSheet style={styles.listSheet}>
    <List
      style={styles.list}
      renderItem={note => (
        <div>
          <Avatar src={note.avatar} />
          <span style={styles.noteTitle}>{note.name}:<br />{note.title}</span><br />
          {note.message}
          <RightIconMenu />
        </div>
      )}
      data={props.notifications}
    >
      <Subheader>Today</Subheader>
    </List>
  </MobileTearSheet>
)

UserNotifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default UserNotifications
