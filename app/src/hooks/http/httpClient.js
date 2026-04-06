const apiBaseRaw = process.env.REACT_APP_REST_API_ENDPOINT || ''
const apiBase = apiBaseRaw.trim().replace(/\/+$/, '')

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

export const getJson = (path) => requestJson(path, { method: 'GET' })

export const postJson = (path, payload) => requestJson(path, {
  method: 'POST',
  body: JSON.stringify(payload),
})

export const putJson = (path, payload) => requestJson(path, {
  method: 'PUT',
  body: JSON.stringify(payload),
})

export const deleteJson = (path) => requestJson(path, { method: 'DELETE' })

export const tenantQuery = (tenantId) => `tenant_id=${encodeURIComponent(tenantId || 'tenant-admin')}`

export { apiBase }
