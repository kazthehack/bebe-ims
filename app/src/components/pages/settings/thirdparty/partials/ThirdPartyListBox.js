// Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { capitalize } from 'lodash'
import { compose } from 'recompose'
import Box from 'components/common/container/Box'
import { Icon } from 'components/common/display'
import colors from 'styles/colors'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import withThirdPartySettings from '../withThirdPartySettings'

const boxStyle = disabled => ({
  height: '193px',
  width: '224px',
  textAlign: 'center',
  padding: 0,
  display: 'inline-block',
  marginRight: '27px',
  marginBottom: '32px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  position: 'relative',
  margin: '32 auto',
})

const StyledIconDiv = styled.div`
  display: block;
  position: relative;
  height: 30px;
`

const StyledCrossIcon = styled(Icon)`
  top: 10px;
  height: 30px;
  width: 30px;
  position: absolute;
  right: 0;
  margin-bottom: 30px;
  color: colors.red;
`

const StyledLeftTooltip = styled(TooltipWithIcon)`
  position: absolute;
  top: 10px;
  left: 0;
  top: 6px;
  margin-bottom: 30px;
`

const StyledInfoTooltip = styled(TooltipWithIcon)`
  top: 6px;
  position: absolute;
  right: 0;
  margin-bottom: 30px;
`

const StyledLabel = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  letter-spacing: 0.9px;
  text-align: center;
  color: ${props => (props.disabled ? colors.grayLight : colors.grayDark2)};
  text-transform: uppercase;
  display: inline-block;
  position: absolute;
  text-align: center;
  bottom: 15px;
  left: 0;
  right: 0;
`

const StyedLogo = styled.img`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 15px;
  margin: auto;
  max-height: ${props => (props.isPrimary ? '108px' : '75px')};
  max-width: ${props => (props.isPrimary ? '168px' : '90px')};
`

const SubLabel = styled.div`
  font-size: 14px;
`

const getLeftIcon = (integrated, disabled, label) => {
  if (disabled) return undefined
  if (integrated) {
    return <StyledLeftTooltip icon={'checkmark-circle'} iconColor={colors.green} text={`${capitalize(label)} is integrated`} />
  }
  return <StyledLeftTooltip iconColor={colors.red} icon={'cross-circle'} text={`${capitalize(label)} is not integrated`} />
}

const ThirdPartyListBox = ({
  label,
  src,
  onClick,
  srcDisabled,
  disabled = false,
  integrated,
  tooltip,
}) => (
  <Box
    boxStyle={boxStyle(disabled)}
    onClick={disabled ? () => {} : onClick}
  >
    <StyledIconDiv>
      {getLeftIcon(integrated, disabled, label)}
      {disabled ? <StyledCrossIcon disabled={disabled} name="history" />
      : <StyledInfoTooltip text={tooltip || `Info about the 3rd Party integration ${capitalize(label)}`} iconColor={colors.blue} />
      }
    </StyledIconDiv>
    <StyedLogo
      src={disabled && srcDisabled ? srcDisabled : src}
      disabled={disabled}
      isPrimary={label === 'BLOOM'}
      alt=""
    />
    <StyledLabel disabled={disabled} >
      {label}
      {disabled &&
        <SubLabel>
          (COMING SOON)
        </SubLabel>
      }
    </StyledLabel>
  </Box>
)

ThirdPartyListBox.propTypes = {
  label: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcDisabled: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  integrated: PropTypes.bool,
  tooltip: PropTypes.string,
}

export default compose(
  withThirdPartySettings(),
)(ThirdPartyListBox)
