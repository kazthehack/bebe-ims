import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiBase, deleteJson, getJson, postForm, postJson, putJson, tenantQuery } from 'hooks/http/httpClient'

const alpha = (value) => String(value || '').trim().toLowerCase()

const byProductLineThenProduct = (a, b) => {
  const lineCompare = alpha(a.product_line || a.product_line_name).localeCompare(alpha(b.product_line || b.product_line_name))
  if (lineCompare !== 0) return lineCompare
  const nameCompare = alpha(a.name).localeCompare(alpha(b.name))
  if (nameCompare !== 0) return nameCompare
  return alpha(a.product_code || a.sku || a.id).localeCompare(alpha(b.product_code || b.sku || b.id))
}

const byProductLineNameThenCode = (a, b) => {
  const nameCompare = alpha(a.name).localeCompare(alpha(b.name))
  if (nameCompare !== 0) return nameCompare
  return alpha(a.code || a.id).localeCompare(alpha(b.code || b.id))
}

export const useProductsList = (tenantId = 'tenant-admin') => {
  const [products, setProducts] = useState([])
  const [variants, setVariants] = useState([])
  const [productLines, setProductLines] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const query = tenantQuery(tenantId)
      const [productData, variantData, productLineData, inventoryData] = await Promise.all([
        getJson(`/products?${query}`),
        getJson(`/products/variants?${query}`),
        getJson(`/product-lines?${query}`),
        getJson(`/stock/inventory/global?${query}`),
      ])
      setProducts([...(productData.products || [])].sort(byProductLineThenProduct))
      setVariants([...(variantData.variants || [])])
      setProductLines([...(productLineData.product_lines || [])].sort(byProductLineNameThenCode))
      setInventoryItems([...(inventoryData.items || [])])
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
    ip,
    category,
    list_price,
    fsn,
    capacity_threshold_per_site,
    description,
    design_source,
    third_party_source_url,
    local_working_files,
    image_url,
  }) => {
    const created = await postJson(`/products?${tenantQuery(tenantId)}`, {
      name,
      product_line_id,
      ip,
      category,
      list_price,
      fsn,
      capacity_threshold_per_site,
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
      || (item.ip || '').toLowerCase().includes(query)
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

  const storageCapacityByVariantId = useMemo(
    () => (inventoryItems || []).reduce((acc, item) => {
      const variantId = String(item.product_variant_id || '')
      if (!variantId) return acc
      acc[variantId] = Number(item.master_qty_on_hand || 0)
      return acc
    }, {}),
    [inventoryItems],
  )

  const storageCapacityByProductId = useMemo(
    () => (inventoryItems || []).reduce((acc, item) => {
      const productId = String(item.product_id || '')
      if (!productId) return acc
      const globalQty = Number(item.master_qty_on_hand || 0)
      acc[productId] = Number(acc[productId] || 0) + globalQty
      return acc
    }, {}),
    [inventoryItems],
  )

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
    allProducts: products,
    products: filtered,
    variants,
    variantsByProductId,
    storageCapacityByVariantId,
    storageCapacityByProductId,
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
  const [inventoryByVariantId, setInventoryByVariantId] = useState({})
  const [inventoryMetricsByVariantId, setInventoryMetricsByVariantId] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (cancelled = false) => {
    if (!productId) return
    setLoading(true)
    setError('')
    try {
      const productData = await getJson(`/products/${productId}?${tenantQuery(tenantId)}`)
      let inventoryData = { items: [] }
      try {
        inventoryData = await getJson(`/stock/inventory/global?${tenantQuery(tenantId)}`)
      } catch (_err) {
        inventoryData = { items: [] }
      }
      if (!cancelled) {
        setProductDetail(productData)
        const metricsByVariant = (inventoryData.items || [])
          .filter((item) => item.product_id === productId)
          .reduce((acc, item) => {
            const variantId = String(item.product_variant_id || '')
            if (!variantId) return acc
            const globalQty = Number(item.master_qty_on_hand || 0)
            const primaryQty = Number(item.primary_qty_on_hand || 0)
            const secondaryQty = Number(item.secondary_qty_on_hand || 0)
            const tertiaryQty = Number(item.tertiary_qty_on_hand || 0)
            const storageQty = Math.max(
              0,
              Number(item.master_qty_on_hand || 0)
                - primaryQty
                - secondaryQty
                - tertiaryQty,
            )
            acc[variantId] = {
              global_qty: globalQty,
              storage_qty: storageQty,
              primary_qty: primaryQty,
              secondary_qty: secondaryQty,
              tertiary_qty: tertiaryQty,
            }
            return acc
          }, {})
        const qtyByVariant = Object.keys(metricsByVariant).reduce((acc, variantId) => {
          acc[variantId] = Number(metricsByVariant[variantId].global_qty || 0)
          return acc
        }, {})
        setInventoryByVariantId(qtyByVariant)
        setInventoryMetricsByVariantId(metricsByVariant)
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
    ip,
    category,
    list_price,
    fsn,
    capacity_threshold_per_site,
    description,
    design_source,
    third_party_source_url,
    local_working_files,
    image_url,
  }) => {
    const updated = await putJson(`/products/${encodeURIComponent(productId)}?${tenantQuery(tenantId)}`, {
      name,
      product_line_id,
      ip,
      category,
      list_price,
      fsn,
      capacity_threshold_per_site,
      description,
      design_source,
      third_party_source_url,
      local_working_files,
      image_url,
    })
    await load(false)
    return updated
  }, [tenantId, productId, load])

  const adjustVariantGlobalStock = useCallback(async ({ variantId, qtyDelta, notes }) => {
    const adjusted = await postJson(`/stock/inventory/global-adjust?${tenantQuery(tenantId)}`, {
      product_variant_id: variantId,
      qty_delta: qtyDelta,
      notes: notes || null,
    })
    await load(false)
    return adjusted
  }, [tenantId, load])

  return {
    productDetail,
    inventoryByVariantId,
    inventoryMetricsByVariantId,
    loading,
    error,
    apiBase,
    createVariant,
    deleteProduct,
    updateProduct,
    adjustVariantGlobalStock,
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
    print_hours,
  }) => {
    const created = await postJson(`/products/parts?${tenantQuery(tenantId)}`, {
      name,
      description,
      print_hours,
      active: true,
    })
    await load(false)
    return created
  }, [tenantId, load])

  const createRecipePart = useCallback(async ({
    part_id,
    supply_id,
    batch_yield,
    grams,
    quantity,
    print_hours,
  }) => {
    const created = await postJson(`/products/variants/${encodeURIComponent(variantId)}/recipe-parts?${tenantQuery(tenantId)}`, {
      part_id,
      supply_id,
      batch_yield,
      grams,
      quantity,
      print_hours,
    })
    await load(false)
    return created
  }, [variantId, tenantId, load])

  const parse3mfProject = useCallback(async (file, plateIndex = 0) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('plate_index', String(plateIndex || 0))
    return postForm(`/slicer/parse-3mf?${tenantQuery(tenantId)}`, formData)
  }, [tenantId])

  const updateVariant = useCallback(async ({ name, fsn, yield_units, print_hours }) => {
    const updated = await putJson(`/products/variants/${encodeURIComponent(variantId)}?${tenantQuery(tenantId)}`, {
      name,
      fsn,
      yield_units,
      print_hours,
    })
    await load(false)
    return updated
  }, [variantId, tenantId, load])

  const deleteVariant = useCallback(async () => {
    const result = await deleteJson(`/products/variants/${encodeURIComponent(variantId)}?${tenantQuery(tenantId)}`)
    return result
  }, [variantId, tenantId])

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
    parse3mfProject,
    updateVariant,
    deleteVariant,
    reload: () => load(false),
  }
}
