import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  getModals,
  isModalOpen,
  isModalInStack,
} from 'store/modules/modals'
import withModals from 'components/Modal/withModals'

const noop = () => {}

export default modalId => (C) => {
  const isOpen = isModalOpen(modalId)
  const isInStack = isModalInStack(modalId)

  const mapStateToProps = (state) => {
    const modals = getModals(state)
    return {
      isOpen: isOpen(modals),
      isInStack: isInStack(modals),
    }
  }

  const mergeProps = (stateProps, dispatchProps, ownProps = {}) => {
    const { popModal, onRequestClose = noop } = ownProps
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
      onRequestClose: () => {
        onRequestClose()
        popModal()
      },
    })
  }

  class ConnectedModal extends Component {
    componentDidUpdate(prevProps) {
      const { props } = this
      const { onClose = noop, onRemove = noop } = props
      if (!props.isOpen && prevProps.isOpen) {
        onClose(modalId)
      }
      if (!props.isInStack && prevProps.isInStack) {
        onRemove(modalId)
      }
    }

    componentWillUnmount() {
      const { props } = this
      const { removeModals } = props
      if (props.isInStack) {
        removeModals(modalId)
      }
    }

    render() {
      return <C {...this.props} />
    }
  }

  ConnectedModal.propTypes = {
    removeModals: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    onClose: PropTypes.func,
    onRemove: PropTypes.func,
    isOpen: PropTypes.bool,
    isInStack: PropTypes.bool,
  }

  return compose(
    withModals,
    connect(mapStateToProps, null, mergeProps),
  )(ConnectedModal)
}
