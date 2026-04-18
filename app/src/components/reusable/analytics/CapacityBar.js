import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  gap: 4px;
`

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
`

const Track = styled.div`
  width: 100%;
  height: ${({ $height }) => `${Math.max(2, Number($height) || 8)}px`};
  border-radius: 999px;
  background: #d0d8e1;
  overflow: hidden;
`

const Fill = styled.div`
  height: 100%;
  border-radius: inherit;
  width: ${({ $ratio }) => `${Math.max(0, Math.min(1, Number($ratio) || 0)) * 100}%`};
  background: ${({ $ratio, $greenAt, $yellowAt }) => {
    const ratio = Math.max(0, Math.min(1, Number($ratio) || 0))
    if (ratio >= Number($greenAt)) return '#2d8a4a'
    if (ratio >= Number($yellowAt)) return '#d29c1f'
    return '#c24545'
  }};
`

const Text = styled.div`
  font-size: 11px;
  color: #41576d;
  line-height: 1;
`

const toSafeNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const CapacityBar = ({
  value,
  target,
  height,
  textPosition,
  showText,
  greenAt,
  yellowAt,
  formatText,
}) => {
  const safeValue = toSafeNumber(value)
  const safeTarget = Math.max(1, toSafeNumber(target))
  const ratio = safeValue / safeTarget
  const text = formatText ? formatText(safeValue, safeTarget) : `${safeValue} / ${safeTarget}`

  if (!showText || textPosition === 'none') {
    return (
      <Wrapper>
        <Track $height={height}>
          <Fill $ratio={ratio} $greenAt={greenAt} $yellowAt={yellowAt} />
        </Track>
      </Wrapper>
    )
  }

  if (textPosition === 'right') {
    return (
      <Wrapper>
        <TopRow>
          <Track $height={height}>
            <Fill $ratio={ratio} $greenAt={greenAt} $yellowAt={yellowAt} />
          </Track>
          <Text>{text}</Text>
        </TopRow>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Track $height={height}>
        <Fill $ratio={ratio} $greenAt={greenAt} $yellowAt={yellowAt} />
      </Track>
      <Text>{text}</Text>
    </Wrapper>
  )
}

CapacityBar.propTypes = {
  value: PropTypes.number,
  target: PropTypes.number,
  height: PropTypes.number,
  textPosition: PropTypes.oneOf(['below', 'right', 'none']),
  showText: PropTypes.bool,
  greenAt: PropTypes.number,
  yellowAt: PropTypes.number,
  formatText: PropTypes.func,
}

CapacityBar.defaultProps = {
  value: 0,
  target: 1,
  height: 8,
  textPosition: 'below',
  showText: true,
  greenAt: 0.6,
  yellowAt: 0.3,
  formatText: null,
}

export default CapacityBar
