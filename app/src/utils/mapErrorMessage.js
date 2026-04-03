// A place for mapping cryptic error messages from the back-end, etc. to user facing error messages
// Note: I don't think this is very maintainable and we should really have the back-end provide
// more useful messages to the front-end. It seems like it is currently just collapsing all of the
// detailed error messages into an array of error messages and presenting that as the 'message'

const ERROR_MAP = {
  // Displayed when the user fails to login with a correct combination of username and password
  'TypeError: Failed to fetch': 'Unable to connect, check your internet connection',
  'GraphQL error: Invalid email and/or password': 'Sorry, the email/password you entered is incorrect - please try again.',
  '(psycopg2.IntegrityError) duplicate key value violates unique constraint "employee_email_key"': 'The email is already in use',
  authenticatedResetPassword: {
    'GraphQL error: Invalid password': 'incorrect current password',
  },
}

export default ERROR_MAP

// Derived field would yield an error due to invalid user input in precursor field
export const genericDervivedFieldError = 'Invalid'

// TODO: move towards using this as the default error handler
export const humanReadableError = ({ graphQLErrors, networkError }) => {
  if (networkError) return ERROR_MAP[networkError]
  if (graphQLErrors.length > 0) return ERROR_MAP[graphQLErrors[0]]
  return undefined
}
