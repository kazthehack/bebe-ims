import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const LIST_PAGE_CONTEXT_STORAGE_KEY = 'bebe_ims_list_page_context_v1'

const readStore = () => {
  try {
    const raw = window.sessionStorage.getItem(LIST_PAGE_CONTEXT_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch (_err) {
    return {}
  }
}

const writeStore = (nextStore) => {
  try {
    window.sessionStorage.setItem(LIST_PAGE_CONTEXT_STORAGE_KEY, JSON.stringify(nextStore))
  } catch (_err) {
    // ignore storage write failures
  }
}

const defaultContextValue = {
  getScopeState: () => ({}),
  setScopeState: () => {},
}

const ListPageContext = createContext(defaultContextValue)

export const ListPageContextProvider = ({ children }) => {
  const [store, setStore] = useState(() => readStore())

  const getScopeState = useCallback(
    (scope) => {
      if (!scope) return {}
      const next = store[scope]
      return typeof next === 'object' && next ? next : {}
    },
    [store],
  )

  const setScopeState = useCallback((scope, nextValue) => {
    if (!scope) return
    setStore((prevStore) => {
      const prevScope = typeof prevStore[scope] === 'object' && prevStore[scope] ? prevStore[scope] : {}
      const resolved = typeof nextValue === 'function'
        ? nextValue(prevScope)
        : nextValue
      const nextScope = typeof resolved === 'object' && resolved ? resolved : {}
      const nextStore = {
        ...prevStore,
        [scope]: nextScope,
      }
      writeStore(nextStore)
      return nextStore
    })
  }, [])

  const value = useMemo(
    () => ({
      getScopeState,
      setScopeState,
    }),
    [getScopeState, setScopeState],
  )

  return (
    <ListPageContext.Provider value={value}>
      {children}
    </ListPageContext.Provider>
  )
}

export const useListPageScope = (scope) => {
  const context = useContext(ListPageContext)
  const scopeState = context.getScopeState(scope)
  const setScopeState = useCallback(
    (nextValue) => context.setScopeState(scope, nextValue),
    [context, scope],
  )
  return {
    scopeState,
    setScopeState,
  }
}

export const listPageStoreUtils = {
  readScope(scope) {
    if (!scope) return {}
    const store = readStore()
    const scopeState = store[scope]
    return typeof scopeState === 'object' && scopeState ? scopeState : {}
  },
  writeScope(scope, value) {
    if (!scope) return
    const store = readStore()
    const resolved = typeof value === 'function'
      ? value(typeof store[scope] === 'object' && store[scope] ? store[scope] : {})
      : value
    const nextScope = typeof resolved === 'object' && resolved ? resolved : {}
    writeStore({
      ...store,
      [scope]: nextScope,
    })
  },
}

