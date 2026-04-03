import React from 'react'
import { ProductIcon } from 'components/common/display/ProductIcon'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import colors from 'styles/colors'

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const SpinnerWrapper = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`

const Animated = styled.div`
  animation: ${rotate} ${props => props.interval}s linear infinite;
  color: ${props => props.color};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  padding: 1px 0px 0px 0px;
  margin: 0;
  position: relative;
  text-align: center;
`

const StyledIcon = styled(ProductIcon)`
  font-size: ${props => props.size - 20}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  line-height: ${props => props.size}px;
  text-align: center;
  margin: 0;
  padding: 0;
`

export const BasicSpinner = props => (
  <SpinnerWrapper {...props}>
    <Animated {...props}>
      <StyledIcon type="loading" {...props} />
    </Animated>
  </SpinnerWrapper>
)

BasicSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  interval: PropTypes.number,
}

BasicSpinner.defaultProps = {
  size: 100,
  color: colors.blue,
  interval: 3,
}

const Blink = keyframes`
  0% { opacity: 0.1; }
  30% { opacity: 1; }
  100% { opacity: 0.1; }
`

const DAWrap = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 500;
`

const DALoader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .row {
     display: flex;
  }
  .down {
     transform: rotate(180deg);
  }
  .arrow {
    width: 0px;
    height: 0px;
    margin: 0 -${props => props.size}px;
    border-left: ${props => (props.size * 2)}px solid transparent;
    border-right: ${props => (props.size * 2)}px solid transparent;
    border-bottom: ${props => (props.size * 3.6)}px solid ${props => props.color};
    animation: ${Blink} ${props => (props.interval)}s infinite;
    filter: drop-shadow(0 0 ${props => (props.size * 3)}px ${props => props.color});
  }
  .outer-1 {
    animation-delay: -${props => (props.interval * (1 / 18))}s
  }
  .outer-2 {
    animation-delay: -${props => (props.interval * (2 / 18))}s
  }
  .outer-3 {
    animation-delay: -${props => (props.interval * (3 / 18))}s
  }
  .outer-4 {
    animation-delay: -${props => (props.interval * (4 / 18))}s
  }
  .outer-5 {
    animation-delay: -${props => (props.interval * (5 / 18))}s
  }
  .outer-6 {
    animation-delay: -${props => (props.interval * (6 / 18))}s
  }
  .outer-7 {
    animation-delay: -${props => (props.interval * (7 / 18))}s
  }
  .outer-8 {
    animation-delay: -${props => (props.interval * (8 / 18))}s
  }
  .outer-9 {
    animation-delay: -${props => (props.interval * (9 / 18))}s
  }
  .outer-10 {
    animation-delay: -${props => (props.interval * (10 / 18))}s
  }
  .outer-11 {
    animation-delay: -${props => (props.interval * (11 / 18))}s
  }
  .outer-12 {
    animation-delay: -${props => (props.interval * (12 / 18))}s
  }
  .outer-13 {
    animation-delay: -${props => (props.interval * (13 / 18))}s
  }
  .outer-14 {
    animation-delay: -${props => (props.interval * (14 / 18))}s
  }
  .outer-15 {
    animation-delay: -${props => (props.interval * (15 / 18))}s
  }
  .outer-16 {
    animation-delay: -${props => (props.interval * (16 / 18))}s
  }
  .outer-17 {
    animation-delay: -${props => (props.interval * (17 / 18))}s
  }
  .outer-18 {
    animation-delay: -${props => (props.interval * (18 / 18))}s
  }
  .inner-1 {
    animation-delay: -${props => (props.interval * (1 / 6))}s
  }
  .inner-2 {
    animation-delay: -${props => (props.interval * (2 / 6))}s
  }
  .inner-3 {
    animation-delay: -${props => (props.interval * (3 / 6))}s
  }
  .inner-4 {
    animation-delay: -${props => (props.interval * (4 / 6))}s
  }
  .inner-5 {
    animation-delay: -${props => (props.interval * (5 / 6))}s
  }
  .inner-6 {
    animation-delay: -${props => (props.interval * (6 / 6))}s
  }
`

const DASpinner = props => (
  <DAWrap style={props.wrapStyle} className={props.className} key={1}>
    <DALoader {...props}>
      <div className="row">
        <div className="arrow up outer outer-18" />
        <div className="arrow down outer outer-17" />
        <div className="arrow up outer outer-16" />
        <div className="arrow down outer outer-15" />
        <div className="arrow up outer outer-14" />
      </div>
      <div className="row">
        <div className="arrow up outer outer-1" />
        <div className="arrow down outer outer-2" />
        <div className="arrow up inner inner-6" />
        <div className="arrow down inner inner-5" />
        <div className="arrow up inner inner-4" />
        <div className="arrow down outer outer-13" />
        <div className="arrow up outer outer-12" />
      </div>
      <div className="row">
        <div className="arrow down outer outer-3" />
        <div className="arrow up outer outer-4" />
        <div className="arrow down inner inner-1" />
        <div className="arrow up inner inner-2" />
        <div className="arrow down inner inner-3" />
        <div className="arrow up outer outer-11" />
        <div className="arrow down outer outer-10" />
      </div>
      <div className="row">
        <div className="arrow down outer outer-5" />
        <div className="arrow up outer outer-6" />
        <div className="arrow down outer outer-7" />
        <div className="arrow up outer outer-8" />
        <div className="arrow down outer outer-9" />
      </div>
    </DALoader>
  </DAWrap>
)

DASpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  interval: PropTypes.number,
  wrapStyle: PropTypes.object,
  className: PropTypes.string,
}

DASpinner.defaultProps = {
  size: 12,
  color: colors.blue,
  interval: 2,
  wrapStyle: {},
  className: '',
}

export default DASpinner
