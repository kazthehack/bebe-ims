import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import colors from 'styles/colors'
import Box from 'components/common/container/Box'
import { Icon } from 'components/common/display'
import Modal, { withModals, connectModal } from 'components/Modal'


const ConnectedModal = connectModal('InventoryManifest')(Modal)

const StyledModal = styled(ConnectedModal)`
  width: 420px;
  height: 400px;
  border-radius: 4px;
  background-color: ${colors.white};
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin:auto;
  text-align: center;
  outline: none;
`

const StyledHeader = styled.div`
  width: 250px;
  height: 30px;
  font-family: Roboto;
  font-size: 26px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: ${colors.black};
  margin-top: 30px;
  margin-bottom: 5px;
  display: inline-block;
`

const StyledSubHeader = styled.div`
  width: 217px;
  height: 16px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: ${colors.grayLight};
  margin-bottom: 14px;
  text-align: center;
  display: inline-block;
`

const StyledText = styled.div`
  width: 340px;
  height: 48px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  display: inline-block;
  text-align: center;
  color: ${colors.grayLight5};
`

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  margin-left: 26px;
`

const ButtonWrapper = styled.div`
  width: 419px;
  height: 88px;
  border: solid 1px ${colors.grayLight5};
  background-color: ${colors.grayLight4};
  text-align: center;
  margin-top: 31px;
`

const StyledIcon = styled(Icon)`
  padding-top: 18px;
  height: 69px;
  font-size: 40px;
  color: ${props => (props.disabled ? colors.grayLight : colors.blue)};
`

const StyledButton = styled(Button)`
  margin-top: 20px;
`

const boxStyle = ({
  textAlign: 'center',
  padding: 0,
  display: 'inline-block',
  marginRight: '27px',
  width: '150px',
  height: '119px',
  borderRadius: '4px',
  border: `solid 1px ${colors.blue}`,
  backgroundColor: colors.white,
  marginBottom: '10px',
  fontWeight: 500,
})

const StyledLabel = styled.div`
  font-family: Roboto;
  font-size: 16px;
  letter-spacing: 0.9px;
  text-align: center;
  color: ${colors.blue};
  text-transform: uppercase;
  margin-top: -20px;
  font-weight: 500,
`

const SubLabel = styled.div`
  font-family: Roboto;
  font-size: 12px;
  color: ${colors.blue};
`
const ActionBox = ({ label, sublabel, icon }) => (
  <Box
    boxStyle={boxStyle}
    onClick={() => {}}
  >
    <StyledIcon name={icon} />
    <StyledLabel>
      {label}
      <SubLabel>
        {sublabel}
      </SubLabel>
    </StyledLabel>
  </Box>
)

const InventoryManifestModal = ({
  pushModal,
  popModal,
}) => (
  <div>
    <h3>Inventory Manifest Test</h3>
    <Button onClick={() => pushModal('InventoryManifest')}> Click to view Modal </Button>
    <StyledModal>
      <StyledHeader>Inventory Manifest</StyledHeader>
      <StyledSubHeader>DOWNLOAD INVENTORY DATA</StyledSubHeader>
      <IconBox>
        <ActionBox
          label="PRINT"
          sublabel="THE DOCUMENT"
          icon="printer"
          onClick={() => {}}
        />
        <ActionBox
          label="DOWNLOAD"
          sublabel="XLSX"
          icon="exit-down"
          onClick={() => {}}
        />
      </IconBox>
      <StyledText>
        This report is a snapshat of the current inventory.
        Any sales, returns or adjustments made after downloading this report will not be
          represented.
      </StyledText>
      <ButtonWrapper>
        <StyledButton onClick={() => popModal()}> BACK </StyledButton>
      </ButtonWrapper>
    </StyledModal>
  </div>
)

InventoryManifestModal.propTypes = {
  pushModal: PropTypes.func,
  popModal: PropTypes.func,
}

ActionBox.propTypes = {
  label: PropTypes.string.isRequired,
  sublabel: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default compose(
  withModals,
)(InventoryManifestModal)
