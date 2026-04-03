//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import Button from 'components/common/input/Button'
import ProgressBar from 'components/common/container/ProgressBar'
import Icon from 'components/common/display/Icon'

const ButtonsContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 93%;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ edit }) => (edit ? 'flex-end' : 'space-between')};
  align-items: center;
  margin-left: -65px;
  background-color: ${colors.white};
  border-top: 1px solid ${colors.grayLight2};
  z-index: 1;
`
const ProgressContainer = styled.div`
  height: 54px;
`

const ProgressLabel = styled.div`
  color: ${colors.gray};
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.25;
  letter-spacing: 0.86px;
  text-align: center;
`

const BackButtonStyled = styled.div`
  margin-left: 20px;
`

const SaveButtonStyled = styled.div`
  margin-right: 85px;
`

const ErrorSpanStyled = styled.span`
  width: 556px;
  height: 28px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  text-align: center;
  color: #ff6666;
`

const ErrorDivStyled = styled.div`
  display: flex;
  align-items: center;
  width: 619px;
  height: 38px;
  border-radius: 4px;
  border: solid 1px #ff6666;
`

const FooterPackageDetails = ({
  title,
  needsAttention,
  totalPackages,
  onBack,
  onSubmit,
  valid,
  showError,
  setShowError,
}) => {
  useEffect(() => {
    if (valid) setShowError(false)
  }, [valid])
  return (
    <ButtonsContainer>
      <BackButtonStyled>
        <Button onClick={onBack}>Back</Button>
      </BackButtonStyled>
      { !valid && showError ?
        <ErrorDivStyled>
          <Icon name="warning" style={{ color: colors.red, marginLeft: 10 }} />
          <ErrorSpanStyled> Please enter the highlighted information if available.
                  If you’d like to complete it later, you may save and continue.
          </ErrorSpanStyled>
        </ErrorDivStyled>
        :
        <ProgressContainer>
          <ProgressLabel>{title}</ProgressLabel>
          <ProgressBar percentage={((totalPackages - needsAttention) * 100) / totalPackages} />
          <ProgressLabel> # {needsAttention + 1} / {totalPackages}</ProgressLabel>
        </ProgressContainer>
      }
      <SaveButtonStyled>
        <Button primary onClick={onSubmit}>Save and Continue</Button>
      </SaveButtonStyled>
    </ButtonsContainer>
  )
}

FooterPackageDetails.propTypes = {
  title: PropTypes.string.isRequired,
  needsAttention: PropTypes.number,
  totalPackages: PropTypes.number,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool,
  setShowError: PropTypes.func,
  showError: PropTypes.bool,
}

export default FooterPackageDetails
