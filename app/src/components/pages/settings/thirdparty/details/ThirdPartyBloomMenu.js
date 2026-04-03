//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { FormToggle } from 'components/common/input/Toggle'
import { FormTextField } from 'components/common/input/TextField'
import { FormTextArea } from 'components/common/input/TextArea'
// Hidden for the v0.5
// import { ProductIcon } from 'components/common/display/ProductIcon'
import QRCode from 'qrcode.react'
import { compose } from 'recompose'
// Hidden for the v0.5
// import Subheader from 'components/common/display/Subheader'
import Button from 'components/common/input/Button'
import Title from 'components/common/display/Title'
import { withCancelConfirmation } from 'components/Modal'
import { Form } from 'react-final-form'
import { get, replace, isEmpty } from 'lodash'
// Hidden for the v0.5
// import { FormSelectField } from 'components/common/input/SelectField'
import { withNotifications } from 'components/Notifications'
import {
  combineValidators,
  sanitizedStringValidator,
  stringOfMaximumLength,
} from 'utils/validators'
import { renderWhileLoading } from 'utils/hoc'
import Spinner from 'components/common/display/Spinner'

// Hidden for the v0.5
// import { Table } from 'components/Table'
import withUpdateBloomMenu from './withUpdateBloomMenu'
import withBloomMenuSettings from './withBloomMenuSettings'

// Hidden for the v0.5
// const StyledSubheader = styled(Subheader)`
//   margin-top: 140px;
//   display: block;
//   width: 100%;
// `
// const StyledTable = styled(Table)`
//   .rt-table {
//     max-height: 600px;
//   }
//   .rt-thead:first-child {
//     display: none;
//   }
// `
const StyledFormContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`

// Hidden for the v0.5
// const StyledSelectField = styled(FormSelectField)`
//   width: 120px;
// `

const RowDiv = styled.div`
  height: 40px;
  width: 100%;
  line-height: 20px;
  vertical-align: middle;
  color: ${colors.grayDark2};
  display: flex;
  margin-bottom: 32px;
`

// Hidden for the v0.5
// const TableDiv = styled.div`
//   width: 320px;
//   display: flex;
//   margin-top: 120px;
//   margin-bottom: 100px;
// `

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

const instructionsValidator = combineValidators(
  sanitizedStringValidator,
  stringOfMaximumLength(115),
)

// Hidden for the v0.5
// const hours = [
//   {
//     name: '0:00',
//     value: '0:00',
//   },
//   {
//     name: '1:00',
//     value: '1:00',
//   },
//   {
//     name: '2:00',
//     value: '2:00',
//   },
//   {
//     name: '3:00',
//     value: '3:00',
//   },
//   {
//     name: '4:00',
//     value: '4:00',
//   },
//   {
//     name: '5:00',
//     value: '5:00',
//   },
//   {
//     name: '6:00',
//     value: '6:00',
//   },
//   {
//     name: '7:00',
//     value: '7:00',
//   },
//   {
//     name: '8:00',
//     value: '8:00',
//   },
//   {
//     name: '9:00',
//     value: '9:00',
//   },
//   {
//     name: '10:00',
//     value: '10:00',
//   },
//   {
//     name: '11:00',
//     value: '11:00',
//   },
// ]

// Hidden for the v0.5
// const hourCategories = [
//   {
//     name: 'AM',
//     value: 'AM',
//   },
//   {
//     name: 'PM',
//     value: 'PM',
//   },
// ]

// Hidden for the v0.5
// const mockData = [
//   {
//     labelDay: 'Monday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Tuesday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Wednesday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Thursday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Friday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Saturday', labelUntil: 'Until',
//   },
//   {
//     labelDay: 'Sunday', labelUntil: 'Until',
//   },

// ]

// Hidden for the v0.5
// const columns = [
//   {
//     Header: '',
//     accessor: 'labelDay',
//     width: 160,
//   }, {
//     Header: '',
//     accessor: 'hour1',
//     width: 160,
//     Cell: () => ( // eslint-disable-line react/prop-types
//       <StyledSelectField
//         options={hours}
//         name="hour"
//         suffix={<ProductIcon type="clock" />}
//       />
//     ),
//   }, {
//     Header: '',
//     accessor: 'hourCategory1',
//     width: 130,
//     Cell: () => ( // eslint-disable-line react/prop-types
//       <StyledSelectField
//         options={hourCategories}
//         name="hourCategory"
//       />
//     ),
//   }, {
//     Header: '',
//     accessor: 'labelUntil',
//   }, {
//     Header: '',
//     accessor: 'hour2',
//     width: 160,
//     Cell: () => ( // eslint-disable-line react/prop-types
//       <StyledSelectField
//         options={hours}
//         name="hour"
//         suffix={<ProductIcon type="clock" />}
//       />
//     ),
//   }, {
//     Header: '',
//     accessor: 'hourCategory2',
//     width: 130,
//     Cell: () => ( // eslint-disable-line react/prop-types
//       <StyledSelectField
//         options={hourCategories}
//         name="hourCategory"
//       />
//     ),
//   },
// ]

const ThirdPartyBloomMenu = ({
  onCancel,
  history,
  bloomMenuSettings,
  updateBloomMenu,
}) => {
  const url = get(bloomMenuSettings, 'store.integrations.onlineMenu.settings.link')

  const generateURL = () => {
    const origin = get(window, 'location.origin', 'https://menu.bloomup.co')
    return `${replace(origin, 'portal', 'menu')}/shop/${url}`
  }

  const mapInitialValues = () => {
    const menuSettings = get(bloomMenuSettings, 'store.integrations.onlineMenu')
    return {
      active: get(menuSettings, 'forceDisabled') === true ?
        false :
        get(menuSettings, 'active'),
      instructions: get(menuSettings, 'instructions', ''),
      link: generateURL(),
    }
  }

  const downloadQR = () => {
    const svgAsXML = (new XMLSerializer()).serializeToString(document.querySelector('#qrcode'))
    const dataURL = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`

    const dl = document.createElement('a')
    document.body.appendChild(dl)
    dl.setAttribute('href', dataURL)
    dl.setAttribute('download', 'qrCode.svg')
    dl.click()
  }

  return (
    <Form
      onSubmit={({ instructions, active }) => {
        updateBloomMenu(instructions, active)
      }}
      keepDirtyOnReinitialize
      initialValues={mapInitialValues()}
      render={({ handleSubmit, form, pristine, submitting, values, errors }) => (
        <Fragment>
          <form onSubmit={handleSubmit}>
            <div>
              <Title>3rd Party integration - Bloom menu</Title>
              <StyledFormContent>
                <RowDiv>
                  <ToggleContainer>
                    <label>Active</label>
                    <FormToggle
                      name="active"
                      noStatusText
                      disabled={get(bloomMenuSettings, 'store.integrations.onlineMenu.forceDisabled')}
                      onChange={() => {
                        form.change('active', !values.active)
                        form.change('activeChangePristine', !values.activeChangePristine)
                      }}
                    />
                  </ToggleContainer>
                </RowDiv>
                {/* Hidden for 0.5 */}
                {/* <RowDiv>
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
                </RowDiv> */}
                <RowDiv>
                  <ColumnDiv>
                    <RowDiv>
                      <LabelDiv>URL</LabelDiv>
                      <FormTextField
                        name="link"
                        type="text"
                        disabled
                        style={{ fontSize: '12px' }}
                      />
                    </RowDiv>
                  </ColumnDiv>
                  <ColumnDiv>
                    <RowDiv>
                      <Button
                        primary
                        onClick={downloadQR}
                      >
                        Download QR Code
                      </Button>
                      <div hidden className="qr-code-div">
                        <QRCode
                          id="qrcode"
                          value={generateURL()}
                          level="H"
                          renderAs="svg"
                          includeMargin
                          size={256}
                        />
                      </div>
                    </RowDiv>
                  </ColumnDiv>
                </RowDiv>
                <RowDiv>
                  <ColumnDiv>
                    <RowDiv>
                      <LabelDiv>Dispensary Customer Directions</LabelDiv>
                      <FormTextArea
                        style={{
                          height: '166px',
                          width: '320px',
                          padding: '5px',
                          verticalAlign: 'bottom',
                        }}
                        name="instructions"
                        validate={instructionsValidator}
                        errorText
                      />
                    </RowDiv>
                  </ColumnDiv>
                </RowDiv>
                {/* Hidden for v0.5 */}
                {/* <RowDiv>
                  <ColumnDiv>
                    <RowDiv>
                      <StyledSubheader
                        textSizeOption={2}
                        color={colors.blueishGray}
                      >
                        OPEN HOURS
                      </StyledSubheader>
                    </RowDiv>
                  </ColumnDiv>
                </RowDiv>
                <TableDiv>
                  <StyledTable
                    data={mockData}
                    columns={columns}
                    getTdProps={() => ({
                      style: {
                        textAlign: 'left',
                      },
                    })}
                  />
                </TableDiv> */}
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
              disabled={submitting || !isEmpty(errors)}
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

ThirdPartyBloomMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func,
  bloomMenuSettings: PropTypes.object,
  updateBloomMenu: PropTypes.func,
}

export default compose(
  withNotifications,
  withCancelConfirmation('/settings/thirdparty'),
  withBloomMenuSettings(),
  withUpdateBloomMenu(),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['bloomMenuSettings']),
)(ThirdPartyBloomMenu)
