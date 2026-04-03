import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import colors from 'styles/colors'

const Bar = styled.div`
  height: 4px;
  width: 100%;
  border-radius: 13px;
  background-color: ${props => props.backgroundColor};
`

const OverlayBar = styled(Bar)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: ${props => `${props.width}%`};
`

const BarContainer = styled.div`
  position: relative;
`

const AmountLeft = styled.div`
  color: ${colors.blueishGray};
  text-align: center;
  font-size: 12px;
`

const ProgressBar = ({ className, current, total, unit }) => {
  const percent = (current / Math.max(total, 1)) * 100
  const suffix = unit ? ` ${unit}` : ''
  const backgroundColor = unit === 'g' ? colors.blue : colors.green

  const displayAmountLeft = typeof current !== 'undefined'
    && typeof total !== 'undefined'

  return (
    <div className={className}>
      <BarContainer>
        <Bar backgroundColor={colors.grayLight2} />
        <OverlayBar backgroundColor={backgroundColor} width={displayAmountLeft ? percent : 100} />
      </BarContainer>
      { displayAmountLeft && <AmountLeft>{current}{suffix} / {total}{suffix}</AmountLeft> }
    </div>
  )
}

ProgressBar.propTypes = {
  className: PropTypes.string.isRequired,
  current: PropTypes.number,
  total: PropTypes.number,
  unit: PropTypes.string,
}

export default styled(ProgressBar)`
  display: inline-block;
  max-width: 129px;
  width: 100%;
`
