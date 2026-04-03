//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'

import PropTypes from 'prop-types'

export const ConditionalShow = (props) => {
  if (props.value) {
    return <div style={props.style}>{props.children}</div>
  }
  return null
}

ConditionalShow.propTypes = {
  style: PropTypes.object,
  value: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default ConditionalShow
