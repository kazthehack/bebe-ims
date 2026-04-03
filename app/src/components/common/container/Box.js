import React from 'react'

import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import styled from 'styled-components'
import colors from 'styles/colors'

const Card = styled.div`
  color: ${colors.gray};
  background-color: ${colors.white};
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
  border-radius: 2px;
  padding: 0 1.6rem 1.6rem;
  margin: 0 0 1.6rem;
  box-shadow: none;
  border: 1px solid ${colors.grayLight2};
  cursor: ${props => (props.onClick ? 'pointer' : 'auto')}
`

const Box = ({
  boxStyle,
  title,
  titleStyle,
  subheaderTextSizeOption,
  subheaderColor,
  style,
  onClick,
  children,
  className,
}) => (
  <Card style={boxStyle} onClick={onClick}>
    { title &&
      <Subheader
        textSizeOption={subheaderTextSizeOption}
        color={subheaderColor}
        style={titleStyle}
      >
        {title}
      </Subheader> }
    <div style={style} className={className}>
      {children}
    </div>
  </Card>
)

Box.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  style: PropTypes.object,
  boxStyle: PropTypes.object,
  subheaderTextSizeOption: PropTypes.oneOf([1, 2, 3, 4]),
  subheaderColor: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Box
