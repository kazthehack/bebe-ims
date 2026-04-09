const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

const trimBase = (value) => String(value || '').trim().replace(/\/+$/, '')

const isBrowser = () => typeof window !== 'undefined' && window.location

export const resolveApiBase = (configuredBaseRaw = '') => {
  const configuredBase = trimBase(configuredBaseRaw)

  if (!configuredBase) {
    if (!isBrowser()) return ''
    const protocol = window.location.protocol || 'http:'
    const host = window.location.hostname || 'localhost'
    return `${protocol}//${host}:8001/api/v1`
  }

  try {
    const parsed = new URL(configuredBase)
    if (!isBrowser()) return trimBase(parsed.toString())

    const uiHost = (window.location.hostname || '').trim()
    if (!uiHost) return trimBase(parsed.toString())

    if (LOCAL_HOSTS.has(parsed.hostname.toLowerCase()) && !LOCAL_HOSTS.has(uiHost.toLowerCase())) {
      parsed.hostname = uiHost
      return trimBase(parsed.toString())
    }
    return trimBase(parsed.toString())
  } catch (_error) {
    return configuredBase
  }
}

