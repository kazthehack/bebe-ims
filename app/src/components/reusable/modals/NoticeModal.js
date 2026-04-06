import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from './FormModal'

const Message = styled.div`
  margin-top: 8px;
  color: #4b6176;
  font-size: 13px;
  line-height: 1.45;
`

const NoticeModal = ({
  open,
  title,
  message,
  onClose,
  acknowledgeLabel,
}) => (
  <FormModal
    open={open}
    title={title}
    onClose={onClose}
    onConfirm={onClose}
    confirmLabel={acknowledgeLabel}
    cancelLabel="Cancel"
    width="440px"
    showCancel={false}
    actionsAlign="right"
    closeControl="glyph"
  >
    <Message>{message}</Message>
  </FormModal>
)

NoticeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  acknowledgeLabel: PropTypes.string,
}

NoticeModal.defaultProps = {
  title: 'Notice',
  message: '',
  acknowledgeLabel: 'OK',
}

export default NoticeModal
