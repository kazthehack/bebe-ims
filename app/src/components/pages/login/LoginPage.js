import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import LogoSVG from 'assets/logo.png'
import colors from 'styles/colors'
import { PageNotFound } from 'components/pages/ErrorPage'
import LoginFragment from './LoginFragment'

/*
 * Constants
 */
const CONTAINER_MIN_HEIGHT = '650px'
const CONTAINER_MAX_WIDTH = '700px'

/*
 * Styles
 */
const Container = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-top: 78px;
  
  p, label {
    font-size: 12pt;
  }

  h3 {
    color: ${colors.grayDark2};
    font-size: 26px;
    text-align: center;
    font-weight: 500;
    margin-top: 1.2em;
    margin-bottom: 1.3em;
  }

  input {
    color: ${colors.grayDark2};
    width: 320px;
  }

  @media (min-width: ${CONTAINER_MAX_WIDTH}) {
    width: ${CONTAINER_MAX_WIDTH};
  }

  > div {
    @media (max-height: ${CONTAINER_MIN_HEIGHT}) {
      margin: 0 auto;
      padding-bottom: 20px;
    }
    width: 100%;
    max-width: ${CONTAINER_MAX_WIDTH};
    padding: 0;
  }

  > div > div > h2 {
    text-align: center;
  }
`

// CSS hack for crop image and keep the aspect ratio
// reference: https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css
// reference: https://stackoverflow.com/questions/18247356/how-to-center-crop-an-image-img-in-fluid-width-container
const LogoWrapper = styled(Col)`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;

`

/*
 * <LoginPage/>
 */
const LoginPage = ({ match }) => (
  <Container fluid>
    <Row>
      <LogoWrapper>
        <img src={LogoSVG} style={{ width: '420px', maxWidth: '100%', height: 'auto' }} alt="Bloom Manager Portal" />
      </LogoWrapper>
      <Switch>
        <Route exact path={match.url} component={LoginFragment} />
        <Route exact path={`${match.url}/reset`} render={() => <LoginFragment />} />
        <Route exact path={`${match.url}/request`} render={() => <LoginFragment />} />
        <Route component={PageNotFound(true)} />
      </Switch>
    </Row>
  </Container>
)

LoginPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
}

export default LoginPage
