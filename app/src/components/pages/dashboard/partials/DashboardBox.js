import PropTypes from 'prop-types'
import React from 'react'
import { toString, head, last } from 'lodash'
import styled, { css } from 'styled-components'
import colors from 'styles/colors'
import { isNumeric } from 'utils/numbers'

const StyledStatBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  width: 200px;
  height: 78px;
  margin-right: 10px;
  margin-bottom: ${props => (props.stacked ? '0' : '10')}px;
  border-radius: 2px;
  border: solid ${props => (props.borderless ? '0' : '1')}px ${colors.whisper};
  background-color: ${colors.white};
  white-space: pre-line;
  ${props => (props.fluid && 'width: 100%;')}
`

const StyledStatTitle = styled.div`
  margin-left: 17px;
  margin-top: 13px;
  font-family: Roboto;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.91;
  letter-spacing: 0.58px;
  color: ${colors.grayLight6};
  text-transform: uppercase;
  white-space: pre-line;
`

const smallCSS = css`
  display: inline-block;
  align-self: flex-end;
  margin-bottom: 2px;
  height: 35px;
  line-height: 35px;
  letter-spacing: normal;
  color: ${colors.grayDark2};
  font-weight: 300;
  font-size: 16px;
`

const StyledSpanDecimal = styled.div`
  ${smallCSS}
`

const StyledValueSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
`
const SuffixAndValue = css`
  margin-bottom: 6px;
  font-family: Roboto;
  font-size: 32px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${colors.grayDark2};
`
const StyledValue = styled.div`
  margin-left: 17px;
  ${SuffixAndValue}
  font-size: ${props => props.fontSize}px;
`

const StyledSuffix = styled.div`
  ${props => (props.smallSuffix ? smallCSS : SuffixAndValue)}
`

const StatBox = ({
  label,
  value,
  className,
  innerBoxStyle,
  prefix,
  suffix,
  titleStyle,
  styledDecimal = false,
  smallSuffix,
  ...props
}) => {
  let decimalValue
  let fixedValue = value
  let isNumericValue = isNumeric(value)

  if (fixedValue === null || fixedValue === undefined) {
    fixedValue = 0
    isNumericValue = true
  }

  if (styledDecimal && isNumericValue && toString(value).includes('.')) {
    const parsedValue = toString(value).split('.')
    fixedValue = head(parsedValue)
    decimalValue = last(parsedValue)

    decimalValue = decimalValue && decimalValue > 0 ? decimalValue : undefined
  }

  return (
    <StyledStatBox {...props}>
      <StyledStatTitle>{label && label.replace('\\n', '\n')}</StyledStatTitle>
      <StyledValueSection>
        <StyledValue fontSize={isNumericValue ? 32 : 24}>
          {prefix}{fixedValue}{decimalValue && '.'}
        </StyledValue>
        <StyledSpanDecimal>{decimalValue && decimalValue}</StyledSpanDecimal>
        <StyledSuffix smallSuffix={smallSuffix}>{suffix}</StyledSuffix>
      </StyledValueSection>
    </StyledStatBox>
  )
}

StatBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  className: PropTypes.string,
  innerBoxStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  styledDecimal: PropTypes.bool,
  smallSuffix: PropTypes.bool,
}

export default StatBox
