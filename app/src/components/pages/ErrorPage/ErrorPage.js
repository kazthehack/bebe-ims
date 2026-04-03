//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import PageContent from 'components/pages/PageContent'
import NoNav from './NoNavPage'
import Nav from './NavPage'

/**
 * ErrorPage comoponent to display when errors mean that the requested page can't display.
 * There's a Nav is displayed if the menu and topbar are visible,  NoNav is displayed if they are
 * not. addPageContent prop is present to handle error pages that may or may not already exist
 * inside a PageContent component.
 */

const ErrorPage = ({ message, status, statusText, nav, history, logout, addPageContent }) => {
  if (!nav) {
    return (
      <NoNav
        message={message}
        statusCode={status}
        statusText={statusText}
        history={history}
        logout={logout}
      />
    )
  } else if (addPageContent) {
    return (
      <PageContent>
        <Nav message={message} statusCode={status} statusText={statusText} history={history} />
      </PageContent>
    )
  }
  return (
    <Nav message={message} statusCode={status} statusText={statusText} history={history} />
  )
}

ErrorPage.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired, // Could cast this into a string too
  statusText: PropTypes.string.isRequired,
  nav: PropTypes.bool,
  history: PropTypes.object.isRequired,
  logout: PropTypes.func,
  addPageContent: PropTypes.bool,
}

export default ErrorPage
