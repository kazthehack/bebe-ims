import { toLower } from 'lodash'

const {
  REACT_APP_API_ENDPOINT = '',
  REACT_APP_API_ACCESS_TOKEN = '',
  REACT_APP_TEST = null,
  REACT_APP_VERSION = 'unknown',
  REACT_APP_ENABLE_PUBLIC_DEMO_MODE = false,
} = process.env

export const API_ENDPOINT = REACT_APP_API_ENDPOINT
export const API_ACCESS_TOKEN = REACT_APP_API_ACCESS_TOKEN
export const APP_TEST = REACT_APP_TEST
export const APP_VERSION = REACT_APP_VERSION
export const APP_ENABLE_PUBLIC_DEMO_MODE = toLower(REACT_APP_ENABLE_PUBLIC_DEMO_MODE) === 'true'

// Expose some ENV vars on window for team-use with browser dev tools
// on deployed environments.  Never use these values in production code;
// instead use the module exports above.
window.env = {
  API_ENDPOINT,
  APP_TEST,
  APP_VERSION,
  APP_ENABLE_PUBLIC_DEMO_MODE,
}
