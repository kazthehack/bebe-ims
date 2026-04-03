import { combineReducers } from 'redux'
import configureStorage from './reduxStorage'

const STATE_KEY = 'state'
const TOKEN_KEY = 'token'

const { sessionStorage, localStorage } = window

const mockReducer = type => (state = 0, action) => {
  if (action.type === type) return state + 1
  return state
}

const reducer = combineReducers({
  foo: mockReducer('foo'),
  bar: mockReducer('bar'),
})

describe('configureStorage', () => {
  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('throws error if called without "storage" option', () => {
    expect(() => {
      configureStorage()
    }).toThrow()
  })


  it('loads `undefined` when no persisted state exists', () => {
    const localStore = configureStorage({
      storage: localStorage,
    })
    const state = localStore.loadState()
    expect(state).toEqual(undefined)
  })

  it('will not persist any branches if none are specified in "paths" option', () => {
    const sessionStore = configureStorage({
      storage: sessionStorage,
      stateKey: STATE_KEY,
      paths: [],
    })
    const state = reducer(undefined, { type: 'empty' })
    sessionStore.saveState(state)
    const persistedState = sessionStore.loadState()
    expect(persistedState).toEqual({})
  })

  it('can persist a redux state tree', () => {
    const sessionStore = configureStorage({
      storage: sessionStorage,
      stateKey: STATE_KEY,
      paths: ['foo', 'bar'],
    })
    const expectedState = reducer(undefined, { type: 'empty' })
    sessionStore.saveState(expectedState)
    const persistedState = sessionStore.loadState()
    expect(persistedState).toEqual(expectedState)
  })

  it('can clear state', () => {
    const sessionStore = configureStorage({
      storage: sessionStorage,
      stateKey: STATE_KEY,
      paths: ['foo', 'bar'],
    })
    const state = reducer(undefined, { type: 'empty' })
    sessionStore.saveState(state)
    sessionStore.clearState()
    const persistedState = sessionStore.loadState()
    expect(persistedState).toEqual(undefined)
  })

  it('will persist an invalidation token if specified', () => {
    configureStorage({
      storage: localStorage,
      token: 'v1',
      tokenKey: TOKEN_KEY,
    })
    const token = localStorage.getItem(TOKEN_KEY)
    expect(token).toEqual('v1')
  })

  it('invalidates local storage if "token" does not match persisted token', () => {
    const localStore = configureStorage({
      storage: localStorage,
      token: 'v1',
      tokenKey: TOKEN_KEY,
      paths: ['foo', 'bar'],
    })
    const expectedState = reducer(undefined, { type: 'empty' })
    localStore.saveState(expectedState)

    configureStorage({
      storage: localStorage,
      token: 'v2',
      tokenKey: TOKEN_KEY,
      paths: ['foo', 'bar'],
    })

    const state = localStore.loadState()
    expect(state).toEqual(undefined)
  })
})
