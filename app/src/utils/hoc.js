import React, { useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { get, isEmpty } from 'lodash'

const asArray = value => (Array.isArray(value) ? value : [value])

const renderMaybeComponent = (ComponentLike, props) => {
  if (!ComponentLike) {
    return null
  }
  if (React.isValidElement(ComponentLike)) {
    return ComponentLike
  }
  if (typeof ComponentLike === 'function') {
    return <ComponentLike {...props} />
  }
  return null
}

const hasGatesSatisfied = (props, gates) => {
  const gateKeys = asArray(gates).filter(Boolean)
  if (!gateKeys.length) {
    return true
  }
  return gateKeys.every(key => !!get(props, key))
}

const isLoading = data => !!(data && data.loading)
const hasError = data => !!(data && data.error)

const resolveDataValues = (props, dataKeys) => {
  const keys = asArray(dataKeys).filter(Boolean)
  return keys.map(key => get(props, key))
}

export const renderWhileLoading = (LoadingComponent, dataKeys = 'data', gateProps) => Wrapped => (props) => {
  if (!hasGatesSatisfied(props, gateProps)) {
    return <Wrapped {...props} />
  }

  const dataValues = resolveDataValues(props, dataKeys)
  if (dataValues.some(isLoading)) {
    return renderMaybeComponent(LoadingComponent, props)
  }
  return <Wrapped {...props} />
}

export const renderIfError = (ErrorComponent, dataKeys = 'data') => Wrapped => (props) => {
  const dataValues = resolveDataValues(props, dataKeys)
  if (dataValues.some(hasError)) {
    return renderMaybeComponent(ErrorComponent, props)
  }
  return <Wrapped {...props} />
}

export const renderIfEmpty = (EmptyComponent, accessor = p => get(p, 'data')) => Wrapped => (props) => {
  const value = accessor(props)
  if (isEmpty(value)) {
    return renderMaybeComponent(EmptyComponent, props)
  }
  return <Wrapped {...props} />
}

const isAuthenticated = () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const accessToken = sessionStorage.getItem('accessToken')
    return !!(refreshToken && accessToken)
  } catch (err) {
    return false
  }
}

export const requireAuthentication = Wrapped => (props) => {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />
  }
  return <Wrapped {...props} />
}

const getViewerPermissions = props => get(props, 'authenticatedUserData.viewer.portalRoles[0].permissions', [])

export const requirePermissions = (requiredPermissions = [], FallbackFactory = null) => Wrapped => (props) => {
  const required = asArray(requiredPermissions).filter(Boolean)
  if (!required.length) {
    return <Wrapped {...props} />
  }

  const authData = get(props, 'authenticatedUserData')
  if (authData && authData.loading) {
    return null
  }

  const userPermissions = getViewerPermissions(props)
  const authorized = required.every(permission => userPermissions.includes(permission))

  if (authorized) {
    return <Wrapped {...props} />
  }

  if (FallbackFactory) {
    if (typeof FallbackFactory === 'function') {
      const maybeFactoryResult = FallbackFactory(props)
      if (React.isValidElement(maybeFactoryResult)) {
        return maybeFactoryResult
      }
      if (typeof maybeFactoryResult === 'function') {
        const FallbackComponent = maybeFactoryResult
        return <FallbackComponent {...props} />
      }
      return <FallbackFactory {...props} />
    }
    return renderMaybeComponent(FallbackFactory, props)
  }

  return <Redirect to="/daily" />
}

export const withOnApolloDataReady = (onReady, dataKey = 'data') => Wrapped => (props) => {
  const readyRef = useRef(null)
  const data = get(props, dataKey)

  useEffect(() => {
    if (data && !data.loading && readyRef.current !== data) {
      onReady(data, props)
      readyRef.current = data
    }
  }, [data, props])

  return <Wrapped {...props} />
}

export const withSessionState = Wrapped => (props) => {
  const setSessionValue = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      // no-op for disabled storage contexts
    }
  }

  const getSessionValue = (key, fallback = null) => {
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (err) {
      return fallback
    }
  }

  const removeSessionValue = (key) => {
    try {
      sessionStorage.removeItem(key)
    } catch (err) {
      // no-op for disabled storage contexts
    }
  }

  return (
    <Wrapped
      {...props}
      setSessionState={setSessionValue}
      getSessionState={getSessionValue}
      removeSessionState={removeSessionValue}
    />
  )
}
