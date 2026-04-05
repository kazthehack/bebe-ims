import { useEffect, useMemo, useState } from 'react'

const apiBaseRaw = process.env.REACT_APP_REST_API_ENDPOINT || ''
const apiBase = apiBaseRaw.trim().replace(/\/+$/, '')

const fetchJson = async (path, options = {}) => {
  if (!apiBase) throw new Error('Missing REACT_APP_REST_API_ENDPOINT in app environment.')
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

export const useProductsList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [importStatus, setImportStatus] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchJson('/products')
      setProducts(data.products || [])
    } catch (err) {
      setError(err.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const importMockProducts = async () => {
    setImportStatus('Importing...')
    try {
      const payload = {
        items: [
          { category: 'Accessories', name: 'Keychain Gamma', variants: ['Green', 'Black'] },
          { category: 'Supplies-Based', name: 'Filament Badge', variants: ['Orange'] },
        ],
      }
      const result = await fetchJson('/products/import', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setImportStatus(`Imported ${result.imported} products`)
      await load()
    } catch (err) {
      setImportStatus('Import failed')
      setError(err.message || 'Failed to import products.')
    }
  }

  const createProduct = async ({ category, name, variants }) => {
    const payload = {
      category,
      name,
      variants: variants && variants.length ? variants : ['Default'],
    }
    await fetchJson('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    await load()
  }

  const filtered = useMemo(() => {
    const query = (search || '').trim().toLowerCase()
    if (!query) return products
    return products.filter(item => (
      (item.category || '').toLowerCase().includes(query)
      || (item.name || '').toLowerCase().includes(query)
      || (item.variants || []).join(' ').toLowerCase().includes(query)
    ))
  }, [products, search])

  return {
    apiBase,
    products: filtered,
    loading,
    error,
    search,
    setSearch,
    importStatus,
    importMockProducts,
    createProduct,
  }
}

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchJson(`/products/${productId}`)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product detail.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (productId) load()
    return () => {
      cancelled = true
    }
  }, [productId])

  return { product, loading, error, apiBase }
}
