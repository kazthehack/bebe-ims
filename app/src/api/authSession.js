const AUTH_KEYS = [
  'tenantId',
  'storeId',
  'ownerId',
  'userId',
  'employeeId',
  'username',
  'role',
  'permissions',
  'forcePasswordChange',
]

const readStorage = (storage, key) => {
  try {
    return storage.getItem(key)
  } catch (err) {
    return null
  }
}

const writeStorage = (storage, key, value) => {
  try {
    if (value === undefined || value === null) {
      storage.removeItem(key)
    } else {
      storage.setItem(key, value)
    }
  } catch (err) {
    // Storage can be disabled in private or embedded contexts.
  }
}

export const getAccessToken = () => (
  readStorage(sessionStorage, 'accessToken') || process.env.REACT_APP_API_ACCESS_TOKEN || ''
)

export const getRefreshToken = () => readStorage(localStorage, 'refreshToken') || ''

export const getAuthRole = () => readStorage(sessionStorage, 'role') || readStorage(localStorage, 'role') || ''

export const getAuthPermissions = () => {
  const raw = readStorage(sessionStorage, 'permissions') || readStorage(localStorage, 'permissions') || '[]'
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

export const getForcePasswordChange = () => (
  (readStorage(sessionStorage, 'forcePasswordChange') || readStorage(localStorage, 'forcePasswordChange')) === 'true'
)

export const getDefaultAuthenticatedPath = () => (getAuthRole() === 'user' ? '/web-pos' : '/daily')

export const getCurrentAuthSession = () => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  role: getAuthRole(),
  permissions: getAuthPermissions(),
  forcePasswordChange: getForcePasswordChange(),
  tenantId: readStorage(sessionStorage, 'tenantId') || readStorage(localStorage, 'tenantId'),
  storeId: readStorage(sessionStorage, 'storeId') || readStorage(localStorage, 'storeId'),
  ownerId: readStorage(sessionStorage, 'ownerId') || readStorage(localStorage, 'ownerId'),
  userId: readStorage(sessionStorage, 'userId') || readStorage(localStorage, 'userId'),
  employeeId: readStorage(sessionStorage, 'employeeId') || readStorage(localStorage, 'employeeId'),
  username: readStorage(sessionStorage, 'username') || readStorage(localStorage, 'username'),
})

export const persistAuthSession = (auth) => {
  const permissions = JSON.stringify(auth.permissions || [])
  const values = {
    tenantId: auth.tenantId,
    storeId: auth.storeId,
    ownerId: auth.ownerId,
    userId: auth.userId,
    employeeId: auth.employeeId,
    username: auth.username,
    role: auth.role,
    permissions,
    forcePasswordChange: auth.forcePasswordChange ? 'true' : 'false',
  }

  AUTH_KEYS.forEach((key) => {
    writeStorage(localStorage, key, values[key])
    writeStorage(sessionStorage, key, values[key])
  })
  writeStorage(localStorage, 'refreshToken', auth.refreshToken)
  writeStorage(sessionStorage, 'accessToken', auth.accessToken)
  writeStorage(sessionStorage, 'currentUserEmail', auth.username)
}

export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => {
    writeStorage(localStorage, key, null)
    writeStorage(sessionStorage, key, null)
  })
  writeStorage(localStorage, 'refreshToken', null)
  writeStorage(sessionStorage, 'accessToken', null)
  writeStorage(sessionStorage, 'currentUserEmail', null)
}
