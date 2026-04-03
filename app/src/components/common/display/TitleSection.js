import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'

const styles = {
  version: {
    fontSize: '9pt',
    fontWeight: 200,
    lineHeight: '54px',
    textAlign: 'right',
  },
  toggleButtonWrapper: {
    textAlign: 'center',
    paddingLeft: '5px',
    paddingRight: '0px',
    width: '48px',
    height: '48px',
    lineHeight: '48px',
  },
}

// Using styled format here to be able to add a media query
const TitleContainer = styled.h1`
  font-size: 1.2rem;
  font-weight: 300;
  display: inline;
  position: relative;
  top: 0.7rem;

  @media (max-width: 768px) {
    display: none;
    visibility: hidden;
  }
`
const Title = props => (
  <TitleContainer><a style={{ fontWeight: '300', textDecoration: 'none' }} href="/">{props.label}</a></TitleContainer>
)

Title.propTypes = {
  label: PropTypes.node.isRequired,
}

const TitleSection = props => (
  <Grid fluid style={{ paddingLeft: 0 }} >
    <Row>
      <Col>
        <Title label={props.title} />
      </Col>
      <Col>
        <span style={styles.version}>{process.env.REACT_APP_VERSION || 'developer version'}</span>
      </Col>
    </Row>
  </Grid>
)

TitleSection.propTypes = {
  title: PropTypes.element.isRequired,
}

export default TitleSection
