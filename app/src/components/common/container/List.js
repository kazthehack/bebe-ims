//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 01/22/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import { v4 as uuid } from 'uuid'

const styles = {
  container: {
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: '#fff',
    height: 56,
    borderBottom: '1px solid #eee',
  },
}

const ListItem = props => (
  <li style={styles.item}>
    {props.children}
  </li>
)

ListItem.propTypes = {
  children: PropTypes.node,
}

const List = (props) => {
  const containerStyle = Object.assign(
    {},
    styles.container,
    props.style,
  )

  return (
    <ul style={containerStyle}>
      {props.data.map(item =>
        <ListItem key={uuid()}>{props.renderItem(item)}</ListItem>)}
    </ul>
  )
}

List.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderItem: PropTypes.func.isRequired,
  style: PropTypes.object,
}

export default List
