//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from 'styles/colors'
import { capitalize } from 'lodash'
import Title from 'components/common/display/Title'
import ButtonRow from './ButtonRow'

const LeftDiv = styled.div`
  display: flex;
  margin-right: 20px;
`

const NavErrorDiv = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const NavStatusCodeDiv = styled.div`
  color: ${colors.blueishGray};
  font-size: 130px;
  font-weight: 300;
  line-height: 0.92;
`

const NavLine = styled.div`
  margin: 30px 0 28px 0;
  border-top: solid 1px ${colors.grayLight2};
  width: 100%;
`

const NavStatusTextDiv = styled.div`
  display: flex;
  color: ${colors.blueishGray};
  line-height: 1.54;
  font-size: 26px;
`

const NavErrorMessageDiv = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 26px;
  letter-spacing: normal;
  line-height: 1.54;
  color: ${colors.grayDark2}
`

const NavPage = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  @media (max-width: 768px) {
    margin-left: 100px;
  }
`

// Component to display the page if the left side menu nav panel is visible
const Nav = ({ message, statusCode, statusText, history }) => (
  <NavPage>
    <Title>Error</Title>
    <NavErrorDiv>
      <LeftDiv>
        <NavStatusCodeDiv>{statusCode}</NavStatusCodeDiv>
      </LeftDiv>
      <div>
        <NavErrorMessageDiv>{message}</NavErrorMessageDiv>
        <NavStatusTextDiv>{capitalize(statusText)}</NavStatusTextDiv>
      </div>
    </NavErrorDiv>
    <NavLine />
    <ButtonRow nav history={history} />
  </NavPage>
)

Nav.propTypes = {
  message: PropTypes.string,
  statusCode: PropTypes.number,
  statusText: PropTypes.string,
  history: PropTypes.object,
}

export default Nav
