import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { createStore } from 'redux'
import ReactModal from 'react-modal'
import { Provider } from 'react-redux'
import reducer from 'store/modules'

ReactModal.setAppElement('body') // This may instead need to go in the `setupTests.js` sript for jest?

const mountWithMocks = (Component, mocks = [], initialState = {}) => {
  void mocks
  const mockStore = createStore(reducer, initialState)
  return mount(
    <Provider store={mockStore}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </Provider>,
  )
}

export default mountWithMocks
