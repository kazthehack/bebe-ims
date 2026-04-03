import React from 'react'
import PropTypes from 'prop-types'
// import PropTypes from 'prop-types'
import ButtonModal from './ButtonModal'

// TODO: use different transition effect css for Alerts & Confirms?
const Confirm = ({
  modalStyle = {
    content: {
      width: '554px',
      marginBottom: '40px',
    },
  },
  ...props
}) => (
  <ButtonModal
    modalStyle={modalStyle}
    {...props}
  />
)

Confirm.propTypes = {
  modalStyle: PropTypes.shape({
    content: PropTypes.object,
    overlay: PropTypes.object,
  }),
}

export default Confirm
