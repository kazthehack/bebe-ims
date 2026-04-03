//  Copyright (c) 2020 First Foundry LLC. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import PropTypes from 'prop-types'

const ProgressContainer = styled.div`
  width: 129px;
  height: 4px;
  border-radius: 13px;
  background-color: #e7e7e7;
  position: relative;
`

const Filler = styled.div`
  background: ${colors.blue};
  height: 100%;
  transition: width 3s ease;
`

const ProgressBar = ({
  percentage,
}) => (
  <div>
    <ProgressContainer>
      <Filler style={{ width: `${100 - percentage}%` }} />
    </ProgressContainer>
  </div>
)

ProgressBar.propTypes = {
  percentage: PropTypes.number,
}


export default ProgressBar
