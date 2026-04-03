import React, { Fragment } from 'react'
import { v4 } from 'uuid'
import { createSelector } from 'reselect'
import PropTypes from 'prop-types'
import connectModal from './connectModal'
import withPopupApi, { POPUP_PROPTYPES } from './withPopupApi'
import Alert from './Alert'

const styles = {
  contentStyle: {
    content: {
      marginBottom: 40,
      whiteSpace: 'pre-wrap',
      width: '554px',
    },
  },
}

export default (id = v4()) => (C) => {
  const modalId = `alert:${id}`
  const ConnectedAlert = connectModal(modalId)(Alert)

  const getAlertFn = createSelector(
    popup => popup.open,
    open => (options) => {
      const { title, message, primaryText, contentStyle, onCloseURL } = options
      return open({ title, message, primaryText, contentStyle, onCloseURL })
    },
  )

  const WithAlert = ({
    popup,
    history,
    ...props
  }) => (
    <Fragment>
      <C
        history={history}
        {...props}
        alert={getAlertFn(popup)}
      />
      <ConnectedAlert
        contentStyle={popup.options.contentStyle || styles.contentStyle}
        header={popup.options.title}
        primaryButton={{
          text: popup.options.primaryText || 'OK',
          onClick: () => {
            popup.close()
            if (popup.options.onCloseURL) history.push(popup.options.onCloseURL)
          },
        }}
        onRequestClose={() => {
          popup.resolve()
          if (popup.options.onCloseURL) history.push(popup.options.onCloseURL)
        }}
      >
        {popup.options.message}
      </ConnectedAlert>
    </Fragment>
  )

  WithAlert.propTypes = { popup: POPUP_PROPTYPES, history: PropTypes.object }

  return withPopupApi(modalId)(WithAlert)
}
