//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { compose } from 'recompose'
import { get } from 'lodash'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'
import { FormToggle } from 'components/common/input/Toggle'
import { FormTextField } from 'components/common/input/TextField'
import { ProductIcon } from 'components/common/display/ProductIcon'
import Button from 'components/common/input/Button'
import Title from 'components/common/display/Title'
import { withCancelConfirmation } from 'components/Modal'
import { Form } from 'react-final-form'
import { withNotifications } from 'components/Notifications'
import withUpdateIntegrations from './withUpdateIntegrations'
import withMetrcSettings from './withMetrcSettings'

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

const StyledButton = styled(Button)`
  height: 41px;
  margin-left: 80px;
`

const FooterButtons = styled.div`
  position: fixed;
  bottom: 65px;
  right: 64px;
`

const CONFIRM_MESSAGE = `All sales that are still in the queue will be discarded and will not be
  sent to Metrc. Transactions in read-only mode will need to be imported to Metrc via CSV upload.`

const ThirdPartyMetrc = ({
  onCancel = () => {},
  metrcSettings,
  submitUpdateIntegrations,
  history,
  confirm,
}) => {
  // const forceDisabled = get(metrcSettings, 'store.integrations.metrc.forceDisabled')

  const mapInitialValues = () => {
    const settings = get(metrcSettings, 'store.integrations.metrc')
    const licenseNumber = get(settings, 'licenseNumber')
    const userKey = get(settings, 'userKey')
    const readOnly = get(settings, 'readOnly')
    return {
      active: !APP_ENABLE_PUBLIC_DEMO_MODE,
      licenseNumber,
      userKey,
      readOnly,
    }
  }

  return (
    <Form
      onSubmit={({ licenseNumber, userKey, readOnly }) =>
        submitUpdateIntegrations(licenseNumber, userKey, readOnly)
      }
      keepDirtyOnReinitialize
      initialValues={mapInitialValues()}
      render={({ handleSubmit, form, pristine, submitting, values }) => (
        <Fragment>
          <form onSubmit={handleSubmit}>
            <div>
              <Title>3rd Party integration - Metrc</Title>
              <StyledFormContent>
                <RowDiv>
                  <ToggleContainer>
                    <label>Active</label>
                    <FormToggle
                      name="active"
                      noStatusText
                      disabled
                    />
                  </ToggleContainer>
                </RowDiv>
                <RowDiv>
                  <ToggleContainer>
                    <label>Read-only mode</label>
                    <FormToggle
                      name="readOnly"
                      noStatusText
                      disabled={!!APP_ENABLE_PUBLIC_DEMO_MODE}
                      onChange={() => {
                        if (!values.readOnly) {
                          confirm({
                            title: 'Are you sure?',
                            message: CONFIRM_MESSAGE,
                          }).then((confirmed) => {
                            if (confirmed) {
                              form.change('readOnly', !values.readOnly)
                              form.change('activeChangePristine', !values.activeChangePristine)
                            } else {
                              form.change('readOnly', false)
                            }
                          })
                        } else {
                          form.change('readOnly', !values.readOnly)
                          form.change('activeChangePristine', !values.activeChangePristine)
                        }
                      }}
                    />
                  </ToggleContainer>
                </RowDiv>
                <RowDiv>
                  <ColumnDiv>
                    <RowDiv>
                      <LabelDiv>License</LabelDiv>
                      <FormTextField
                        disabled={!!APP_ENABLE_PUBLIC_DEMO_MODE}
                        name="licenseNumber"
                        type="text"
                        placeholder="000-X0000"
                        suffix={<ProductIcon type="infoLock" />}
                      />
                    </RowDiv>
                    <RowDiv>
                      <LabelDiv>API Key</LabelDiv>
                      <FormTextField
                        disabled={!!APP_ENABLE_PUBLIC_DEMO_MODE}
                        name="userKey"
                        type="text"
                        placeholder="1234567"
                        suffix={<ProductIcon type="infoLock" />}
                      />
                    </RowDiv>
                  </ColumnDiv>
                  {false && // temporarily hidden until backend work is done
                    <StyledButton
                      primary
                      onClick={() => {}}
                    >
                      TEST THE CONNECTION
                    </StyledButton>
                  }
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
}

ThirdPartyMetrc.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  metrcSettings: PropTypes.object,
  submitUpdateIntegrations: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default compose(
  withNotifications,
  withMetrcSettings(),
  withUpdateIntegrations(), // requires withNotifications
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['metrcSettings']),
  withCancelConfirmation('/settings/thirdparty'),
)(ThirdPartyMetrc)
