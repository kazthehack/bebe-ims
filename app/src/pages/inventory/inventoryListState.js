import { listPageStoreUtils } from 'contexts/ListPageContext'

export const GLOBAL_TAB = 'global'
export const STORAGE_TAB = 'storage'
export const NEEDS_PRODUCTION_TAB = 'needs-production'
export const INVENTORY_LIST_CONTEXT_SCOPE = 'inventory'

const alpha = (value) => String(value || '').trim().toLowerCase()
const parseMultiFilter = (rawValue) => {
  if (rawValue == null || rawValue === 'all') return null
  if (String(rawValue) === '__none__') return []
  const parsed = String(rawValue)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return parsed.length ? parsed : null
}

export const readInventoryListState = () => {
  return listPageStoreUtils.readScope(INVENTORY_LIST_CONTEXT_SCOPE)
}

export const writeInventoryListState = (nextState) => {
  listPageStoreUtils.writeScope(INVENTORY_LIST_CONTEXT_SCOPE, nextState)
}

export const readInventoryListStateFromSearch = (search) => {
  try {
    const params = new URLSearchParams(String(search || ''))
    const pageRaw = Number(params.get('page') || 1)
    return {
      activeTab: params.get('tab') || undefined,
      search: params.get('q') || undefined,
      page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : undefined,
      productLineFilter: params.get('line') || undefined,
      variantFilter: params.get('variant') || undefined,
      availabilityFilter: params.get('availability') || undefined,
    }
  } catch (_err) {
    return {}
  }
}

export const toInventoryListQuery = (state) => {
  const params = new URLSearchParams()
  const activeTab = String((state && state.activeTab) || GLOBAL_TAB)
  const search = String((state && state.search) || '')
  const page = Math.max(1, Number((state && state.page) || 1))
  const productLineFilter = String((state && state.productLineFilter) || 'all')
  const variantFilter = String((state && state.variantFilter) || 'all')
  const availabilityFilter = String((state && state.availabilityFilter) || 'all')

  params.set('tab', activeTab)
  params.set('page', String(page))
  if (search) params.set('q', search)
  if (productLineFilter && productLineFilter !== 'all') params.set('line', productLineFilter)
  if (variantFilter && variantFilter !== 'all') params.set('variant', variantFilter)
  if (availabilityFilter && availabilityFilter !== 'all') params.set('availability', availabilityFilter)
  return params.toString()
}

export const buildInventoryRows = ({
  activeTab,
  globalItems,
  siteItems,
  search,
  productLineFilter,
  variantFilter,
  availabilityFilter,
}) => {
  const query = String(search || '').trim().toLowerCase()
  const siteMap = (siteItems || []).reduce((acc, item) => {
    acc[item.product_variant_id] = item
    return acc
  }, {})
  const baseRows = activeTab === GLOBAL_TAB || activeTab === NEEDS_PRODUCTION_TAB
    ? (globalItems || []).map((item) => ({
      inventory_id: item.inventory_id,
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      sku: item.sku,
      product_line_name: item.product_line_name,
      variant_name: item.variant_name,
      product_name: item.product_name,
      fsn: String(item.fsn || 'normal'),
      capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
      variant_capacity_threshold_per_site: Math.max(
        1,
        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
      ),
      capacity_target: Math.max(
        1,
        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8) * 4,
      ),
      global_qty: Number(item.master_qty_on_hand || 0),
      primary_qty: Number(item.primary_qty_on_hand || 0),
      secondary_qty: Number(item.secondary_qty_on_hand || 0),
      tertiary_qty: Number(item.tertiary_qty_on_hand || 0),
      storage_qty: Math.max(
        0,
        Number(item.master_qty_on_hand || 0)
          - Number(item.primary_qty_on_hand || 0)
          - Number(item.secondary_qty_on_hand || 0)
          - Number(item.tertiary_qty_on_hand || 0),
      ),
      view_qty: Number(item.master_qty_on_hand || 0),
      safe_target_qty: Math.max(
        1,
        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8) * 4,
      ),
      sustain_third_site_qty: Math.max(
        1,
        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
      ),
    }))
    : activeTab === STORAGE_TAB
      ? (globalItems || []).map((item) => ({
        inventory_id: item.inventory_id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        sku: item.sku,
        product_line_name: item.product_line_name,
        variant_name: item.variant_name,
        product_name: item.product_name,
        fsn: String(item.fsn || 'normal'),
        capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
        variant_capacity_threshold_per_site: Math.max(
          1,
          Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
        ),
        capacity_target: Math.max(
          1,
          Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8) * 4,
        ),
        global_qty: Number(item.master_qty_on_hand || 0),
        primary_qty: Number(item.primary_qty_on_hand || 0),
        secondary_qty: Number(item.secondary_qty_on_hand || 0),
        tertiary_qty: Number(item.tertiary_qty_on_hand || 0),
        storage_qty: Math.max(
          0,
          Number(item.master_qty_on_hand || 0)
            - Number(item.primary_qty_on_hand || 0)
            - Number(item.secondary_qty_on_hand || 0)
            - Number(item.tertiary_qty_on_hand || 0),
        ),
        view_qty: Math.max(
          0,
          Number(item.master_qty_on_hand || 0)
            - Number(item.primary_qty_on_hand || 0)
            - Number(item.secondary_qty_on_hand || 0)
            - Number(item.tertiary_qty_on_hand || 0),
        ),
      }))
      : (globalItems || []).map((item) => ({
        inventory_id: item.inventory_id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        sku: item.sku,
        product_line_name: item.product_line_name,
        variant_name: item.variant_name,
        product_name: item.product_name,
        fsn: String(item.fsn || 'normal'),
        capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
        variant_capacity_threshold_per_site: Math.max(
          1,
          Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
        ),
        capacity_target: Math.max(
          1,
          Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8) * 4,
        ),
        global_qty: Number((siteMap[item.product_variant_id] || {}).qty_available || 0),
        storage_qty: 0,
        primary_qty: 0,
        secondary_qty: 0,
        tertiary_qty: 0,
        view_qty: Number((siteMap[item.product_variant_id] || {}).qty_available || 0),
      }))

  const rowsWithStatus = baseRows.map((item) => {
    const safeTarget = Math.max(1, Number(item.safe_target_qty || item.capacity_target || 1))
    const thresholdPerSite = Math.max(
      1,
      Number(item.sustain_third_site_qty || item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 1),
    )
    const globalQty = Math.max(0, Number(item.global_qty || 0))
    const coverage = globalQty / safeTarget
    const safeGap = Math.max(0, safeTarget - globalQty)
    const status = globalQty < thresholdPerSite ? 'critical' : (coverage < 0.6 ? 'warning' : 'stable')
    return {
      ...item,
      is_needs_production: status !== 'stable',
      needs_production_gap: safeGap,
      needs_production_status: status,
    }
  })

  const filteredRows = rowsWithStatus
    .filter((item) => {
      const selectedProductLines = parseMultiFilter(productLineFilter)
      const selectedVariants = parseMultiFilter(variantFilter)
      const selectedAvailability = parseMultiFilter(availabilityFilter)
      if (query && ![
        item.product_line_name,
        item.sku,
        item.variant_name,
        item.product_name,
        item.product_variant_id,
      ].join(' ').toLowerCase().includes(query)) return false
      if (selectedProductLines && !selectedProductLines.includes(String(item.product_line_name || ''))) return false
      if (selectedVariants && !selectedVariants.includes(String(item.variant_name || ''))) return false
      if (selectedAvailability) {
        const hasStock = Number(item.view_qty || 0) > 0
        const availabilityTag = hasStock ? 'with-stock' : 'zero-stock'
        if (!selectedAvailability.includes(availabilityTag)) return false
      }
      if (activeTab === NEEDS_PRODUCTION_TAB) {
        if (String(item.fsn || 'normal') === 'non_moving') return false
        if (String(item.needs_production_status || 'stable') === 'stable') return false
      }
      return true
    })

  if (activeTab === NEEDS_PRODUCTION_TAB) {
    const fsnRank = (value) => {
      const normalized = String(value || 'normal')
      if (normalized === 'fast') return 0
      if (normalized === 'normal') return 1
      if (normalized === 'slow') return 2
      return 3
    }
    const groupedByProduct = filteredRows.reduce((acc, item) => {
      const productId = String(item.product_id || '')
      if (!productId) return acc
      if (!acc[productId]) {
        acc[productId] = {
          row_key: `product-${productId}`,
          inventory_id: item.inventory_id,
          product_id: productId,
          product_line_name: item.product_line_name,
          product_name: item.product_name,
          variant_name: '',
          fsn: String(item.fsn || 'normal'),
          capacity_threshold_per_site: 0,
          product_capacity_threshold_per_site: 0,
          capacity_target: 0,
          global_qty: 0,
          storage_qty: 0,
          primary_qty: 0,
          secondary_qty: 0,
          tertiary_qty: 0,
          view_qty: 0,
          needs_production_gap: 0,
          needs_production_status: 'warning',
          needed_variant_count: 0,
        }
      }
      const current = acc[productId]
      current.product_capacity_threshold_per_site += Math.max(
        1,
        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
      )
      current.global_qty += Number(item.global_qty || 0)
      current.storage_qty += Number(item.storage_qty || 0)
      current.primary_qty += Number(item.primary_qty || 0)
      current.secondary_qty += Number(item.secondary_qty || 0)
      current.tertiary_qty += Number(item.tertiary_qty || 0)
      current.view_qty += Number(item.view_qty || 0)
      current.needs_production_gap += Number(item.needs_production_gap || 0)
      current.needed_variant_count += 1
      if (fsnRank(item.fsn) < fsnRank(current.fsn)) current.fsn = String(item.fsn || 'normal')
      if (String(item.needs_production_status || 'warning') === 'critical') {
        current.needs_production_status = 'critical'
      }
      return acc
    }, {})
    const productRows = Object.values(groupedByProduct).map((item) => {
      const thresholdPerSite = Math.max(1, Number(item.product_capacity_threshold_per_site || 1))
      const targetQty = Math.max(1, thresholdPerSite * 4)
      const globalQty = Math.max(0, Number(item.global_qty || 0))
      const coverage = globalQty / targetQty
      const status = globalQty < thresholdPerSite ? 'critical' : (coverage < 0.6 ? 'warning' : 'stable')
      return {
        ...item,
        variant_name: `${Number(item.needed_variant_count || 0)} variant${Number(item.needed_variant_count || 0) === 1 ? '' : 's'}`,
        capacity_threshold_per_site: thresholdPerSite,
        capacity_target: targetQty,
        needs_production_gap: Math.max(0, targetQty - globalQty),
        needs_production_status: status,
      }
    })
    return productRows.sort((a, b) => {
      const severityRank = (value) => (value === 'critical' ? 0 : 1)
      const severityCompare = severityRank(a.needs_production_status) - severityRank(b.needs_production_status)
      if (severityCompare !== 0) return severityCompare
      const gapCompare = Number(b.needs_production_gap || 0) - Number(a.needs_production_gap || 0)
      if (gapCompare !== 0) return gapCompare
      const lineCompare = alpha(a.product_line_name).localeCompare(alpha(b.product_line_name))
      if (lineCompare !== 0) return lineCompare
      const productCompare = alpha(a.product_name).localeCompare(alpha(b.product_name))
      if (productCompare !== 0) return productCompare
      return alpha(a.variant_name || a.sku).localeCompare(alpha(b.variant_name || b.sku))
    })
  }

  return filteredRows.sort((a, b) => {
      const lineCompare = alpha(a.product_line_name).localeCompare(alpha(b.product_line_name))
      if (lineCompare !== 0) return lineCompare
      const productCompare = alpha(a.product_name).localeCompare(alpha(b.product_name))
      if (productCompare !== 0) return productCompare
      const variantCompare = alpha(a.variant_name || a.sku).localeCompare(alpha(b.variant_name || b.sku))
      if (variantCompare !== 0) return variantCompare
      return alpha(a.product_variant_id).localeCompare(alpha(b.product_variant_id))
    })
}
