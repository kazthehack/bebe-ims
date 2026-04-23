import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ListPageShell from 'components/reusable/layouts/ListPageShell'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import FormModal from 'components/reusable/modals/FormModal'
import CapacityBar from 'components/reusable/analytics/CapacityBar'
import { useInventoryResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'
import { useListPageScope } from 'contexts/ListPageContext'
import {
  buildInventoryRows,
  GLOBAL_TAB,
  INVENTORY_LIST_CONTEXT_SCOPE,
  NEEDS_PRODUCTION_TAB,
  readInventoryListStateFromSearch,
  STORAGE_TAB,
  toInventoryListQuery,
} from './inventoryListState'

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const PaginationBar = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

const PaginationButton = styled.button`
  height: 30px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  min-width: 64px;
  cursor: pointer;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: ${({ $needsProduction }) => (
    $needsProduction
      ? '1.1fr 1.1fr 1.1fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr 0.7fr 0.9fr 0.7fr'
      : '1.1fr 1.1fr 1.1fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr 1.1fr 0.7fr'
  )};
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ $needsProduction }) => (
    $needsProduction
      ? '1.1fr 1.1fr 1.1fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr 0.7fr 0.9fr 0.7fr'
      : '1.1fr 1.1fr 1.1fr 0.7fr 0.7fr 0.8fr 0.8fr 0.8fr 1.1fr 0.7fr'
  )};
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 52px;
`

const CompactHeader = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.2fr 0.9fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const CompactRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.2fr 0.9fr 0.7fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 52px;
`

const NeedsHeader = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.3fr 0.8fr 1.9fr 0.9fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const NeedsRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.3fr 0.8fr 1.9fr 0.9fr 0.7fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 52px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #25384c;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`

const CapacityHeaderButton = styled.button`
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const CapacityCellWrap = styled.div`
  min-width: 120px;
`

const SiteQtyWrap = styled.div`
  display: inline-flex;
  align-items: center;
`

const SiteQtyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $tone }) => ($tone === 'green' ? '#1b5e20' : $tone === 'yellow' ? '#7a4f00' : '#8b1d1d')};
  background: ${({ $tone }) => ($tone === 'green' ? '#e3f4e6' : $tone === 'yellow' ? '#fdf4dc' : '#f9e2e3')};
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ $tone }) => (
    $tone === 'critical'
      ? '#8b1d1d'
      : ($tone === 'warning' ? '#7a4f00' : '#1b5e20')
  )};
  background: ${({ $tone }) => (
    $tone === 'critical'
      ? '#f9e2e3'
      : ($tone === 'warning' ? '#fdf4dc' : '#e3f4e6')
  )};
`

const NeededQtyPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ $tone }) => (
    $tone === 'critical'
      ? '#8b1d1d'
      : ($tone === 'warning' ? '#7a4f00' : '#1b5e20')
  )};
  background: ${({ $tone }) => (
    $tone === 'critical'
      ? '#f9e2e3'
      : ($tone === 'warning' ? '#fdf4dc' : '#e3f4e6')
  )};
`

const ProductionCapacityWrap = styled.div`
  display: grid;
  gap: 4px;
`

const ProductionCapacityText = styled.div`
  font-size: 11px;
  color: #41576d;
  line-height: 1.35;
  display: grid;
  gap: 4px;
`

const ProductionMetricRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: 6px;
`

const ProductionMetricLabel = styled.span`
  color: #607589;
`

const ProductionMetricValue = styled.span`
  color: #243648;
  font-weight: 600;
`

const ToolbarRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const PrimaryButton = styled.button`
  height: 38px;
  border: 1px solid #25384c;
  background: #25384c;
  color: #fff;
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const ActionStack = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

const ActionDivider = styled.span`
  color: #607589;
  font-size: 12px;
  line-height: 1;
`

const MiniModalMeta = styled.div`
  margin-top: 4px;
  color: #4b6176;
  font-size: 12px;
`

const MiniModalField = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 10px;
  color: #4b6176;
  font-size: 12px;
`

const MiniModalInput = styled.input`
  height: 34px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  background: #f0f3f6;
  color: #243648;
  font-size: 12px;
  padding: 0 8px;
`

const MiniModalSelect = styled.select`
  height: 34px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  background: #f0f3f6;
  color: #243648;
  font-size: 12px;
  padding: 0 8px;
`

const PAGE_SIZE = 20
const AVAILABILITY_FILTER_OPTIONS = ['with-stock', 'zero-stock']
const FSN_OPTIONS = [
  { value: 'fast', label: 'Fast' },
  { value: 'normal', label: 'Normal' },
  { value: 'slow', label: 'Slow' },
  { value: 'non_moving', label: 'Non-Moving' },
]

const parseMultiFilter = (rawValue, allowedValues) => {
  if (rawValue == null || rawValue === 'all') return [...allowedValues]
  if (String(rawValue) === '__none__') return []
  const allowed = new Set(allowedValues)
  const parsed = String(rawValue)
    .split(',')
    .map((value) => value.trim())
    .filter((value) => allowed.has(value))
  return parsed.length ? parsed : [...allowedValues]
}

const siteTone = (siteQty, thresholdPerSite) => {
  const safeThreshold = Math.max(1, Number(thresholdPerSite || 8))
  const qty = Math.max(0, Number(siteQty || 0))
  const redMax = Math.ceil(safeThreshold * 0.3)
  const yellowMax = Math.ceil(safeThreshold * 0.6)
  if (qty > yellowMax) return 'green'
  if (qty > redMax) return 'yellow'
  return 'red'
}

const InventoryListPage = () => {
  const location = useLocation()
  const { scopeState, setScopeState } = useListPageScope(INVENTORY_LIST_CONTEXT_SCOPE)
  const restoredState = {
    ...scopeState,
    ...readInventoryListStateFromSearch(location.search),
  }
  const history = useHistory()
  const [activeTab, setActiveTab] = useState(() => String(restoredState.activeTab || GLOBAL_TAB))
  const [search, setSearch] = useState(() => String(restoredState.search || ''))
  const [page, setPage] = useState(() => Math.max(1, Number(restoredState.page || 1)))
  const [siteItems, setSiteItems] = useState([])
  const [siteLoading, setSiteLoading] = useState(false)
  const [siteError, setSiteError] = useState('')
  const [productLineFilter, setProductLineFilter] = useState(() => String(restoredState.productLineFilter || 'all'))
  const [variantFilter, setVariantFilter] = useState(() => String(restoredState.variantFilter || 'all'))
  const [availabilityFilter, setAvailabilityFilter] = useState(() => String(restoredState.availabilityFilter || 'all'))
  const [capacitySort, setCapacitySort] = useState('none')
  const [neededQtySort, setNeededQtySort] = useState('desc')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [showThresholdModal, setShowThresholdModal] = useState(false)
  const [thresholdModalItem, setThresholdModalItem] = useState(null)
  const [thresholdModalValue, setThresholdModalValue] = useState('8')
  const [thresholdModalSubmitting, setThresholdModalSubmitting] = useState(false)
  const [thresholdModalError, setThresholdModalError] = useState('')
  const [showFsnModal, setShowFsnModal] = useState(false)
  const [fsnModalItem, setFsnModalItem] = useState(null)
  const [fsnModalValue, setFsnModalValue] = useState('non_moving')
  const [fsnModalSubmitting, setFsnModalSubmitting] = useState(false)
  const [fsnModalError, setFsnModalError] = useState('')
  const {
    globalItems,
    loading,
    error,
    loadSite,
    exportInventoryWorkbook,
    updateProductCapacityThreshold,
    updateVariantsFsnBulk,
  } = useInventoryResource()
  const {
    sites,
  } = useSitesResource()

  const tabs = useMemo(
    () => ([
      { key: GLOBAL_TAB, label: 'Global' },
      { key: STORAGE_TAB, label: 'Storage' },
      ...(sites || []).map((site) => ({ key: site.id, label: site.name || site.code || site.id })),
      { key: NEEDS_PRODUCTION_TAB, label: 'Pipeline' },
    ]),
    [sites],
  )

  useEffect(() => {
    if ((tabs || []).some((tab) => tab.key === activeTab)) return
    setActiveTab(GLOBAL_TAB)
  }, [tabs, activeTab])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (activeTab === GLOBAL_TAB || activeTab === STORAGE_TAB || activeTab === NEEDS_PRODUCTION_TAB) return
      setSiteLoading(true)
      setSiteError('')
      try {
        const data = await loadSite(activeTab)
        if (!cancelled) setSiteItems(data.items || [])
      } catch (err) {
        if (!cancelled) setSiteError(err.message || 'Failed to load site inventory.')
      } finally {
        if (!cancelled) setSiteLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [activeTab, loadSite])

  const hasMountedRef = React.useRef(false)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    setPage(1)
  }, [activeTab, search, productLineFilter, variantFilter, availabilityFilter])

  useEffect(() => {
    setScopeState({
      activeTab,
      search,
      page,
      productLineFilter,
      variantFilter,
      availabilityFilter,
    })
  }, [activeTab, search, page, productLineFilter, variantFilter, availabilityFilter, setScopeState])

  const productLineOptions = useMemo(
    () => ['all', ...Array.from(new Set((globalItems || []).map((item) => String(item.product_line_name || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [globalItems],
  )
  const variantOptions = useMemo(
    () => ['all', ...Array.from(new Set((globalItems || []).map((item) => String(item.variant_name || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [globalItems],
  )

  const rows = useMemo(() => buildInventoryRows({
    activeTab,
    globalItems,
    siteItems,
    search,
    productLineFilter,
    variantFilter,
    availabilityFilter,
  }), [activeTab, globalItems, siteItems, search, productLineFilter, variantFilter, availabilityFilter])

  const isGlobalTab = activeTab === GLOBAL_TAB
  const isStorageTab = activeTab === STORAGE_TAB
  const isNeedsProductionTab = activeTab === NEEDS_PRODUCTION_TAB
  const listQuery = useMemo(() => toInventoryListQuery({
    activeTab,
    search,
    page,
    productLineFilter,
    variantFilter,
    availabilityFilter,
  }), [activeTab, search, page, productLineFilter, variantFilter, availabilityFilter])
  useEffect(() => {
    const currentQuery = String(location.search || '').replace(/^\?/, '')
    if (currentQuery === listQuery) return
    history.replace(`/inventory?${listQuery}`)
  }, [history, location.search, listQuery])
  const isLoading = (isGlobalTab || isStorageTab || isNeedsProductionTab) ? loading : siteLoading
  const activeError = (isGlobalTab || isStorageTab || isNeedsProductionTab) ? error : siteError
  const activeSiteLabel = (tabs.find((tab) => tab.key === activeTab) || {}).label || 'Site'
  const displayRows = useMemo(() => {
    if (isNeedsProductionTab) {
      const direction = neededQtySort === 'asc' ? 1 : -1
      return rows.slice().sort((left, right) => {
        const gapCompare = (Number(left.needs_production_gap || 0) - Number(right.needs_production_gap || 0)) * direction
        if (gapCompare !== 0) return gapCompare
        const leftName = String(left.product_name || '').toLowerCase()
        const rightName = String(right.product_name || '').toLowerCase()
        return leftName.localeCompare(rightName)
      })
    }
    if (!isGlobalTab || capacitySort === 'none') return rows
    const direction = capacitySort === 'asc' ? 1 : -1
    return rows.slice().sort((left, right) => {
      const leftTarget = Math.max(1, Number(left.capacity_target || (Number(left.capacity_threshold_per_site || 8) * 4)))
      const rightTarget = Math.max(1, Number(right.capacity_target || (Number(right.capacity_threshold_per_site || 8) * 4)))
      const leftRatio = Number(left.global_qty || 0) / leftTarget
      const rightRatio = Number(right.global_qty || 0) / rightTarget
      if (leftRatio !== rightRatio) return (leftRatio - rightRatio) * direction
      const leftName = String(left.variant_name || left.sku || '').toLowerCase()
      const rightName = String(right.variant_name || right.sku || '').toLowerCase()
      return leftName.localeCompare(rightName)
    })
  }, [rows, isGlobalTab, capacitySort, isNeedsProductionTab, neededQtySort])
  const totalPages = Math.max(1, Math.ceil(displayRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedRows = displayRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const filterDefinitions = useMemo(
    () => {
      const productLineValues = productLineOptions.filter((value) => value !== 'all')
      const variantValues = variantOptions.filter((value) => value !== 'all')
      return [
        {
          key: 'product-line',
          type: 'multi-checkbox',
          label: 'Product Line',
          title: 'Product Line',
          selectedValues: parseMultiFilter(productLineFilter, productLineValues),
          onToggle: (value) => {
            const current = parseMultiFilter(productLineFilter, productLineValues)
            const has = current.includes(value)
            const next = has ? current.filter((item) => item !== value) : [...current, value]
            setProductLineFilter(next.length ? next.join(',') : '__none__')
          },
          onChangeSelected: (nextSelected) => setProductLineFilter(nextSelected.length ? nextSelected.join(',') : '__none__'),
          options: productLineValues.map((value) => ({ value, label: value })),
        },
        {
          key: 'variant',
          type: 'multi-checkbox',
          label: 'Variant',
          title: 'Variant',
          selectedValues: parseMultiFilter(variantFilter, variantValues),
          onToggle: (value) => {
            const current = parseMultiFilter(variantFilter, variantValues)
            const has = current.includes(value)
            const next = has ? current.filter((item) => item !== value) : [...current, value]
            setVariantFilter(next.length ? next.join(',') : '__none__')
          },
          onChangeSelected: (nextSelected) => setVariantFilter(nextSelected.length ? nextSelected.join(',') : '__none__'),
          options: variantValues.map((value) => ({ value, label: value })),
        },
        {
          key: 'availability',
          type: 'multi-checkbox',
          label: 'Availability',
          title: 'Availability',
          selectedValues: parseMultiFilter(availabilityFilter, AVAILABILITY_FILTER_OPTIONS),
          onToggle: (value) => {
            const current = parseMultiFilter(availabilityFilter, AVAILABILITY_FILTER_OPTIONS)
            const has = current.includes(value)
            const next = has ? current.filter((item) => item !== value) : [...current, value]
            setAvailabilityFilter(next.length ? next.join(',') : '__none__')
          },
          onChangeSelected: (nextSelected) => setAvailabilityFilter(nextSelected.length ? nextSelected.join(',') : '__none__'),
          options: [
            { value: 'with-stock', label: 'With Stock' },
            { value: 'zero-stock', label: 'Zero Stock' },
          ],
        },
      ]
    },
    [productLineFilter, productLineOptions, variantFilter, variantOptions, availabilityFilter],
  )

  const handleExport = async () => {
    setExportError('')
    setExporting(true)
    try {
      await exportInventoryWorkbook()
    } catch (err) {
      setExportError(err.message || 'Failed to export inventory workbook.')
    } finally {
      setExporting(false)
    }
  }

  const cycleCapacitySort = () => {
    setCapacitySort((prev) => {
      if (prev === 'none') return 'desc'
      if (prev === 'desc') return 'asc'
      return 'none'
    })
  }

  const cycleNeededQtySort = () => {
    setNeededQtySort((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  const openThresholdModal = (row) => {
    setThresholdModalItem(row)
    setThresholdModalValue(String(Math.max(1, Number((row && row.capacity_threshold_per_site) || 8))))
    setThresholdModalError('')
    setShowThresholdModal(true)
  }

  const openFsnModal = (row) => {
    setFsnModalItem(row)
    setFsnModalValue(String((row && row.fsn) || 'non_moving'))
    setFsnModalError('')
    setShowFsnModal(true)
  }

  const submitThresholdModal = async () => {
    const productId = thresholdModalItem && thresholdModalItem.product_id
    const parsedThreshold = Math.max(1, Number(thresholdModalValue || 0))
    if (!productId) {
      setThresholdModalError('Missing product ID.')
      return
    }
    if (!Number.isFinite(parsedThreshold) || parsedThreshold < 1) {
      setThresholdModalError('Threshold must be at least 1.')
      return
    }
    try {
      setThresholdModalSubmitting(true)
      setThresholdModalError('')
      await updateProductCapacityThreshold({
        product_id: productId,
        capacity_threshold_per_site: parsedThreshold,
      })
      setShowThresholdModal(false)
      setThresholdModalItem(null)
      setThresholdModalValue('8')
    } catch (err) {
      setThresholdModalError(err.message || 'Failed to update threshold.')
    } finally {
      setThresholdModalSubmitting(false)
    }
  }

  const submitFsnModal = async () => {
    const row = fsnModalItem
    if (!row) {
      setFsnModalError('Missing item.')
      return
    }
    const nextFsn = String(fsnModalValue || '').trim()
    if (!FSN_OPTIONS.some((option) => option.value === nextFsn)) {
      setFsnModalError('Invalid FSN value.')
      return
    }
    const rowProductId = String(row.product_id || '')
    const variantIds = (globalItems || [])
      .filter((item) => String(item.product_id || '') === rowProductId)
      .map((item) => String(item.product_variant_id || '').trim())
      .filter(Boolean)
    if (!variantIds.length && row.product_variant_id) {
      variantIds.push(String(row.product_variant_id))
    }
    if (!variantIds.length) {
      setFsnModalError('No variants found for this product.')
      return
    }
    try {
      setFsnModalSubmitting(true)
      setFsnModalError('')
      await updateVariantsFsnBulk({
        variant_ids: variantIds,
        fsn: nextFsn,
      })
      setShowFsnModal(false)
      setFsnModalItem(null)
      setFsnModalValue('non_moving')
    } catch (err) {
      setFsnModalError(err.message || 'Failed to update FSN.')
    } finally {
      setFsnModalSubmitting(false)
    }
  }

  return (
    <PageContent title="Inventory">
      <ListPageShell
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search product line, product, variant"
        toolbar={(
          <ToolbarRow>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search product line, product, variant"
              filters={filterDefinitions}
            />
            <div>
              <PrimaryButton type="button" onClick={handleExport} disabled={exporting}>
                {exporting ? 'Exporting...' : 'Export'}
              </PrimaryButton>
            </div>
          </ToolbarRow>
        )}
      >
        <Table>
          {isGlobalTab && (
            <>
              <Header>
                <div>Product Line</div>
                <div>Product</div>
                <div>Variant</div>
                <div>Global</div>
                <div>Storage</div>
                <div>Primary (A)</div>
                <div>Secondary (B)</div>
                <div>Tertiary (C)</div>
                <div>
                  <CapacityHeaderButton type="button" onClick={cycleCapacitySort}>
                    Capacity
                  </CapacityHeaderButton>
                </div>
                <div>Action</div>
              </Header>
              {pagedRows.map((item) => (
                <Row key={item.product_variant_id}>
                  <Cell>{item.product_line_name || '-'}</Cell>
                  <Cell>{item.product_name}</Cell>
                  <Cell>{item.variant_name || item.sku || '-'}</Cell>
                  <Cell>{item.global_qty}</Cell>
                  <Cell>{item.storage_qty}</Cell>
                  <Cell>
                    <SiteQtyWrap>
                      <SiteQtyBadge $tone={siteTone(
                        Number(item.primary_qty || 0),
                        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
                      )}>
                        {item.primary_qty}
                      </SiteQtyBadge>
                    </SiteQtyWrap>
                  </Cell>
                  <Cell>
                    <SiteQtyWrap>
                      <SiteQtyBadge $tone={siteTone(
                        Number(item.secondary_qty || 0),
                        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
                      )}>
                        {item.secondary_qty}
                      </SiteQtyBadge>
                    </SiteQtyWrap>
                  </Cell>
                  <Cell>
                    <SiteQtyWrap>
                      <SiteQtyBadge $tone={siteTone(
                        Number(item.tertiary_qty || 0),
                        Number(item.variant_capacity_threshold_per_site || item.capacity_threshold_per_site || 8),
                      )}>
                        {item.tertiary_qty}
                      </SiteQtyBadge>
                    </SiteQtyWrap>
                  </Cell>
                  <Cell>
                    <CapacityCellWrap>
                      <CapacityBar
                        value={Number(item.global_qty || 0)}
                        target={Math.max(1, Number(item.capacity_target || (Number(item.capacity_threshold_per_site || 8) * 4)))}
                      />
                    </CapacityCellWrap>
                  </Cell>
                  <Cell>
                    <ActionStack>
                      <ActionButton type="button" onClick={() => history.push(`/inventory/${item.inventory_id || item.product_variant_id}?${listQuery}`)}>
                        VIEW
                      </ActionButton>
                      <ActionDivider>|</ActionDivider>
                      <ActionButton type="button" onClick={() => openThresholdModal(item)}>
                        THRESHOLD
                      </ActionButton>
                    </ActionStack>
                  </Cell>
                </Row>
              ))}
            </>
          )}
          {isNeedsProductionTab && (
            <>
              <NeedsHeader>
                <div>Product Line</div>
                <div>Product</div>
                <div>
                  <CapacityHeaderButton type="button" onClick={cycleNeededQtySort}>
                    Needed Qty
                  </CapacityHeaderButton>
                </div>
                <div>Capacity</div>
                <div>Status</div>
                <div>Action</div>
              </NeedsHeader>
              {pagedRows.map((item) => (
                <NeedsRow key={item.row_key || item.product_id}>
                  <Cell>{item.product_line_name || '-'}</Cell>
                  <Cell>{item.product_name}</Cell>
                  <Cell>
                    <NeededQtyPill $tone={String(item.needs_production_status || 'warning')}>
                      {Math.max(0, Number(item.needs_production_gap || 0))}
                    </NeededQtyPill>
                  </Cell>
                  <Cell>
                    <ProductionCapacityWrap>
                      <CapacityBar
                        value={Number(item.global_qty || 0)}
                        target={Math.max(1, Number(item.capacity_target || 1))}
                        textPosition="right"
                      />
                      <ProductionCapacityText>
                        <ProductionMetricRow>
                          <ProductionMetricLabel>Storage</ProductionMetricLabel>
                          <CapacityBar
                            value={Number(item.storage_qty || 0)}
                            target={Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                            height={6}
                            textPosition="none"
                          />
                          <ProductionMetricValue>
                            {Number(item.storage_qty || 0)} / {Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                          </ProductionMetricValue>
                        </ProductionMetricRow>
                        <ProductionMetricRow>
                          <ProductionMetricLabel>Site A</ProductionMetricLabel>
                          <CapacityBar
                            value={Number(item.primary_qty || 0)}
                            target={Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                            height={6}
                            textPosition="none"
                          />
                          <ProductionMetricValue>
                            {Number(item.primary_qty || 0)} / {Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                          </ProductionMetricValue>
                        </ProductionMetricRow>
                        <ProductionMetricRow>
                          <ProductionMetricLabel>Site B</ProductionMetricLabel>
                          <CapacityBar
                            value={Number(item.secondary_qty || 0)}
                            target={Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                            height={6}
                            textPosition="none"
                          />
                          <ProductionMetricValue>
                            {Number(item.secondary_qty || 0)} / {Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                          </ProductionMetricValue>
                        </ProductionMetricRow>
                        <ProductionMetricRow>
                          <ProductionMetricLabel>Site C</ProductionMetricLabel>
                          <CapacityBar
                            value={Number(item.tertiary_qty || 0)}
                            target={Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                            height={6}
                            textPosition="none"
                          />
                          <ProductionMetricValue>
                            {Number(item.tertiary_qty || 0)} / {Math.max(1, Number(item.capacity_threshold_per_site || 1))}
                          </ProductionMetricValue>
                        </ProductionMetricRow>
                      </ProductionCapacityText>
                    </ProductionCapacityWrap>
                  </Cell>
                  <Cell>
                    <StatusBadge $tone={String(item.needs_production_status || 'warning')}>
                      {String(item.needs_production_status || 'warning')}
                    </StatusBadge>
                  </Cell>
                  <Cell>
                    <ActionStack>
                      <ActionButton type="button" onClick={() => history.push(`/products/${item.product_id}`)}>
                        VIEW
                      </ActionButton>
                      <ActionDivider>|</ActionDivider>
                      <ActionButton type="button" onClick={() => openFsnModal(item)}>
                        TAG
                      </ActionButton>
                      <ActionDivider>|</ActionDivider>
                      <ActionButton type="button" onClick={() => openThresholdModal(item)}>
                        THRESHOLD
                      </ActionButton>
                    </ActionStack>
                  </Cell>
                </NeedsRow>
              ))}
            </>
          )}
          {!isGlobalTab && !isNeedsProductionTab && (
            <>
              <CompactHeader>
                <div>Product Line</div>
                <div>Product</div>
                <div>Variant</div>
                <div>{isStorageTab ? 'Storage' : activeSiteLabel}</div>
                <div>Action</div>
              </CompactHeader>
              {pagedRows.map((item) => (
                <CompactRow key={item.product_variant_id}>
                  <Cell>{item.product_line_name || '-'}</Cell>
                  <Cell>{item.product_name}</Cell>
                  <Cell>{item.variant_name || item.sku || '-'}</Cell>
                  <Cell>{Number(item.view_qty || 0)}</Cell>
                  <Cell>
                    <ActionButton type="button" onClick={() => history.push(`/inventory/${item.inventory_id || item.product_variant_id}?${listQuery}`)}>
                      VIEW
                    </ActionButton>
                  </Cell>
                </CompactRow>
              ))}
            </>
          )}
        </Table>

        {isLoading && <Meta>Loading inventory...</Meta>}
        {!isLoading && !displayRows.length && <Meta>No inventory found for this tab.</Meta>}
        {activeError && <Meta>{activeError}</Meta>}
        {exportError && <Meta>{exportError}</Meta>}
        {!isLoading && displayRows.length > 0 && (
          <PaginationBar>
            <Meta>Page {safePage} / {totalPages}</Meta>
            <PaginationButton type="button" onClick={() => setPage(1)} disabled={safePage <= 1}>
              FIRST
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={safePage <= 1}>
              Prev
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages}>
              Next
            </PaginationButton>
          </PaginationBar>
        )}
      </ListPageShell>
      <FormModal
        open={showThresholdModal}
        title="Update Threshold"
        onClose={() => {
          setShowThresholdModal(false)
          setThresholdModalItem(null)
          setThresholdModalValue('8')
          setThresholdModalError('')
          setThresholdModalSubmitting(false)
        }}
        onConfirm={submitThresholdModal}
        confirmLabel={thresholdModalSubmitting ? 'Updating...' : 'Update'}
        confirmDisabled={thresholdModalSubmitting}
        cancelLabel="Cancel"
        width="360px"
        closeControl="glyph"
      >
        <MiniModalMeta>
          Update threshold for <strong>{(thresholdModalItem && (thresholdModalItem.product_name || thresholdModalItem.variant_name || thresholdModalItem.sku)) || 'item'}</strong>
        </MiniModalMeta>
        <MiniModalField>
          <span>Threshold per site</span>
          <MiniModalInput
            type="number"
            min="1"
            step="1"
            value={thresholdModalValue}
            onChange={(event) => setThresholdModalValue(event.target.value)}
          />
        </MiniModalField>
        {thresholdModalError && <Meta>{thresholdModalError}</Meta>}
      </FormModal>
      <FormModal
        open={showFsnModal}
        title="Update FSN"
        onClose={() => {
          setShowFsnModal(false)
          setFsnModalItem(null)
          setFsnModalValue('non_moving')
          setFsnModalError('')
          setFsnModalSubmitting(false)
        }}
        onConfirm={submitFsnModal}
        confirmLabel={fsnModalSubmitting ? 'Updating...' : 'Update'}
        confirmDisabled={fsnModalSubmitting}
        cancelLabel="Cancel"
        width="360px"
        closeControl="glyph"
      >
        <MiniModalMeta>
          Update FSN for <strong>{(fsnModalItem && fsnModalItem.product_name) || 'item'}</strong>
        </MiniModalMeta>
        <MiniModalField>
          <span>FSN</span>
          <MiniModalSelect value={fsnModalValue} onChange={(event) => setFsnModalValue(event.target.value)}>
            {FSN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </MiniModalSelect>
        </MiniModalField>
        {fsnModalError && <Meta>{fsnModalError}</Meta>}
      </FormModal>
    </PageContent>
  )
}

export default InventoryListPage
