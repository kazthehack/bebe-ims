import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(23, 33, 45, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

const Panel = styled.div`
  width: ${({ $width }) => $width || '480px'};
  border: 1px solid #d6e0eb;
  border-radius: 4px;
  background: #f8fafc;
  padding: 14px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`

const Title = styled.h3`
  margin: 0;
`

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #6f8296;
  cursor: pointer;
  padding: 0 2px;
  font-size: 18px;
  line-height: 1;
  opacity: 0.75;

  &:hover {
    opacity: 1;
    color: #25384c;
  }
`

const CloseDotButton = styled.button`
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: #eef3f8;
  }

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #6f8296;
  }
`

const Body = styled.div``

const Footer = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: ${({ $actionsAlign }) => ($actionsAlign === 'left' ? 'flex-start' : 'flex-end')};
  gap: 8px;
`

const Button = styled.button`
  height: 38px;
  border: 1px solid ${({ $primary }) => ($primary ? '#25384c' : '#bec8d3')};
  background: ${({ $primary }) => ($primary ? '#25384c' : '#f0f3f6')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#41576d')};
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
`

const FormModal = ({
  open,
  title,
  onClose,
  onConfirm,
  children,
  confirmLabel,
  cancelLabel,
  width,
  confirmDisabled,
  actionsAlign,
  closeControl,
  showCloseControl,
  showCancel,
}) => {
  if (!open) return null

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(event) => event.stopPropagation()} $width={width}>
        <Header>
          <Title>{title}</Title>
          {showCloseControl && closeControl === 'dot' && (
            <CloseDotButton type="button" aria-label="Close modal" onClick={onClose} />
          )}
          {showCloseControl && closeControl === 'glyph' && (
            <CloseButton type="button" aria-label="Close modal" onClick={onClose}>&times;</CloseButton>
          )}
        </Header>
        <Body>{children}</Body>
        <Footer $actionsAlign={actionsAlign}>
          {showCancel && <Button type="button" onClick={onClose}>{cancelLabel}</Button>}
          <Button $primary type="button" onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</Button>
        </Footer>
      </Panel>
    </Overlay>
  )
}

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  width: PropTypes.string,
  confirmDisabled: PropTypes.bool,
  actionsAlign: PropTypes.oneOf(['left', 'right']),
  closeControl: PropTypes.oneOf(['glyph', 'dot']),
  showCloseControl: PropTypes.bool,
  showCancel: PropTypes.bool,
}

FormModal.defaultProps = {
  confirmLabel: 'Save',
  cancelLabel: 'Cancel',
  width: '480px',
  confirmDisabled: false,
  actionsAlign: 'right',
  closeControl: 'dot',
  showCloseControl: true,
  showCancel: true,
}

export default FormModal
