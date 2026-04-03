export const STORE_PERMISSIONS = new Proxy({}, {
  get: (_target, prop) => String(prop),
})
