import { resolveApiBase } from './resolveApiBase'

const API_BASE = resolveApiBase(process.env.REACT_APP_REST_API_ENDPOINT || '')

async function request(path, options = {}) {
  const accessToken = sessionStorage.getItem('accessToken') || process.env.REACT_APP_API_ACCESS_TOKEN
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`REST request failed (${response.status}): ${text}`)
  }

  return response.status === 204 ? null : response.json()
}

export const RestClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
}

export const AuthApi = {
  login: (tenantId, username, password) => RestClient.post('/auth/login', {
    tenant_id: tenantId,
    username,
    password,
  }),
  verifyPasswordToken: (tenantId, token) => RestClient.post('/auth/verify-password-token', {
    tenant_id: tenantId,
    token,
  }),
  resetPassword: (tenantId, token, newPassword) => RestClient.post('/auth/reset-password', {
    tenant_id: tenantId,
    token,
    new_password: newPassword,
  }),
  sendResetPasswordEmail: (tenantId, email) => RestClient.post('/auth/send-reset-password-email', {
    tenant_id: tenantId,
    email,
  }),
}

export const ObjectApi = {
  listSupported: () => RestClient.get('/objects'),
  list: (entityType, tenantId) => RestClient.get(`/${entityType}?tenant_id=${encodeURIComponent(tenantId)}`),
  get: (entityType, entityId, tenantId) => RestClient.get(`/${entityType}/${entityId}?tenant_id=${encodeURIComponent(tenantId)}`),
  create: (entityType, tenantId, payload) => RestClient.post(`/${entityType}`, {
    tenant_id: tenantId,
    payload,
  }),
  update: (entityType, entityId, tenantId, payload) => RestClient.put(`/${entityType}/${entityId}`, {
    tenant_id: tenantId,
    payload,
  }),
}
