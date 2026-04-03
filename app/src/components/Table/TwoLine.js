//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'

// This component formats multiline column headers for our tables
const TwoLine = ({ top, bottom, topStyle, bottomStyle }) => (
  <div>
    <div style={{ fontSize: '10px', ...topStyle }}>{top}</div>
    <div style={bottomStyle}>{bottom}</div>
  </div>
)

TwoLine.propTypes = {
  top: PropTypes.string,
  bottom: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  topStyle: PropTypes.object,
  bottomStyle: PropTypes.object,
}

export default TwoLine
