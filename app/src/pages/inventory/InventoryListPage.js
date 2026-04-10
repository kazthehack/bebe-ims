import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ListPageShell from 'components/reusable/layouts/ListPageShell'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import { useInventoryResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'
import {
  buildInventoryRows,
  GLOBAL_TAB,
  INVENTORY_LIST_STATE_KEY,
  readInventoryListState,
  readInventoryListStateFromSearch,
  STORAGE_TAB,
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
  grid-template-columns: 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.9fr 0.9fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.9fr 0.9fr 0.7fr;
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

const PAGE_SIZE = 20

const InventoryListPage = () => {
  const location = useLocation()
  const restoredState = {
    ...readInventoryListState(),
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
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const {
    globalItems,
    loading,
    error,
    loadSite,
    exportInventoryWorkbook,
  } = useInventoryResource()
  const {
    sites,
  } = useSitesResource()

  const tabs = useMemo(
    () => ([
      { key: GLOBAL_TAB, label: 'Global' },
      { key: STORAGE_TAB, label: 'Storage' },
      ...(sites || []).map((site) => ({ key: site.id, label: site.name || site.code || site.id })),
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
      if (activeTab === GLOBAL_TAB || activeTab === STORAGE_TAB) return
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
    try {
      window.sessionStorage.setItem(INVENTORY_LIST_STATE_KEY, JSON.stringify({
        activeTab,
        search,
        page,
        productLineFilter,
        variantFilter,
        availabilityFilter,
      }))
    } catch (_err) {
      // ignore storage write errors
    }
  }, [activeTab, search, page, productLineFilter, variantFilter, availabilityFilter])

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
  const isLoading = (isGlobalTab || isStorageTab) ? loading : siteLoading
  const activeError = (isGlobalTab || isStorageTab) ? error : siteError
  const activeSiteLabel = (tabs.find((tab) => tab.key === activeTab) || {}).label || 'Site'
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const filterDefinitions = useMemo(
    () => ([
      {
        key: 'product-line',
        value: productLineFilter,
        onChange: setProductLineFilter,
        options: [
          { value: 'all', label: 'All Product Lines' },
          ...productLineOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
        ],
      },
      {
        key: 'variant',
        value: variantFilter,
        onChange: setVariantFilter,
        options: [
          { value: 'all', label: 'All Variants' },
          ...variantOptions.filter((value) => value !== 'all').map((value) => ({ value, label: value })),
        ],
      },
      {
        key: 'availability',
        value: availabilityFilter,
        onChange: setAvailabilityFilter,
        options: [
          { value: 'all', label: 'All Availability' },
          { value: 'with-stock', label: 'With Stock' },
          { value: 'zero-stock', label: 'Zero Stock' },
        ],
      },
    ]),
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
                <div>Action</div>
              </Header>
              {pagedRows.map((item) => (
                <Row key={item.product_variant_id}>
                  <Cell>{item.product_line_name || '-'}</Cell>
                  <Cell>{item.product_name}</Cell>
                  <Cell>{item.variant_name || item.sku || '-'}</Cell>
                  <Cell>{item.global_qty}</Cell>
                  <Cell>{item.storage_qty}</Cell>
                  <Cell>{item.primary_qty}</Cell>
                  <Cell>{item.secondary_qty}</Cell>
                  <Cell>{item.tertiary_qty}</Cell>
                  <Cell>
                    <ActionButton type="button" onClick={() => history.push(`/inventory/${item.inventory_id || item.product_variant_id}`)}>
                      VIEW
                    </ActionButton>
                  </Cell>
                </Row>
              ))}
            </>
          )}
          {!isGlobalTab && (
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
                    <ActionButton type="button" onClick={() => history.push(`/inventory/${item.inventory_id || item.product_variant_id}`)}>
                      VIEW
                    </ActionButton>
                  </Cell>
                </CompactRow>
              ))}
            </>
          )}
        </Table>

        {isLoading && <Meta>Loading inventory...</Meta>}
        {!isLoading && !rows.length && <Meta>No inventory found for this tab.</Meta>}
        {activeError && <Meta>{activeError}</Meta>}
        {exportError && <Meta>{exportError}</Meta>}
        {!isLoading && rows.length > 0 && (
          <PaginationBar>
            <Meta>Page {safePage} / {totalPages}</Meta>
            <PaginationButton type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={safePage <= 1}>
              Prev
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages}>
              Next
            </PaginationButton>
          </PaginationBar>
        )}
      </ListPageShell>
    </PageContent>
  )
}

export default InventoryListPage
