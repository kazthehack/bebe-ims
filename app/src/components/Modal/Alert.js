import React from 'react'
// import PropTypes from 'prop-types'
import ButtonModal from './ButtonModal'

// TODO: styles for generic "confirm" dialogs, or remove and use ButtonModal directly?
// TODO: use different transition effect css for Alerts & Confirms?
const Alert = ({
  ...props
}) => <ButtonModal {...props} />

export default Alert
