// TODO: implement overlay animations
import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import { merge, cloneDeep } from 'lodash'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import colors from 'styles/colors'
/* eslint no-confusing-arrow: 0 */

export const Header = styled.div`
  font-size: 26px;
  margin: 40px 40px 0 40px;
  text-align: center;
  letter-spacing: 1px;
  font-weight: 500;
  color: #4d4d4d;
`

export const SubHeader = styled.div`
  margin: 8px 40px 16px 40px;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;
  color: #8b939e;
  text-transform: uppercase;
`

export const Body = styled.div`
  margin: 0 40px 0px 40px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
`

export const Footer = styled.div`
  background-color: #f9f9f9;
  border: solid 1px #e1e1e1;
  padding: 16px 40px 16px 40px;
  text-align: center;
  height: 48px;
`

export const ButtonsWrapper = styled.div`
  display: inline-block;
`

export const SecondaryButton = styled(Button)`
  margin: 0em 1em 0em 0em;
`

// make sure to deepCopy if merging with this style
// e.g. merge(cloneDeep(defaultModalStyle, modalStyle))
export const defaultModalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1500', // This is to move the modal in front of the muiThemeable components
    minWidth: '554px',
    padding: '0',
    outline: 'none',
    animationFillMode: 'none',
  },
  overlay: {
    zIndex: '1400', // This is to move the overlay in front of the muiThemeable components
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
}

const StyledLabel = styled.div`
  color: ${colors.red};
  margin-bottom: 8px;
`

/**
 * A modal for 0, 1, or 2 button modals with a standardized style. Props:
 * modalStyle, contentStyle, footerStyle - these props override the standard styles in their
 *  respective divs.
 * header, subHeader - provide the header and subHeader text.
 * primaryButton, secondaryButton - objects in format { onClick, text } that, if present, will
 *  add those buttons to the footer. Omitting both will cause there to not be a footer.
 * children - The interior components of the body of the modal.
 */
const ButtonModal = ({
  children,
  modalStyle = {},
  header,
  subHeader,
  contentStyle = {},
  footerStyle = {},
  primaryButton,
  secondaryButton,
  warningMessage = '',
  warningFlag = false,
  ...props
}) => {
  const newModalStyle = merge(cloneDeep(defaultModalStyle), modalStyle)
  return (
    <Modal
      style={newModalStyle}
      ariaHideApp={false}
      closeTimeoutMS={150}
      {...props}
    >
      <Header style={contentStyle.header}>{header}</Header>
      { subHeader && <SubHeader style={contentStyle.subHeader}>{subHeader}</SubHeader> }
      <Body style={contentStyle.content}>{children}</Body>
      {(primaryButton || secondaryButton) &&
        <Footer style={footerStyle.footer}>
          <ButtonsWrapper>
            {warningFlag &&
            <StyledLabel>
              {warningMessage}
            </StyledLabel>
            }
            {secondaryButton &&
              <SecondaryButton
                type={secondaryButton.type}
                onClick={secondaryButton.onClick}
                style={footerStyle.button}
                disabled={secondaryButton.disabled}
              >{secondaryButton.text}
              </SecondaryButton>
            }
            {primaryButton &&
              <Button
                primary
                type={primaryButton.type}
                onClick={primaryButton.onClick}
                style={footerStyle.button}
                disabled={primaryButton.disabled}
              >{primaryButton.text}
              </Button>
            }
          </ButtonsWrapper>
        </Footer>
      }
    </Modal>
  )
}

ButtonModal.propTypes = {
  children: PropTypes.node,
  warningMessage: PropTypes.string,
  warningFlag: PropTypes.bool,
  modalStyle: PropTypes.object,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  subHeader: PropTypes.string,
  contentStyle: PropTypes.object,
  footerStyle: PropTypes.object,
  primaryButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  }),
  secondaryButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  }),
}

export default ButtonModal
