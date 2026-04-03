import { compose, withProps } from 'recompose'
import { withRouter } from 'react-router'
import ErrorPage from 'components/pages/ErrorPage'
import { requireAuthentication } from 'utils/hoc'

const PageNotFound = (nav, addPageContent) => compose(
  withRouter, // Adds the history prop
  requireAuthentication, // Redirects user to the login page if not logged in
  withProps(() => ({
    message: 'The page you are trying to reach does not exist or has been moved.',
    status: 404,
    statusText: 'Page not found',
    nav,
    addPageContent,
  })),
)(ErrorPage)

export default PageNotFound
