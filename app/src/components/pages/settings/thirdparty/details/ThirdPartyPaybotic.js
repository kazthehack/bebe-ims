//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { compose } from 'recompose'
import { FormToggle } from 'components/common/input/Toggle'
import Button from 'components/common/input/Button'
import Title from 'components/common/display/Title'
import { Form } from 'react-final-form'
import withAuthenticatedEmployee, { UserPermissionsPropType, withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { withVenueID } from 'components/Venue'
import { withNotifications } from 'components/Notifications'
import { withCancelConfirmation } from 'components/Modal'
import withUpdatePaybotics from './withUpdatePaybotics'

const StyledFormContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const RowDiv = styled.div`
  height: 40px;
  width: 100%;
  line-height: 40px;
  vertical-align: middle;
  color: ${colors.grayDark2};
  display: flex;
  margin-bottom: 32px;
`

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 32px;
  width: 182px;
  label {
    font-size: 16px;
    color: ${colors.grayDark2};
  }
`

const FooterButtons = styled.div`
  position: fixed;
  bottom: 65px;
  right: 64px;
`

const mapInitialValues = (store = {}) => {
  const { posSettings = {} } = store
  return posSettings.enablePaybotics
}

const ThirdPartyPaybotic = ({
  onCancel,
  userPermissions,
  updatePaybotics,
  history,
  thirdPartySettings,
}) => (
  <Form
    onSubmit={({ enablePaybotics }) => {
      updatePaybotics(enablePaybotics)
    }}
    keepDirtyOnReinitialize
    initialValues={{ enablePaybotics: mapInitialValues(thirdPartySettings.store) }}
    render={({ handleSubmit, values, form, pristine, submitting }) => (
      <Fragment>
        <form>
          <div>
            <Title>3rd Party integration - Paybotic</Title>
            <StyledFormContent>
              <RowDiv>
                <ToggleContainer>
                  <label>Active</label>
                  <FormToggle
                    name="enablePaybotics"
                    noStatusText
                    disabled={!userPermissions.write}
                    onChange={() => {
                      form.change('enablePaybotics', !values.enablePaybotics)
                      form.change('activeChangePristine', !values.activeChangePristine)
                    }}
                  />
                </ToggleContainer>
              </RowDiv>
            </StyledFormContent>
          </div>
        </form>
        <FooterButtons>
          <Button
            default
            onClick={() => {
              form.reset()
              onCancel(pristine)
            }}
          >
              CANCEL
          </Button>
          <Button
            primary
            disabled={submitting}
            onClick={() => {
              handleSubmit()
              history.push('/settings/thirdparty')
            }}
            style={{ marginLeft: '24px' }}
          >
              SAVE
          </Button>
        </FooterButtons>
      </Fragment>
      )}
  />
)

ThirdPartyPaybotic.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  onCancel: PropTypes.func,
  userPermissions: UserPermissionsPropType,
  updatePaybotics: PropTypes.func,
  thirdPartySettings: PropTypes.object,
}

export default compose(
  withVenueID,
  withNotifications,
  withAuthenticatedEmployee,
  withPermissions('BASIC_SETTINGS'),
  withCancelConfirmation('/settings/thirdparty'),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['thirdPartySettings']),
  withUpdatePaybotics(),
)(ThirdPartyPaybotic)
