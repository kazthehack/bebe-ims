//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { compose, branch } from 'recompose'
import { PageNotFound } from 'components/pages/ErrorPage'
import { FormToggle } from 'components/common/input/Toggle'
import { FormTextField } from 'components/common/input/TextField'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Button from 'components/common/input/Button'
import Title from 'components/common/display/Title'
import { Form } from 'react-final-form'
import withAuthenticatedEmployee, { UserPermissionsPropType, withPermissions } from 'components/common/display/withAuthenticatedEmployee'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { withVenueID } from 'components/Venue'
import { withNotifications } from 'components/Notifications'
import { withCancelConfirmation } from 'components/Modal'
import { get } from 'lodash'
import withUpdateLeafly from './withUpdateLeafly'
import withLeaflySettings from './withLeaflySettings'

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
const ColumnDiv = styled.div`
  width: 100%;
  vertical-align: middle;
  color: ${colors.grayDark2};
  display: flex;
  flex-direction: column;
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

const LabelDiv = styled.div`
  color: ${colors.grayDark2};
  width: 136px;
`

const FooterButtons = styled.div`
  position: fixed;
  bottom: 65px;
  right: 64px;
`
const mapInitialValues = (store = {}) => {
  const { integrations = {} } = store
  return {
    active: get(integrations, 'leafly.active'),
    clientKey: get(integrations, 'leafly.clientKey'),
  }
}

const ThirdPartyLeafly = ({
  onCancel,
  userPermissions,
  updateLeafly,
  history,
  leaflySettings,
}) => (
  <Form
    onSubmit={({ clientKey, enableLeafly }) => {
      updateLeafly(clientKey, enableLeafly)
    }}
    keepDirtyOnReinitialize
    initialValues={{
      enableLeafly: get(leaflySettings, 'store.integrations.leafly.forceDisabled') === true ?
        false :
        get(mapInitialValues(leaflySettings.store), 'active'),
      clientKey: get(mapInitialValues(leaflySettings.store), 'clientKey'),
    }}
    render={({ handleSubmit, values, form, pristine, submitting }) => (
      <Fragment>
        <form onSubmit={handleSubmit}>
          <div>
            <Title>3rd Party integration - Leafly</Title>
            <StyledFormContent>
              <RowDiv>
                <ToggleContainer>
                  <label>Active</label>
                  <FormToggle
                    name="enableLeafly"
                    noStatusText
                    disabled={!userPermissions.write || get(leaflySettings, 'store.integrations.leafly.forceDisabled')}
                    onChange={() => {
                      form.change('enableLeafly', !values.enableLeafly)
                      form.change('activeChangePristine', !values.activeChangePristine)
                    }}
                  />
                </ToggleContainer>
              </RowDiv>
              <RowDiv>
                <ColumnDiv>
                  <RowDiv>
                    <LabelDiv>API Key</LabelDiv>
                    <FormTextField
                      name="clientKey"
                      type="text"
                      placeholder="1234567"
                      suffix={<ProductIcon type="infoLock" />}
                    />
                  </RowDiv>
                </ColumnDiv>
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

ThirdPartyLeafly.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func,
  userPermissions: UserPermissionsPropType,
  updateLeafly: PropTypes.func,
  leaflySettings: PropTypes.object,
}

export default compose(
  withVenueID,
  withNotifications,
  withAuthenticatedEmployee,
  withPermissions('BASIC_SETTINGS'),
  withCancelConfirmation('/settings/thirdparty'),
  withLeaflySettings(),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['leaflySettings']),
  branch(
    ({ leaflySettings }) => !get(leaflySettings, 'store.integrations.leafly.visible'),
    () => PageNotFound(true),
  ),
  withUpdateLeafly(),
)(ThirdPartyLeafly)
