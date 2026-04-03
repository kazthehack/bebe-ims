import React from 'react'
import PropTypes from 'prop-types'

const Modal = ({ children }) => <>{children}</>

Modal.propTypes = {
  children: PropTypes.node,
}

Modal.defaultProps = {
  children: null,
}

export default Modal
