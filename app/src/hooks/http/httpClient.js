import { resolveApiBase } from '../../api/resolveApiBase'
import { clearAuthSession, getAccessToken } from '../../api/authSession'

const apiBaseRaw = process.env.REACT_APP_REST_API_ENDPOINT || ''
const apiBase = resolveApiBase(apiBaseRaw)

const ensureApiBase = () => {
  if (!apiBase) {
    throw new Error('Missing REACT_APP_REST_API_ENDPOINT in app environment.')
  }
}

const handleAuthFailure = (response, body) => {
  if (response.status !== 401) return false
  const text = String(body || '')
  if (!text.includes('Token not found') && !text.includes('Token is inactive') && !text.includes('Token is expired')) {
    return false
  }
  clearAuthSession()
  if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
  return true
}

export const requestJson = async (path, options = {}) => {
  ensureApiBase()
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    if (handleAuthFailure(response, body)) {
      throw new Error('Session expired. Please log in again.')
    }
    throw new Error(`HTTP ${response.status}: ${body}`)
  }

  return response.json()
}

export const requestBlob = async (path, options = {}) => {
  ensureApiBase()
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    const body = await response.text()
    if (handleAuthFailure(response, body)) {
      throw new Error('Session expired. Please log in again.')
    }
    throw new Error(`HTTP ${response.status}: ${body}`)
  }
  const blob = await response.blob()
  return { blob, headers: response.headers }
}

export const getJson = (path) => requestJson(path, { method: 'GET' })
export const getBlob = (path) => requestBlob(path, { method: 'GET' })

export const postJson = (path, payload) => requestJson(path, {
  method: 'POST',
  body: JSON.stringify(payload),
})

export const postForm = async (path, formData) => {
  ensureApiBase()
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    if (handleAuthFailure(response, body)) {
      throw new Error('Session expired. Please log in again.')
    }
    throw new Error(`HTTP ${response.status}: ${body}`)
  }

  return response.json()
}

export const putJson = (path, payload) => requestJson(path, {
  method: 'PUT',
  body: JSON.stringify(payload),
})

export const deleteJson = (path) => requestJson(path, { method: 'DELETE' })

export const tenantQuery = (tenantId) => `tenant_id=${encodeURIComponent(tenantId || 'tenant-admin')}`

export { apiBase }
