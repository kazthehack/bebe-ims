import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { hotjar } from 'react-hotjar'
import { APP_ENABLE_PUBLIC_DEMO_MODE } from 'environment'
import { initializeGA, trackWebVitals } from 'utils/google-analytics'
import { Provider } from 'react-redux'
import Notifications from 'components/Notifications'
import CheckStoreCreationStatus from 'components/Demo/CheckStoreCreationStatus'
import AppRouter from 'components/AppRouter'
import { ListPageContextProvider } from 'contexts/ListPageContext'
import GlobalStyle from 'styles/globalStyles'
import { useWebVitals } from 'react-web-vitals'

const App = ({ store, ...props }) => {
  useEffect(() => {
    initializeGA()
  }, [])

  useWebVitals({ reporter: trackWebVitals })

  useEffect(() => {
    // TODO: replace hardcoded ID with environment variable
    hotjar.initialize(2276484, 6)
  }, [])

  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Notifications>
          <ListPageContextProvider>
            <AppRouter {...props} />
          </ListPageContextProvider>
          {!!APP_ENABLE_PUBLIC_DEMO_MODE &&
            <CheckStoreCreationStatus />
          }
        </Notifications>
      </Provider>
    </>
  )
}

App.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func,
    getState: PropTypes.func,
  }),
}

export default App
