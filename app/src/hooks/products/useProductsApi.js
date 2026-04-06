import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiBase, deleteJson, getJson, postJson, putJson, tenantQuery } from 'hooks/http/httpClient'

export const useProductsList = (tenantId = 'tenant-admin') => {
  const [products, setProducts] = useState([])
  const [variants, setVariants] = useState([])
  const [productLines, setProductLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const query = tenantQuery(tenantId)
      const [productData, variantData, productLineData] = await Promise.all([
        getJson(`/products?${query}`),
        getJson(`/products/variants?${query}`),
        getJson(`/product-lines?${query}`),
      ])
      setProducts(productData.products || [])
      setVariants(variantData.variants || [])
      setProductLines(productLineData.product_lines || [])
    } catch (err) {
      setError(err.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createProduct = async ({
    name,
    product_line_id,
    category,
    list_price,
    description,
    design_source,
    third_party_source_url,
    local_working_files,
    image_url,
  }) => {
    const created = await postJson(`/products?${tenantQuery(tenantId)}`, {
      name,
      product_line_id,
      category,
      list_price,
      description,
      design_source,
      third_party_source_url,
      local_working_files,
      image_url,
    })
    await load()
    return created
  }

  const deleteProduct = async (productId) => {
    const result = await deleteJson(`/products/${encodeURIComponent(productId)}?${tenantQuery(tenantId)}`)
    await load()
    return result
  }

  const createVariant = async ({ product_id, name, image_url }) => {
    const created = await postJson(`/products/variants?${tenantQuery(tenantId)}`, { product_id, name, image_url })
    await load()
    return created
  }

  const createProductStock = async ({
    product_variant_id,
    site_id,
    qty_on_hand,
    qty_reserved,
    low_stock_threshold,
  }) => {
    const created = await postJson(`/stock/products?${tenantQuery(tenantId)}`, {
      product_variant_id,
      site_id,
      qty_on_hand,
      qty_reserved,
      low_stock_threshold,
    })
    await load()
    return created
  }

  const filtered = useMemo(() => {
    const query = (search || '').trim().toLowerCase()
    if (!query) return products
    return products.filter(item => (
      (item.product_code || '').toLowerCase().includes(query)
      || (item.name || '').toLowerCase().includes(query)
      || (item.product_line || '').toLowerCase().includes(query)
      || (item.category || '').toLowerCase().includes(query)
      || String(item.list_price || '').includes(query)
    ))
  }, [products, search])

  const variantsByProductId = useMemo(() => {
    const grouped = {}
    variants.forEach(variant => {
      grouped[variant.product_id] = grouped[variant.product_id] || []
      grouped[variant.product_id].push(variant)
    })
    return grouped
  }, [variants])

  const createProductLine = async ({ name, description, active = true }) => {
    const created = await postJson(`/product-lines?${tenantQuery(tenantId)}`, {
      name,
      description,
      active,
    })
    await load()
    return created
  }

  const deleteProductLine = async (productLineId) => {
    const result = await deleteJson(`/product-lines/${encodeURIComponent(productLineId)}?${tenantQuery(tenantId)}`)
    await load()
    return result
  }

  const updateProductLine = async (productLineId, payload) => {
    const updated = await putJson(`/product-lines/${encodeURIComponent(productLineId)}?${tenantQuery(tenantId)}`, payload)
    await load()
    return updated
  }

  return {
    apiBase,
    products: filtered,
    variantsByProductId,
    productLines,
    loading,
    error,
    search,
    setSearch,
    createProduct,
    deleteProduct,
    createVariant,
    createProductStock,
    createProductLine,
    updateProductLine,
    deleteProductLine,
    reload: load,
  }
}

export const useProductDetail = (productId, tenantId = 'tenant-admin') => {
  const [productDetail, setProductDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (cancelled = false) => {
    if (!productId) return
    setLoading(true)
    setError('')
    try {
      const productData = await getJson(`/products/${productId}?${tenantQuery(tenantId)}`)
      if (!cancelled) {
        setProductDetail(productData)
      }
    } catch (err) {
      if (!cancelled) setError(err.message || 'Failed to load product detail.')
    } finally {
      if (!cancelled) setLoading(false)
    }
  }, [productId, tenantId])

  useEffect(() => {
    let cancelled = false

    const runLoad = async () => {
      setLoading(true)
      await load(cancelled)
    }

    if (productId) runLoad()
    return () => {
      cancelled = true
    }
  }, [productId, load])

  const createVariant = useCallback(async ({ name, yield_units, print_hours, image_url }) => {
    const created = await postJson(`/products/variants?${tenantQuery(tenantId)}`, {
      product_id: productId,
      name,
      yield_units,
      print_hours,
      image_url,
    })
    await load(false)
    return created
  }, [tenantId, productId, load])

  const deleteProduct = useCallback(async () => {
    const result = await deleteJson(`/products/${encodeURIComponent(productId)}?${tenantQuery(tenantId)}`)
    return result
  }, [tenantId, productId])

  const updateProduct = useCallback(async ({
    name,
    product_line_id,
    category,
    list_price,
    description,
    design_source,
    third_party_source_url,
    local_working_files,
    image_url,
  }) => {
    const updated = await putJson(`/products/${encodeURIComponent(productId)}?${tenantQuery(tenantId)}`, {
      name,
      product_line_id,
      category,
      list_price,
      description,
      design_source,
      third_party_source_url,
      local_working_files,
      image_url,
    })
    await load(false)
    return updated
  }, [tenantId, productId, load])

  return {
    productDetail,
    loading,
    error,
    apiBase,
    createVariant,
    deleteProduct,
    updateProduct,
    reload: () => load(false),
  }
}

export const useVariantDetail = (variantId, tenantId = 'tenant-admin') => {
  const [variantDetail, setVariantDetail] = useState(null)
  const [recipeParts, setRecipeParts] = useState([])
  const [parts, setParts] = useState([])
  const [recipeTotalCost, setRecipeTotalCost] = useState(0)
  const [recipeSummary, setRecipeSummary] = useState({
    total_part_hours: 0,
    variant_print_hours: 0,
    total_batch_hours: 0,
    yield_units: 1,
    price_per_unit: 0,
    hours_per_unit: 0,
    can_produce_batch: true,
  })
  const [supplies, setSupplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (cancelled = false) => {
    if (!variantId) return
    setLoading(true)
    setError('')
    try {
      const query = tenantQuery(tenantId)
      const [variantData, recipeData, suppliesData, partsData] = await Promise.all([
        getJson(`/products/variants/${variantId}?${query}`),
        getJson(`/products/variants/${variantId}/recipe-parts?${query}`),
        getJson(`/stock/supplies?${query}`),
        getJson(`/products/parts?${query}`),
      ])
      if (!cancelled) {
        setVariantDetail(variantData)
        setRecipeParts(recipeData.parts || [])
        setRecipeTotalCost(Number(recipeData.total_cost || 0))
        setRecipeSummary({
          total_part_hours: Number(recipeData.total_part_hours || 0),
          variant_print_hours: Number(recipeData.variant_print_hours || 0),
          total_batch_hours: Number(recipeData.total_batch_hours || 0),
          yield_units: Number(recipeData.yield_units || 1),
          price_per_unit: Number(recipeData.price_per_unit || 0),
          hours_per_unit: Number(recipeData.hours_per_unit || 0),
          can_produce_batch: Boolean(recipeData.can_produce_batch),
        })
        setSupplies(suppliesData.supplies || [])
        setParts(partsData.parts || [])
      }
    } catch (err) {
      if (!cancelled) setError(err.message || 'Failed to load variant detail.')
    } finally {
      if (!cancelled) setLoading(false)
    }
  }, [variantId, tenantId])

  useEffect(() => {
    let cancelled = false
    if (variantId) load(cancelled)
    return () => {
      cancelled = true
    }
  }, [variantId, load])

  const createPart = useCallback(async ({
    name,
    description,
  }) => {
    const created = await postJson(`/products/parts?${tenantQuery(tenantId)}`, {
      name,
      description,
      active: true,
    })
    await load(false)
    return created
  }, [tenantId, load])

  const createRecipePart = useCallback(async ({
    part_id,
    supply_id,
    grams,
    quantity,
    print_hours,
  }) => {
    const created = await postJson(`/products/variants/${encodeURIComponent(variantId)}/recipe-parts?${tenantQuery(tenantId)}`, {
      part_id,
      supply_id,
      grams,
      quantity,
      print_hours,
    })
    await load(false)
    return created
  }, [variantId, tenantId, load])

  const updateVariant = useCallback(async ({ name, yield_units, print_hours }) => {
    const updated = await putJson(`/products/variants/${encodeURIComponent(variantId)}?${tenantQuery(tenantId)}`, {
      name,
      yield_units,
      print_hours,
    })
    await load(false)
    return updated
  }, [variantId, tenantId, load])

  return {
    variantDetail,
    recipeParts,
    parts,
    recipeTotalCost,
    recipeSummary,
    supplies,
    loading,
    error,
    createPart,
    createRecipePart,
    updateVariant,
    reload: () => load(false),
  }
}
