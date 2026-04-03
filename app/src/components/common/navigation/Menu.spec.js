import React from 'react'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from 'store/modules'
import Menu from './Menu'

describe('<Menu />', () => {
  it('Menu renders as expected when enableDareMode is FALSE', () => {
    const mockStore = createStore(reducer, {})
    // https://jestjs.io/docs/en/snapshot-testing
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <BrowserRouter>
            <Menu enableDareMode={false} />
          </BrowserRouter>
        </Provider>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Menu renders as expected when enableDareMode is TRUE', () => {
    const mockStore = createStore(reducer, {})
    // https://jestjs.io/docs/en/snapshot-testing
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <BrowserRouter>
            <Menu enableDareMode />
          </BrowserRouter>
        </Provider>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
