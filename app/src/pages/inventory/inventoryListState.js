export const GLOBAL_TAB = 'global'
export const STORAGE_TAB = 'storage'
export const INVENTORY_LIST_STATE_KEY = 'bebe_ims_inventory_list_state_v1'

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
  try {
    const raw = window.sessionStorage.getItem(INVENTORY_LIST_STATE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch (_err) {
    return {}
  }
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
  const baseRows = activeTab === GLOBAL_TAB
    ? (globalItems || []).map((item) => ({
      inventory_id: item.inventory_id,
      product_variant_id: item.product_variant_id,
      sku: item.sku,
      product_line_name: item.product_line_name,
      variant_name: item.variant_name,
      product_name: item.product_name,
      capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
      capacity_target: Math.max(1, Number(item.capacity_threshold_per_site || 8) * 4),
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
    }))
    : activeTab === STORAGE_TAB
      ? (globalItems || []).map((item) => ({
        inventory_id: item.inventory_id,
        product_variant_id: item.product_variant_id,
        sku: item.sku,
        product_line_name: item.product_line_name,
        variant_name: item.variant_name,
        product_name: item.product_name,
        capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
        capacity_target: Math.max(1, Number(item.capacity_threshold_per_site || 8) * 4),
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
        product_variant_id: item.product_variant_id,
        sku: item.sku,
        product_line_name: item.product_line_name,
        variant_name: item.variant_name,
        product_name: item.product_name,
        capacity_threshold_per_site: Math.max(1, Number(item.capacity_threshold_per_site || 8)),
        capacity_target: Math.max(1, Number(item.capacity_threshold_per_site || 8) * 4),
        global_qty: Number((siteMap[item.product_variant_id] || {}).qty_available || 0),
        storage_qty: 0,
        primary_qty: 0,
        secondary_qty: 0,
        tertiary_qty: 0,
        view_qty: Number((siteMap[item.product_variant_id] || {}).qty_available || 0),
      }))

  return baseRows
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
      return true
    })
    .sort((a, b) => {
      const lineCompare = alpha(a.product_line_name).localeCompare(alpha(b.product_line_name))
      if (lineCompare !== 0) return lineCompare
      const productCompare = alpha(a.product_name).localeCompare(alpha(b.product_name))
      if (productCompare !== 0) return productCompare
      const variantCompare = alpha(a.variant_name || a.sku).localeCompare(alpha(b.variant_name || b.sku))
      if (variantCompare !== 0) return variantCompare
      return alpha(a.product_variant_id).localeCompare(alpha(b.product_variant_id))
    })
}
