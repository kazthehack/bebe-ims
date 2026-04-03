import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get, filter } from 'lodash'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import ReactGA from 'react-ga'
import colors from 'styles/colors'
import { compose } from 'recompose'
import Modal, { withModals, connectModal } from 'components/Modal'
import printQRCode from 'utils/printQRCode'
import { withNotifications } from 'components/Notifications'
import { withVenueID } from 'components/Venue'
import withUpdatePrinterAddress from 'components/pages/settings/venue/withUpdatePrinterAddress'
import { withPrinterAddress as printerAddressHOC } from 'components/pages/settings/venue/withPrinterAddress'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import SelectPackageTable from './partials/SelectPackageTable'
import BarcodeNumberField from './partials/BarcodeNumberField'
import BarcodePriceField from './partials/BarcodePriceField'
import PrinterAddressField from './partials/PrinterAddressField'

const ConnectedModal = connectModal('PrintBarcodeModal')(Modal)

const StyledModal = styled(ConnectedModal)`
  border-radius: 4px;
  background-color: ${colors.white};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  outline: none;
`
const customStyle = {
  overlay: {
    zIndex: 1,
  },
}
const StyledHeader = styled.div`
  width: 557px;
  min-height: 30px;
  font-family: Roboto;
  font-size: 26px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: ${colors.grayDark3};
  margin: 44px auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledButton = styled(Button)`
  margin-top: 16px;
  margin-left: 38px;
  margin-right: 38px;
`

const ButtonWrapper = styled.div`
  height: 88px;
  border-top: solid 1px ${colors.grayLight5};
  background-color: ${colors.grayLight4};
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ContentStyled = styled.div`
  padding: 0px 30px;
`

const PrintBarcodeModal = ({
  isFromPkg = false,
  flower,
  canna,
  popModal,
  type,
  values,
  updatePrinterAddress,
  form,
  addNotification,
  errors,
  submitting,
  packages,
  weightList,
  data,
  price,
  product,
}) => {
  let assignedPackages
  if (isFromPkg) {
    assignedPackages = packages
  } else {
    assignedPackages = get(values, 'packages')
  }
  const filteredPackages = filter(assignedPackages, pkg => pkg.finishedDate === null)
  const sortedPackage = filteredPackages.length === 1 ?
    filteredPackages :
    filteredPackages.sort((a, b) =>
      (a.providerInfo.metrcProduct.name >= b.providerInfo.metrcProduct.name ? 1 : -1))
  const [selectedPkg, setSelectedPackage] = useState(get(sortedPackage[0], 'providerInfo.tag'))
  const [prePkgd, setPrePkgd] = useState(false)
  const [wght, setWeight] = useState(flower ? '0' : '1')
  const [priceState, setPriceState] = useState(price)
  return (
    <StyledModal style={customStyle}>
      <StyledHeader>
        Printing {get(product, 'name')} QR Label
      </StyledHeader>
      { canna &&
        <SelectPackageTable
          data={filteredPackages}
          setSelectedPackage={setSelectedPackage}
        />
      }
      <ContentStyled>
        <BarcodePriceField
          flower={flower}
          type={type}
          form={form}
          canna={canna}
          price={priceState}
          setPrePkgd={setPrePkgd}
          setWeight={setWeight}
          setPrice={setPriceState}
          weightList={weightList}
          values={values}
          prepackaged={prePkgd}
        />
        <BarcodeNumberField />
        <PrinterAddressField />
      </ContentStyled>
      <ButtonWrapper>
        <StyledButton
          onClick={() => popModal()}
        >
          CANCEL
        </StyledButton>
        <StyledButton
          primary
          disabled={!!get(errors, 'qrcodes') || submitting}
          onClick={() => {
            ReactGA.event({
              category: GATypes.eventCategories.productLabelQRCode,
              action: GATypes.eventActions.printed,
              label: isFromPkg ? 'package' : 'product',
            })

            const objQRCode = {
              prodName: data.name,
              UUID: data.inventoryId,
              price: flower && !prePkgd ? undefined : priceState,
              wght: flower && !prePkgd ? 0 : wght,
              tag: selectedPkg || get(sortedPackage[0], 'providerInfo.tag'),
              prePackaged: flower ? prePkgd : true,
              printerAddress: values.printerAddress,
              qrCodes: values.qrcodes,
              flower,
            }
            printQRCode(objQRCode, addNotification)
            updatePrinterAddress(values.printerAddress)
            popModal()
          }}
        >
          PRINT
        </StyledButton>
      </ButtonWrapper>
    </StyledModal>
  )
}

PrintBarcodeModal.propTypes = {
  isFromPkg: PropTypes.bool,
  popModal: PropTypes.func,
  flower: PropTypes.bool,
  canna: PropTypes.bool,
  type: PropTypes.string,
  values: PropTypes.object,
  data: PropTypes.object,
  updatePrinterAddress: PropTypes.func,
  form: PropTypes.object,
  addNotification: PropTypes.func,
  errors: PropTypes.object,
  submitting: PropTypes.bool,
  weightList: PropTypes.arrayOf(PropTypes.object),
  packages: PropTypes.arrayOf(PropTypes.object),
  price: PropTypes.string,
  product: PropTypes.object,
}

export default compose(
  withNotifications,
  withModals,
  withVenueID,
  printerAddressHOC,
  withUpdatePrinterAddress(),
)(PrintBarcodeModal)
