import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'recompose'
import Button from 'components/common/input/Button'
import Spinner from 'components/common/display/Spinner'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { renderWhileLoading } from 'utils/hoc'

const Box = styled.div`
  width: 100px;
  height: 38px;
  border-radius: 2px;
  border: solid 1px #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ disabled }) => (disabled ? '#e7e7e7' : '#5e5e5e')};
  text-transform: uppercase;
`

const BoxTopLine = styled.span`
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.53px;
`

const BoxBottomLine = styled.span`
font-size: 14px;
letter-spacing: 0.74px;
`

const PackageButtonButton = styled(Button)`
  width: 140px;
  height: 40px;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    box-shadow: none;
  }
`

export const PackageButton = ({
  buttonText,
  style,
  boxTopLine,
  boxBottomLine,
  disabled,
  spinner,
  onClick,
}) => (
  <div style={{ ...style, display: 'inline-flex' }}>
    <PackageButtonButton onClick={onClick} disabled={disabled} primary>
      {buttonText}
      {spinner && <Spinner size={1} interval={2} wrapStyle={{ position: 'static', margin: '14px 0 0 14px' }} />}
    </PackageButtonButton>
    <Box disabled={disabled}>
      <BoxTopLine>{boxTopLine}</BoxTopLine>
      <BoxBottomLine>
        {boxBottomLine}
        <ProductIcon type="error" style={{ marginLeft: '3px' }} />
      </BoxBottomLine>
    </Box>
  </div>
)

export const PackageButtonWithSpinner = compose(
  renderWhileLoading(() => <Spinner size={2} wrapStyle={{ paddingTop: '50px', paddingRight: '120px' }} />, 'data'),
)(PackageButton)

PackageButton.propTypes = {
  buttonText: PropTypes.string,
  style: PropTypes.object,
  boxTopLine: PropTypes.string,
  boxBottomLine: PropTypes.string,
  disabled: PropTypes.bool,
  spinner: PropTypes.bool,
  onClick: PropTypes.func,
}
