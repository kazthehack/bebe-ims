import { getJson, tenantQuery } from 'hooks/http/httpClient'

const CACHE_PREFIX = 'bebe.pos.catalog'
const CACHE_VERSION = 1
const CACHE_TTL_MS = 12 * 60 * 60 * 1000

const cacheKey = (tenantId) => `${CACHE_PREFIX}.${tenantId || 'tenant-admin'}`

const now = () => Date.now()

export const isPosCatalogFresh = (cache) => (
  !!cache
  && cache.version === CACHE_VERSION
  && Array.isArray(cache.products)
  && Array.isArray(cache.variants)
  && now() - Number(cache.cachedAt || 0) < CACHE_TTL_MS
)

export const readPosCatalogCache = (tenantId = 'tenant-admin') => {
  try {
    const raw = localStorage.getItem(cacheKey(tenantId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.version === CACHE_VERSION ? parsed : null
  } catch (_error) {
    return null
  }
}

export const writePosCatalogCache = (tenantId = 'tenant-admin', catalog = {}) => {
  const payload = {
    version: CACHE_VERSION,
    tenantId,
    cachedAt: now(),
    products: catalog.products || [],
    variants: catalog.variants || [],
    productLines: catalog.productLines || [],
  }

  try {
    localStorage.setItem(cacheKey(tenantId), JSON.stringify(payload))
  } catch (_error) {
    // WebView/local browser storage can be unavailable; callers still get the payload.
  }
  return payload
}

export const fetchPosCatalog = async (tenantId = 'tenant-admin') => {
  const query = tenantQuery(tenantId)
  const [productData, variantData, productLineData] = await Promise.all([
    getJson(`/products?${query}`),
    getJson(`/products/variants?${query}`),
    getJson(`/product-lines?${query}`),
  ])

  return {
    products: productData.products || [],
    variants: variantData.variants || [],
    productLines: productLineData.product_lines || [],
  }
}

export const refreshPosCatalogCache = async (tenantId = 'tenant-admin') => {
  const catalog = await fetchPosCatalog(tenantId)
  return writePosCatalogCache(tenantId, catalog)
}

export const preloadPosCatalogCache = async (tenantId = 'tenant-admin', options = {}) => {
  const cached = readPosCatalogCache(tenantId)
  if (!options.force && isPosCatalogFresh(cached)) {
    return cached
  }
  return refreshPosCatalogCache(tenantId)
}

