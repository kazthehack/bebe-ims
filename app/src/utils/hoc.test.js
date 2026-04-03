import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { MemoryRouter, Redirect } from 'react-router-dom'
import { reducer } from 'store'
import { renderWhileLoading, renderIfEmpty, renderIfError, requireAuthentication } from './hoc'

const mockStore = initialState => createStore(reducer, initialState)

describe('renderWhileLoading', () => {
  const loadingComponent = () => <div>Loading</div>
  const normalComponent = () => <div>Normal</div>
  const Component = renderWhileLoading(loadingComponent)(normalComponent)

  it('should render component when loading', () => {
    const wrapper = mount(<Component data={{ loading: true }} />)
    expect(wrapper.text()).toContain('Loading')
    expect(wrapper.text()).not.toContain('Normal')
  })

  it('should fall through when not loading', () => {
    const wrapper = mount(<Component data={{ loading: false }} />)
    expect(wrapper.text()).toContain('Normal')
    expect(wrapper.text()).not.toContain('Loading')
  })
})

describe('renderIfEmpty', () => {
  const emptyComponent = () => <div>Empty</div>
  const accessor = ({ xs }) => xs
  const normalComponent = () => <div>Normal</div>
  const Component = renderIfEmpty(emptyComponent, accessor)(normalComponent)

  it('should render component when data is empty', () => {
    const wrapper = mount(<Component xs={[]} />)
    expect(wrapper.text()).toContain('Empty')
    expect(wrapper.text()).not.toContain('Normal')
  })

  it('should fall through when there is data', () => {
    const wrapper = mount(<Component xs={[1, 2]} />)
    expect(wrapper.text()).toContain('Normal')
    expect(wrapper.text()).not.toContain('Empty')
  })
})

describe('renderIfError', () => {
  const errorComponent = () => <div>Error</div>
  const normalComponent = () => <div>Normal</div>
  const Component = renderIfError(errorComponent)(normalComponent)

  it('should render component when error', () => {
    const wrapper = mount(<Component data={{ error: true }} />)
    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).not.toContain('Normal')
  })

  it('should fall through when there is no error', () => {
    const wrapper = mount(<Component data={{ error: false }} />)
    expect(wrapper.text()).toContain('Normal')
    expect(wrapper.text()).not.toContain('Error')
  })
})

describe('requireAuthentication', () => {
  const NormalComponent = () => <div>Normal</div>
  const Component = requireAuthentication(NormalComponent)
  const withFixture = store => C => ({ ...props }) => (
    <Provider store={store}>
      <MemoryRouter>
        <C {...props} />
      </MemoryRouter>
    </Provider>
  )

  it('should redirect when user is not authenticated', () => {
    const state = reducer(undefined, { type: 'EMPTY' })
    const store = mockStore(state)
    const Test = withFixture(store)(Component)
    const wrapper = mount(<Test />)
    expect(wrapper.find(Redirect)).toHaveLength(1)
  })

  it('should render when user is authenticated', () => {
    localStorage.setItem('refreshToken', 'test')
    sessionStorage.setItem('accessToken', 'test')
    const store = createStore(reducer, {})
    const Test = withFixture(store)(Component)
    const wrapper = mount(<Test />)
    expect(wrapper.find(Redirect)).toHaveLength(0)
    expect(wrapper.text()).toContain('Normal')
  })
})
