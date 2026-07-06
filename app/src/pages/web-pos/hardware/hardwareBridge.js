const parseBridgeResponse = (value) => {
  if (!value) return { ok: true }
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (_error) {
    return { ok: true, raw: value }
  }
}

const invokeBridge = (methodName, fallback, ...args) => {
  if (!hasAndroidHardwareBridge() || typeof window.BebeHardware[methodName] !== 'function') {
    return fallback
  }
  try {
    return parseBridgeResponse(window.BebeHardware[methodName](...args))
  } catch (error) {
    return {
      ok: false,
      message: error.message || 'Hardware bridge failed.',
    }
  }
}

export const hasAndroidHardwareBridge = () => (
  typeof window !== 'undefined'
  && !!window.BebeHardware
)

export const getHardwareCapabilities = () => {
  return invokeBridge('getCapabilities', { platform: 'web', printer: false, scanner: false, nfc: false })
}

export const getPrinterStatus = () => {
  return invokeBridge('getPrinterStatus', { connected: false, status: 'hardware_unavailable' })
}

export const printReceipt = (receiptPayload) => {
  return invokeBridge(
    'printReceipt',
    { ok: false, skipped: true, reason: 'hardware_unavailable' },
    JSON.stringify(receiptPayload || {}),
  )
}

export const subscribeHardwareStatus = (handler) => {
  if (typeof window === 'undefined' || typeof handler !== 'function') return () => {}
  const listener = (event) => handler((event || {}).detail || {})
  window.addEventListener('bebe:hardware-status', listener)
  return () => window.removeEventListener('bebe:hardware-status', listener)
}
