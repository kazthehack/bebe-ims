import React from 'react'
import colors from 'styles/colors'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'recompose'
import { get } from 'lodash'
import { withStoreEnableDareMode } from './settings/venue/withEnableDareMode'
import Header from './Header'
import Menu from '../common/navigation/Menu'
import { withVenueID } from '../Venue'

const MENU_WIDTH = 176
const MENUE_Z_INDEX = 10

const StyledPage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const StyledBody = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  padding-bottom: 40px;
`

const StyledMenuDiv = styled.div`
  background-color: ${colors.blueDark};
  height: 100%;
  padding: 0;
  text-align: left;
  position: absolute;
  overflow: hidden;
  width: ${MENU_WIDTH}px;
  z-index: ${MENUE_Z_INDEX};
`

const Page = compose(
  withVenueID,
  withStoreEnableDareMode,
)(({ children, history, venueSettings }) => (
  <StyledPage>
    <Header history={history} />
    <StyledBody>
      <StyledMenuDiv>
        <Menu enableDareMode={get(venueSettings, 'store.settings.enableDareMode', false)} />
      </StyledMenuDiv>
      {children}
    </StyledBody>
  </StyledPage>
))

Page.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object,
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default Page
