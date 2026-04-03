//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 8/7/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import 'styles/globalStyles'
import 'assets/BloomLinearIcons/style.css'
import 'assets/css/ModalTransitions.css'
import 'assets/css/CustomDatePicker.css'
import 'typeface-roboto' // eslint-disable-line import/extensions
import 'typeface-roboto-condensed' // eslint-disable-line import/extensions
import { render } from 'react-dom'
import ReactModal from 'react-modal'
import configureStore, { localStore, sessionStore } from 'store'
import App from 'components/App'

ReactModal.setAppElement('#root')

const localState = localStore.loadState() || {}
const sessionState = sessionStore.loadState() || {}
const persistedState = {
  ...localState,
  ...sessionState,
}
const store = configureStore(persistedState)

const renderApp = (Component) => {
  render(
    <Component store={store} />,
    document.getElementById('root'),
  )
}

renderApp(App)

if (module && module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default // eslint-disable-line global-require
    renderApp(NextApp)
  })
}
