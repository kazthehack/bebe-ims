import { resolveApiBase } from '../../api/resolveApiBase'

const apiBaseRaw = process.env.REACT_APP_REST_API_ENDPOINT || ''
const apiBase = resolveApiBase(apiBaseRaw)

const ensureApiBase = () => {
  if (!apiBase) {
    throw new Error('Missing REACT_APP_REST_API_ENDPOINT in app environment.')
  }
}

export const requestJson = async (path, options = {}) => {
  ensureApiBase()
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`HTTP ${response.status}: ${body}`)
  }

  return response.json()
}

export const requestBlob = async (path, options = {}) => {
  ensureApiBase()
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
  })
  if (!response.ok) {
    const body = await response.text()
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
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.text()
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
