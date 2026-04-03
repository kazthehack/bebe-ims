//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Title from 'components/common/display/Title'
import colors from 'styles/colors'
import ButtonRow from './ButtonRow'

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 40px;
  margin-top: -100px;
`

const StatusCodeDiv = styled.div`
  color: ${colors.blueishGray};
  font-size: 130px;
  font-weight: 300;
  line-height: 0.92;
`

const StatusTextDiv = styled.div`
  display: block;
  color: ${colors.blueishGray};
  line-height: 1.54;
  font-size: 26px;
  height: 70px;
  align-items: flex-end;
`

const ErrorMessageDiv = styled.div`
  display: block;
  align-items: flex-end;
  font-weight: 500;
  font-size: 36px;
  letter-spacing: 0.4px;
  height: 38px;
  line-height: normal;
  color: ${colors.grayDark2}
`

const Line = styled.div`
  margin: 30px 0 28px 0;
  border-top: solid 1px ${colors.grayLight2};
  width: 787px;
  margin-left: 36px;
`

const NoPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ErrorDiv = styled.div`
  height: 148px;
  max-width: 1100px;
  display: inline-flex;
  margin-top: 90px;
  margin-left: 240px;
`

const LeftDiv = styled.div`
  display: flex;
  flex-grow: 1;
`

const StyledTitle = styled(Title)`
  margin-right: 787px;
`

// Component to display the page if the left side menu nav panel is not visible
const NoNav = ({ message, statusCode, statusText, history, logout }) => (
  <NoPage>
    <StyledTitle>Error</StyledTitle>
    <ErrorDiv>
      <LeftDiv>
        <StatusCodeDiv>{statusCode}</StatusCodeDiv>
      </LeftDiv>
      <RightDiv>
        <StatusTextDiv>{statusText}</StatusTextDiv>
        <ErrorMessageDiv>{message}</ErrorMessageDiv>
      </RightDiv>
    </ErrorDiv>
    <Line />
    <ButtonRow history={history} logout={logout} />
  </NoPage>
)

NoNav.propTypes = {
  message: PropTypes.string,
  statusCode: PropTypes.number,
  statusText: PropTypes.string,
  history: PropTypes.object,
  logout: PropTypes.func,
}

export default NoNav
