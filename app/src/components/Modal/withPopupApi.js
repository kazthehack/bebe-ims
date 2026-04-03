import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { compose, mapProps, withState } from 'recompose'
import withModals from './withModals'

export const POPUP_OPTIONS = PropTypes.shape({
  title: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  promptText: PropTypes.string,
})

export const POPUP_PROPTYPES = PropTypes.shape({
  options: POPUP_OPTIONS,
  open: PropTypes.func,
  resolve: PropTypes.func,
  close: PropTypes.func,
})

const withPopupOptions = withState('popupOptions', 'popupSetOptions', {})

const withResolver = modalId => C => class extends Component {
  static propTypes = {
    popupOptions: POPUP_OPTIONS,
    popupSetOptions: PropTypes.func,
    pushModal: PropTypes.func,
    removeModals: PropTypes.func,
  }

  promise = null
  resolver = null

  open = (options) => {
    const {
      popupSetOptions,
      pushModal,
    } = this.props
    popupSetOptions(options)
    this.promise = new Promise((resolve) => {
      this.resolver = resolve
    })
    pushModal(modalId)
    return this.promise
  }

  resolve = (...args) => {
    if (this.resolver) this.resolver(...args)
  }

  close = (...args) => {
    const { removeModals } = this.props
    this.resolve(...args)
    removeModals(modalId)
  }

  render() {
    return (
      <C
        {...this.props}
        popup={{
          options: this.props.popupOptions,
          open: this.open,
          resolve: this.resolve,
          close: this.close,
        }}
      />
    )
  }
}

const withProps = mapProps(props => ({
  ...(omit(props, [
    'popupOptions',
    'popupSetOptions',
    'pushModal',
    'popModal',
    'replaceModal',
    'clearModals',
    'removeModals',
  ])),
}))


const withPopupApi = modalId => C => compose(
  withModals, // TODO: refactor popups to act independently from modal stack?
  withPopupOptions,
  withResolver(modalId),
  withProps,
)(C)

export default withPopupApi
