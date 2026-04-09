import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import { useInventoryResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import {
  buildInventoryRows,
  GLOBAL_TAB,
  toInventoryListQuery,
  readInventoryListState,
  STORAGE_TAB,
} from './inventoryListState'

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: #243648;
  font-size: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`

const Label = styled.div`
  color: #607589;
  font-size: 12px;
  margin-bottom: 4px;
`

const Value = styled.div`
  color: #243648;
  font-size: 14px;
  font-weight: 600;
  min-height: 38px;
  display: flex;
  align-items: center;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const StockSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f7fafc;
  overflow: hidden;
  margin-bottom: 10px;
`

const StockSummaryCell = styled.div`
  padding: 10px 12px;
`

const StockSummaryValue = styled.div`
  color: #243648;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
`

const StockSummaryLabel = styled.div`
  color: #607589;
  font-size: 12px;
  text-transform: uppercase;
  margin-top: 4px;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 46px;
`

const AdjustHeader = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr 0.9fr 1.5fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const AdjustRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr 0.9fr 1.5fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 46px;
`

const AdjustEmptyRow = styled.div`
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #eef2f6;
  min-height: 46px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #607589;
  font-size: 13px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const InlineAdjust = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const InlineInput = styled.input`
  width: 74px;
  height: 30px;
  border: 1px solid #bec8d3;
  border-radius: 4px;
  padding: 0 8px;
  background: #f0f3f6;
`

const InlineButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #25384c;
  border-radius: 4px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : '#25384c')};
  color: ${({ disabled }) => (disabled ? '#8a9aab' : '#fff')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 700;
`

const ErrorText = styled.div`
  color: #b42318;
  font-size: 12px;
  margin-top: 8px;
`

const DetailTopActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

const NavButton = styled.button`
  height: 34px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const InventoryDetailPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const {
    loadInventoryDetail,
    loadInventoryAdjustments,
    dispatchToSite,
    receiveToMain,
    transferInventory,
    globalItems,
    loadSite,
  } = useInventoryResource()
  const { sites } = useSitesResource()
  const [detail, setDetail] = useState(null)
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inlineQtyBySite, setInlineQtyBySite] = useState({})
  const [inlineError, setInlineError] = useState('')
  const [navSiteItems, setNavSiteItems] = useState([])

  const listContext = useMemo(() => {
    const raw = readInventoryListState()
    return {
      activeTab: String(raw.activeTab || GLOBAL_TAB),
      search: String(raw.search || ''),
      productLineFilter: String(raw.productLineFilter || 'all'),
      variantFilter: String(raw.variantFilter || 'all'),
      availabilityFilter: String(raw.availabilityFilter || 'all'),
    }
  }, [])

  const breadcrumbTitle = (
    <BreadcrumbTitle items={[
      {
        label: 'Inventory',
        to: `/inventory?${toInventoryListQuery({
          activeTab: listContext.activeTab,
          search: listContext.search,
          page: Number((readInventoryListState().page || 1)),
          productLineFilter: listContext.productLineFilter,
          variantFilter: listContext.variantFilter,
          availabilityFilter: listContext.availabilityFilter,
        })}`,
      },
      { label: detail ? `${detail.product_name || 'Item'} ${detail.variant_name ? `/ ${detail.variant_name}` : ''}` : 'Variant Inventory Detail' },
    ]}
    />
  )

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      const data = await loadInventoryDetail(id)
      const adjustmentRows = await loadInventoryAdjustments(data.product_variant_id)
      setDetail(data)
      setAdjustments(adjustmentRows)
    } catch (err) {
      setError(err.message || 'Failed to load inventory detail.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id, loadInventoryDetail, loadInventoryAdjustments])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (listContext.activeTab === GLOBAL_TAB || listContext.activeTab === STORAGE_TAB) {
        setNavSiteItems([])
        return
      }
      try {
        const data = await loadSite(listContext.activeTab)
        if (!cancelled) setNavSiteItems(data.items || [])
      } catch (_err) {
        if (!cancelled) setNavSiteItems([])
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [listContext.activeTab, loadSite])

  const navRows = useMemo(() => buildInventoryRows({
    activeTab: listContext.activeTab,
    globalItems,
    siteItems: navSiteItems,
    search: listContext.search,
    productLineFilter: listContext.productLineFilter,
    variantFilter: listContext.variantFilter,
    availabilityFilter: listContext.availabilityFilter,
  }), [listContext, globalItems, navSiteItems])

  const currentRowIndex = useMemo(() => (
    (navRows || []).findIndex((row) => (
      row.inventory_id === id
      || row.product_variant_id === id
      || `inv-${row.product_variant_id}` === id
    ))
  ), [navRows, id])

  const previousRow = currentRowIndex > 0 ? navRows[currentRowIndex - 1] : null
  const nextRow = currentRowIndex >= 0 && currentRowIndex < navRows.length - 1 ? navRows[currentRowIndex + 1] : null

  const activeSites = useMemo(
    () => (sites || []).filter((site) => site.active),
    [sites],
  )
  const siteNameById = useMemo(
    () => (activeSites || []).reduce((acc, site) => {
      acc[site.id] = site.name || site.code || site.id
      return acc
    }, {}),
    [activeSites],
  )
  const siteQtyById = useMemo(
    () => (((detail && detail.site_stocks) || []).reduce((acc, stock) => {
      acc[stock.site_id] = stock.qty_on_hand
      return acc
    }, {})),
    [detail],
  )
  const siteIdByRole = useMemo(() => {
    const result = { primary: null, secondary: null, tertiary: null }
    ;(activeSites || []).forEach((site) => {
      const name = String(site.name || '').trim().toLowerCase()
      const code = String(site.code || '').trim().toLowerCase()
      const id = String(site.id || '').trim().toLowerCase()
      const compactId = id.replace(/[^a-z0-9]/g, '')
      if (!result.primary && (name.includes('primary') || code === 'site1' || compactId === 'site1' || compactId === 'site001')) {
        result.primary = site.id
      }
      if (!result.secondary && (name.includes('secondary') || code === 'site2' || compactId === 'site2' || compactId === 'site002')) {
        result.secondary = site.id
      }
      if (!result.tertiary && (name.includes('tertiary') || code === 'site3' || compactId === 'site3' || compactId === 'site003')) {
        result.tertiary = site.id
      }
    })
    return result
  }, [activeSites])

  useEffect(() => {
    setInlineQtyBySite((prev) => {
      const next = { ...prev }
      if (next.global === undefined) next.global = ''
      ;(activeSites || []).forEach((site) => {
        if (next[site.id] === undefined) next[site.id] = ''
      })
      return next
    })
  }, [activeSites, detail && detail.inventory_id])

  const qtyForSite = (siteId) => String(
    inlineQtyBySite[siteId] === undefined || inlineQtyBySite[siteId] === null
      ? ''
      : inlineQtyBySite[siteId],
  )
  const setQtyForSite = (siteId, value) => {
    setInlineQtyBySite((prev) => ({ ...prev, [siteId]: value }))
  }
  const parseInlineQty = (siteId) => {
    const qty = Number(qtyForSite(siteId))
    return Number.isFinite(qty) && qty > 0 ? qty : 0
  }

  const applyInlineGlobalAdd = async () => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty('global')
    if (qty <= 0) {
      setInlineError('Qty must be greater than zero.')
      return
    }
    try {
      await receiveToMain({ product_variant_id: detail.product_variant_id, qty })
      await load()
    } catch (err) {
      setInlineError(err.message || 'Failed to add stock.')
    }
  }

  const applyInlineDispatch = async (siteId) => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty(siteId)
    if (qty <= 0) {
      setInlineError('Qty must be greater than zero.')
      return
    }
    try {
      await dispatchToSite({
        product_variant_id: detail.product_variant_id,
        site_id: siteId,
        qty,
      })
      await load()
    } catch (err) {
      setInlineError(err.message || 'Failed to dispense stock.')
    }
  }

  const applyInlinePullBack = async (siteId) => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty(siteId)
    if (qty <= 0) {
      setInlineError('Qty must be greater than zero.')
      return
    }
    try {
      await transferInventory({
        product_variant_id: detail.product_variant_id,
        source_site_id: siteId,
        destination_site_id: 'main',
        qty,
      })
      await load()
    } catch (err) {
      setInlineError(err.message || 'Failed to pull stock back to storage.')
    }
  }

  const formatChange = (item) => {
    const qty = Number(item.qty_delta || 0)
    const type = String(item.adjustment_type || '').toUpperCase()
    const site = siteNameById[item.site_id] || item.site_id || 'site'
    if (type === 'RECEIVE_MAIN') {
      return 'Added stock to storage'
    }
    if (type === 'DISPATCH_SITE') {
      return `Stock dispensed to ${site}`
    }
    if (type === 'TRANSFER_OUT') {
      return `Transferred ${Math.abs(qty)} out from ${site}`
    }
    if (type === 'TRANSFER_IN') {
      return `Received ${Math.abs(qty)} into ${site}`
    }
    return item.notes || type || 'Inventory change'
  }

  const primaryQty = Number(siteQtyById[siteIdByRole.primary] || 0)
  const secondaryQty = Number(siteQtyById[siteIdByRole.secondary] || 0)
  const tertiaryQty = Number(siteQtyById[siteIdByRole.tertiary] || 0)
  const globalQty = Number((detail && detail.master_qty_on_hand) || 0)
  const storageQty = Math.max(0, globalQty - primaryQty - secondaryQty - tertiaryQty)

  return (
    <PageContent title={breadcrumbTitle}>
      <DetailTopActions>
        <NavButton
          type="button"
          disabled={!previousRow}
          onClick={() => previousRow && history.push(`/inventory/${previousRow.inventory_id || previousRow.product_variant_id}`)}
        >
          {'<'}
        </NavButton>
        <NavButton
          type="button"
          disabled={!nextRow}
          onClick={() => nextRow && history.push(`/inventory/${nextRow.inventory_id || nextRow.product_variant_id}`)}
        >
          {'>'}
        </NavButton>
      </DetailTopActions>
      {loading && <Section>Loading inventory detail...</Section>}
      {!loading && error && <Section>{error}</Section>}
      {!loading && detail && (
        <>
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Grid>
              <div>
                <Label>Product Line</Label>
                <Value>{detail.product_line_name || '-'}</Value>
              </div>
              <div>
                <Label>SKU</Label>
                <Value>{detail.sku}</Value>
              </div>
              <div>
                <Label>Variant</Label>
                <Value>{detail.variant_name || '-'}</Value>
              </div>
              <div>
                <Label>Product</Label>
                <Value>{detail.product_name}</Value>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Description (read-only)</Label>
                <Value>{detail.product_description || '-'}</Value>
              </div>
            </Grid>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle style={{ margin: 0 }}>Inventory</SectionTitle>
            </SectionHeader>
            <StockSummaryGrid>
              <StockSummaryCell>
                <StockSummaryValue>{globalQty}</StockSummaryValue>
                <StockSummaryLabel>GLOBAL</StockSummaryLabel>
              </StockSummaryCell>
              <StockSummaryCell>
                <StockSummaryValue>{storageQty}</StockSummaryValue>
                <StockSummaryLabel>STORAGE</StockSummaryLabel>
              </StockSummaryCell>
              <StockSummaryCell>
                <StockSummaryValue>{primaryQty}</StockSummaryValue>
                <StockSummaryLabel>PRIMARY (A)</StockSummaryLabel>
              </StockSummaryCell>
              <StockSummaryCell>
                <StockSummaryValue>{secondaryQty}</StockSummaryValue>
                <StockSummaryLabel>SECONDARY (B)</StockSummaryLabel>
              </StockSummaryCell>
              <StockSummaryCell>
                <StockSummaryValue>{tertiaryQty}</StockSummaryValue>
                <StockSummaryLabel>TERTIARY (C)</StockSummaryLabel>
              </StockSummaryCell>
            </StockSummaryGrid>
            <Table>
              <Header>
                <div>Location</div>
                <div>Qty</div>
                <div>Adjust</div>
              </Header>
              <Row>
                <Cell>Global</Cell>
                <Cell>{globalQty}</Cell>
                <Cell>
                  <InlineAdjust>
                    <InlineButton type="button" disabled>-</InlineButton>
                    <InlineInput
                      type="number"
                      min="1"
                      step="1"
                      placeholder="1"
                      value={qtyForSite('global')}
                      onChange={(event) => setQtyForSite('global', event.target.value)}
                    />
                    <InlineButton type="button" onClick={applyInlineGlobalAdd}>+</InlineButton>
                  </InlineAdjust>
                </Cell>
              </Row>
              <Row>
                <Cell>Storage</Cell>
                <Cell>{storageQty}</Cell>
                <Cell>
                  -
                </Cell>
              </Row>
              {activeSites.map((site) => (
                <Row key={site.id}>
                  <Cell>{siteNameById[site.id] || site.id}</Cell>
                  <Cell>{siteQtyById[site.id] || 0}</Cell>
                  <Cell>
                    <InlineAdjust>
                      <InlineButton type="button" onClick={() => applyInlinePullBack(site.id)}>-</InlineButton>
                      <InlineInput
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        value={qtyForSite(site.id)}
                        onChange={(event) => setQtyForSite(site.id, event.target.value)}
                      />
                      <InlineButton type="button" onClick={() => applyInlineDispatch(site.id)}>+</InlineButton>
                    </InlineAdjust>
                  </Cell>
                </Row>
              ))}
            </Table>
            {inlineError && <ErrorText>{inlineError}</ErrorText>}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle style={{ margin: 0 }}>Changes</SectionTitle>
            </SectionHeader>
            <Table>
              <AdjustHeader>
                <div>When</div>
                <div>Type</div>
                <div>Delta</div>
                <div>Site</div>
                <div>Change</div>
              </AdjustHeader>
              {(adjustments || []).map((item) => (
                <AdjustRow key={item.id}>
                  <Cell>{item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</Cell>
                  <Cell>{String(item.adjustment_type || '').toUpperCase()}</Cell>
                  <Cell>{Number(item.qty_delta || 0).toFixed(2)}</Cell>
                  <Cell>{siteNameById[item.site_id] || item.site_id || 'Storage'}</Cell>
                  <Cell>{formatChange(item)}</Cell>
                </AdjustRow>
              ))}
              {!(adjustments || []).length && (
                <AdjustEmptyRow>No adjustment records yet.</AdjustEmptyRow>
              )}
            </Table>
          </Section>
        </>
      )}
    </PageContent>
  )
}

export default InventoryDetailPage
