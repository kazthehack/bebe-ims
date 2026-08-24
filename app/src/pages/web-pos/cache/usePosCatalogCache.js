import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  isPosCatalogFresh,
  preloadPosCatalogCache,
  readPosCatalogCache,
  refreshPosCatalogCache,
} from 'api/posCatalogCache'

const alpha = (value) => String(value || '').trim().toLowerCase()

const byProductLineThenProduct = (a, b) => {
  const lineCompare = alpha(a.product_line || a.product_line_name).localeCompare(alpha(b.product_line || b.product_line_name))
  if (lineCompare !== 0) return lineCompare
  const nameCompare = alpha(a.name).localeCompare(alpha(b.name))
  if (nameCompare !== 0) return nameCompare
  return alpha(a.product_code || a.sku || a.id).localeCompare(alpha(b.product_code || b.sku || b.id))
}

const normalizeCache = (cache) => ({
  products: [...((cache && cache.products) || [])].sort(byProductLineThenProduct),
  variants: [...((cache && cache.variants) || [])],
  productLines: [...((cache && cache.productLines) || [])],
  cachedAt: cache ? cache.cachedAt : null,
})

export const usePosCatalogCache = (tenantId = 'tenant-admin') => {
  const [catalog, setCatalog] = useState(() => normalizeCache(readPosCatalogCache(tenantId)))
  const [loading, setLoading] = useState(!isPosCatalogFresh(readPosCatalogCache(tenantId)))
  const [error, setError] = useState('')

  const applyCache = useCallback((cache) => {
    setCatalog(normalizeCache(cache))
    return cache
  }, [])

  const load = useCallback(async ({ force = false } = {}) => {
    setLoading(true)
    setError('')
    try {
      const cache = force
        ? await refreshPosCatalogCache(tenantId)
        : await preloadPosCatalogCache(tenantId)
      applyCache(cache)
      return cache
    } catch (err) {
      setError(err.message || 'Failed to load POS catalog.')
      const fallback = readPosCatalogCache(tenantId)
      if (fallback) {
        applyCache(fallback)
        return fallback
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [tenantId, applyCache])

  useEffect(() => {
    load({ force: false }).catch(() => {})
  }, [load])

  const variantsByProductId = useMemo(() => (
    (catalog.variants || []).reduce((acc, variant) => {
      acc[variant.product_id] = acc[variant.product_id] || []
      acc[variant.product_id].push(variant)
      return acc
    }, {})
  ), [catalog.variants])

  return {
    allProducts: catalog.products,
    products: catalog.products,
    variants: catalog.variants,
    productLines: catalog.productLines,
    variantsByProductId,
    cachedAt: catalog.cachedAt,
    loading,
    error,
    reload: () => load({ force: true }),
  }
}

