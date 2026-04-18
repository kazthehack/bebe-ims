import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import QRCode from 'qrcode.react'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import QuantityStepper from 'components/reusable/controls/QuantityStepper'
import CapacityBar from 'components/reusable/analytics/CapacityBar'
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

const DescriptionSection = styled(Section)`
  position: relative;
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
  padding-right: 210px;
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

const QrPreviewWrap = styled.div`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f6f9fc;
  width: fit-content;
  padding: 8px;
`

const FloatingQrPanel = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #f6f9fc;
  padding: 10px;
`

const QrCodeText = styled.div`
  color: #243648;
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;
  max-width: 170px;
  word-break: break-all;
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
  grid-template-columns: 1fr 1.6fr 1.2fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr 1.2fr;
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

const ErrorText = styled.div`
  color: #b42318;
  font-size: 12px;
  margin-top: 8px;
`

const ModalMeta = styled.div`
  margin-top: 6px;
  color: #4b6176;
  font-size: 13px;
`

const ModalField = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 10px;
  color: #4b6176;
  font-size: 12px;
`

const ModalTextarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 88px;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
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
    adjustGlobalInventory,
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
  const [showLossModal, setShowLossModal] = useState(false)
  const [lossReason, setLossReason] = useState('')
  const [lossError, setLossError] = useState('')
  const [lossSubmitting, setLossSubmitting] = useState(false)

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
    const raw = qtyForSite(siteId)
    const normalized = raw === '' || raw === undefined || raw === null ? '1' : String(raw)
    const qty = Number.parseFloat(normalized)
    return Number.isFinite(qty) && qty > 0 ? qty : 1
  }

  const applyInlineGlobalAdd = async () => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty('global')
    try {
      setQtyForSite('global', String(qty))
      await receiveToMain({ product_variant_id: detail.product_variant_id, qty })
      setQtyForSite('global', '1')
      await load()
    } catch (err) {
      setInlineError(err.message || 'Failed to add stock.')
    }
  }

  const openGlobalLossModal = () => {
    setInlineError('')
    setLossError('')
    const qty = parseInlineQty('global')
    setQtyForSite('global', String(qty))
    setShowLossModal(true)
  }

  const applyInlineGlobalLoss = async () => {
    if (!detail) return
    const qty = parseInlineQty('global')
    if (!String(lossReason || '').trim()) {
      setLossError('Reason is required.')
      return
    }
    try {
      setLossSubmitting(true)
      setLossError('')
      await adjustGlobalInventory({
        product_variant_id: detail.product_variant_id,
        qty_delta: -Math.abs(qty),
        notes: `Loss adjustment: ${String(lossReason).trim()}`,
      })
      setShowLossModal(false)
      setLossReason('')
      setQtyForSite('global', '1')
      await load()
    } catch (err) {
      setLossError(err.message || 'Failed to record loss adjustment.')
    } finally {
      setLossSubmitting(false)
    }
  }

  const applyInlineDispatch = async (siteId) => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty(siteId)
    try {
      setQtyForSite(siteId, String(qty))
      await dispatchToSite({
        product_variant_id: detail.product_variant_id,
        site_id: siteId,
        qty,
      })
      setQtyForSite(siteId, '1')
      await load()
    } catch (err) {
      setInlineError(err.message || 'Failed to dispense stock.')
    }
  }

  const applyInlinePullBack = async (siteId) => {
    if (!detail) return
    setInlineError('')
    const qty = parseInlineQty(siteId)
    try {
      setQtyForSite(siteId, String(qty))
      await transferInventory({
        product_variant_id: detail.product_variant_id,
        source_site_id: siteId,
        destination_site_id: 'main',
        qty,
      })
      setQtyForSite(siteId, '1')
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
  const globalItemForVariant = (globalItems || []).find(
    (item) => String(item.product_variant_id) === String(detail && detail.product_variant_id),
  )
  const capacityThresholdPerSite = Math.max(1, Number((globalItemForVariant && globalItemForVariant.capacity_threshold_per_site) || 8))
  const globalCapacityTarget = capacityThresholdPerSite * 4
  const renderCapacityCell = (qty, target) => (
    <CapacityBar value={Number(qty || 0)} target={Math.max(1, Number(target || 1))} />
  )

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
          <DescriptionSection>
            <SectionTitle>Description</SectionTitle>
            <FloatingQrPanel>
              <Label>QR Code</Label>
              <QrPreviewWrap>
                <QRCode value={detail.qr_code || detail.product_variant_id || detail.sku} size={144} includeMargin level="M" />
              </QrPreviewWrap>
              <QrCodeText>{detail.qr_code || '-'}</QrCodeText>
            </FloatingQrPanel>
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
          </DescriptionSection>

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
                <div>Capacity</div>
                <div>Adjust</div>
              </Header>
              <Row>
                <Cell>Global</Cell>
                <Cell>{renderCapacityCell(globalQty, globalCapacityTarget)}</Cell>
                <Cell>
                  <QuantityStepper
                    value={qtyForSite('global')}
                    onChange={(nextValue) => setQtyForSite('global', nextValue)}
                    onDecrement={openGlobalLossModal}
                    onIncrement={applyInlineGlobalAdd}
                    filledButtons
                    min={1}
                    step={1}
                    placeholder="1"
                  />
                </Cell>
              </Row>
              <Row>
                <Cell>Storage</Cell>
                <Cell>{renderCapacityCell(storageQty, capacityThresholdPerSite)}</Cell>
                <Cell>
                  -
                </Cell>
              </Row>
              {activeSites.map((site) => (
                <Row key={site.id}>
                  <Cell>{siteNameById[site.id] || site.id}</Cell>
                  <Cell>{renderCapacityCell(siteQtyById[site.id] || 0, capacityThresholdPerSite)}</Cell>
                  <Cell>
                    <QuantityStepper
                      value={qtyForSite(site.id)}
                      onChange={(nextValue) => setQtyForSite(site.id, nextValue)}
                      onDecrement={() => applyInlinePullBack(site.id)}
                      onIncrement={() => applyInlineDispatch(site.id)}
                      filledButtons
                      min={1}
                      step={1}
                      placeholder="1"
                    />
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
          <FormModal
            open={showLossModal}
            title="Record Loss Adjustment"
            onClose={() => {
              setShowLossModal(false)
              setLossReason('')
              setLossError('')
              setLossSubmitting(false)
            }}
            onConfirm={applyInlineGlobalLoss}
            confirmLabel={lossSubmitting ? 'Saving...' : 'Save'}
            cancelLabel="Cancel"
            confirmDisabled={lossSubmitting}
            width="460px"
            actionsAlign="right"
            closeControl="x"
          >
            <ModalMeta>
              This will reduce global stock by <strong>{parseInlineQty('global') || 0}</strong>.
            </ModalMeta>
            <ModalField>
              <span>Reason (required)</span>
              <ModalTextarea
                value={lossReason}
                onChange={(event) => setLossReason(event.target.value)}
                placeholder="e.g. damaged print, failed batch, lost item"
              />
            </ModalField>
            {lossError && <ErrorText>{lossError}</ErrorText>}
          </FormModal>
        </>
      )}
    </PageContent>
  )
}

export default InventoryDetailPage
