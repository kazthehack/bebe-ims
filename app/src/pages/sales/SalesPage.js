import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import WorkspaceTabs from 'components/reusable/layouts/WorkspaceTabs'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { useEventsResource, useReceiptsResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'

const PAGE_SIZE = 20
const STATUS_FILTER_OPTIONS = ['posted', 'open', 'done', 'void']

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

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 0;
`

const TabPanel = styled.div`
  padding: 14px;
`

const Toolbar = styled.div`
  margin-bottom: 12px;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
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

const EmptyCell = styled(Cell)`
  grid-column: 1 / -1;
  color: #607589;
`

const ActionsCell = styled.div`
  padding: 0 10px;
  color: #25384c;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #25384c;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
`

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
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

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const ErrorText = styled.div`
  color: #b42318;
  font-size: 12px;
  margin-top: 8px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`

const StatsCell = styled.div`
  padding: 12px;
  background: #f7fafc;
`

const StatsValue = styled.div`
  color: #243648;
  font-size: 24px;
  font-weight: 800;
`

const StatsLabel = styled.div`
  color: #607589;
  font-size: 12px;
  text-transform: uppercase;
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

const peso = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const formatDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString()
}

const paginate = (rows, page) => {
  const totalPages = Math.max(1, Math.ceil((rows || []).length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return {
    rows: (rows || []).slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    totalPages,
    safePage,
  }
}

const SalesPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('global')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const receiptsResource = useReceiptsResource()
  const { receipts, loading, error, getReceipt } = receiptsResource
  const { events } = useEventsResource()
  const { sites } = useSitesResource()

  const siteNameById = useMemo(() => (
    (sites || []).reduce((acc, site) => {
      acc[site.id] = site.name || site.code || site.id
      acc[site.code] = site.name || site.code || site.id
      return acc
    }, {})
  ), [sites])

  const eventNameById = useMemo(() => (
    (events || []).reduce((acc, event) => {
      acc[event.id] = event.title || event.id
      return acc
    }, {})
  ), [events])

  const activeEventTabs = useMemo(() => (
    (events || [])
      .filter((event) => String(event.status || '').toLowerCase() === 'active')
      .sort((left, right) => String(left.start_date || '').localeCompare(String(right.start_date || '')))
      .map((event) => ({
        key: `event:${event.id}`,
        eventId: event.id,
        label: `${event.title || event.code || 'Active Event'}${event.start_date || event.end_date ? ` (${event.start_date || '-'} to ${event.end_date || '-'})` : ''}`,
      }))
  ), [events])

  const tabs = useMemo(() => (
    [{ key: 'global', label: 'Global Sales' }, ...activeEventTabs]
  ), [activeEventTabs])

  useEffect(() => {
    const keys = new Set(tabs.map((tab) => tab.key))
    if (!keys.has(activeTab)) setActiveTab('global')
  }, [tabs, activeTab])

  useEffect(() => {
    setPage(1)
  }, [activeTab, search, statusFilter])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!id) return
      setDetailLoading(true)
      setDetailError('')
      try {
        const data = await getReceipt(id)
        if (cancelled) return
        setDetail(data)
      } catch (err) {
        if (!cancelled) setDetailError(err.message || 'Failed to load receipt detail.')
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [id, getReceipt])

  const filteredReceipts = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    const eventId = activeTab.startsWith('event:') ? activeTab.replace('event:', '') : ''
    const selectedStatuses = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
    return (receipts || [])
      .filter((receipt) => {
        if (eventId && receipt.event_id !== eventId) return false
        if (!selectedStatuses.includes(String(receipt.status || '').toLowerCase())) return false
        if (!query) return true
        const eventName = eventNameById[receipt.event_id] || receipt.event_id || ''
        const siteName = siteNameById[receipt.site_id] || receipt.site_id || ''
        return [
          receipt.id,
          receipt.receipt_number,
          receipt.status,
          eventName,
          siteName,
        ].join(' ').toLowerCase().includes(query)
      })
      .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))
  }, [receipts, activeTab, statusFilter, search, eventNameById, siteNameById])

  const paged = paginate(filteredReceipts, page)
  const totalAmount = useMemo(
    () => (filteredReceipts || []).reduce((sum, row) => sum + Number(row.total_amount || 0), 0),
    [filteredReceipts],
  )
  const totalUnits = useMemo(
    () => (filteredReceipts || []).reduce((sum, row) => (
      sum + (row.items || []).reduce((s, item) => s + Number(item.qty || 0), 0)
    ), 0),
    [filteredReceipts],
  )

  const title = id
    ? (
      <BreadcrumbTitle items={[
        { label: 'Sales', to: '/sales' },
        { label: detail ? detail.receipt_number : 'Receipt Detail' },
      ]}
      />
    )
    : 'Sales'

  const detailsRows = (detail && detail.items) || []
  const groupedInsights = useMemo(() => {
    const grouped = {}
    detailsRows.forEach((item) => {
      const key = String(item.product_variant_id || item.inventory_item_id || 'unmapped')
      grouped[key] = grouped[key] || { id: key, qty: 0, amount: 0 }
      grouped[key].qty += Number(item.qty || 0)
      grouped[key].amount += Number(item.line_total || 0)
    })
    return Object.values(grouped)
  }, [detailsRows])

  if (id) {
    return (
      <PageContent title={title}>
        <Section>
          <SectionTitle>Details</SectionTitle>
          {detailLoading && <Meta>Loading receipt detail...</Meta>}
          {!!detailError && <ErrorText>{detailError}</ErrorText>}
          {!!detail && (
            <Grid>
              <div><Label>Receipt Number</Label><Value>{detail.receipt_number}</Value></div>
              <div><Label>Status</Label><Value>{String(detail.status || 'posted').toUpperCase()}</Value></div>
              <div><Label>Site</Label><Value>{siteNameById[detail.site_id] || detail.site_id}</Value></div>
              <div><Label>Event</Label><Value>{eventNameById[detail.event_id] || detail.event_id || '-'}</Value></div>
              <div><Label>Subtotal</Label><Value>{peso(detail.subtotal)}</Value></div>
              <div><Label>Total</Label><Value>{peso(detail.total_amount)}</Value></div>
              <div><Label>Discount</Label><Value>{peso(detail.discount_amount)}</Value></div>
              <div><Label>Tax</Label><Value>{peso(detail.tax_amount)}</Value></div>
              <div><Label>Payment Method</Label><Value>{detail.payment_method || '-'}</Value></div>
              <div><Label>Created At</Label><Value>{formatDateTime(detail.created_at)}</Value></div>
              <div style={{ gridColumn: '1 / -1' }}><Label>Notes</Label><Value>{detail.notes || '-'}</Value></div>
            </Grid>
          )}
        </Section>

        <Section>
          <SectionTitle>Items</SectionTitle>
          <Table>
            <Header $columns="1.4fr 1fr 0.7fr 0.8fr 0.8fr">
              <div>Variant / Inventory</div><div>Variant ID</div><div>Qty</div><div>Unit Price</div><div>Line Total</div>
            </Header>
            {detailsRows.map((item) => (
              <Row key={item.id} $columns="1.4fr 1fr 0.7fr 0.8fr 0.8fr">
                <Cell>{item.inventory_item_id || item.product_variant_id || '-'}</Cell>
                <Cell>{item.product_variant_id || '-'}</Cell>
                <Cell>{item.qty}</Cell>
                <Cell>{peso(item.unit_price)}</Cell>
                <Cell>{peso(item.line_total)}</Cell>
              </Row>
            ))}
            {detailsRows.length === 0 && (
              <Row $columns="1.4fr 1fr 0.7fr 0.8fr 0.8fr">
                <EmptyCell>No sales items yet.</EmptyCell>
              </Row>
            )}
          </Table>
        </Section>

        <Section>
          <SectionTitle>Insights</SectionTitle>
          <StatsGrid>
            <StatsCell><StatsValue>{detailsRows.length}</StatsValue><StatsLabel>Line Items</StatsLabel></StatsCell>
            <StatsCell><StatsValue>{detailsRows.reduce((sum, item) => sum + Number(item.qty || 0), 0)}</StatsValue><StatsLabel>Units Sold</StatsLabel></StatsCell>
            <StatsCell><StatsValue>{peso(detail ? detail.total_amount : 0)}</StatsValue><StatsLabel>Total Sale</StatsLabel></StatsCell>
          </StatsGrid>
          <Table>
            <Header $columns="1.6fr 0.8fr 0.8fr"><div>Variant ID</div><div>Qty</div><div>Amount</div></Header>
            {groupedInsights.map((row) => (
              <Row key={row.id} $columns="1.6fr 0.8fr 0.8fr">
                <Cell>{row.id}</Cell><Cell>{row.qty}</Cell><Cell>{peso(row.amount)}</Cell>
              </Row>
            ))}
            {groupedInsights.length === 0 && (
              <Row $columns="1.6fr 0.8fr 0.8fr">
                <EmptyCell>No insights yet.</EmptyCell>
              </Row>
            )}
          </Table>
        </Section>
      </PageContent>
    )
  }

  return (
    <PageContent title={title}>
      <Surface>
        <WorkspaceTabs
          ariaLabel="Sales tabs"
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={tabs}
        />
        <TabPanel>
          <Toolbar>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search receipts"
              filters={[{
                key: 'status',
                type: 'multi-checkbox',
                label: 'Status',
                title: 'Status',
                selectedValues: parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS),
                onToggle: (value) => {
                  const current = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
                  const has = current.includes(value)
                  const next = has ? current.filter((item) => item !== value) : [...current, value]
                  setStatusFilter(next.length ? next.join(',') : '__none__')
                },
                onChangeSelected: (nextSelected) => setStatusFilter(nextSelected.length ? nextSelected.join(',') : '__none__'),
                options: STATUS_FILTER_OPTIONS.map((value) => ({
                  value,
                  label: value.charAt(0).toUpperCase() + value.slice(1),
                })),
              }]}
            />
          </Toolbar>

          <StatsGrid>
            <StatsCell><StatsValue>{filteredReceipts.length}</StatsValue><StatsLabel>Receipts</StatsLabel></StatsCell>
            <StatsCell><StatsValue>{totalUnits}</StatsValue><StatsLabel>Units Sold</StatsLabel></StatsCell>
            <StatsCell><StatsValue>{peso(totalAmount)}</StatsValue><StatsLabel>Total Sales</StatsLabel></StatsCell>
          </StatsGrid>

          <Table>
            <Header $columns="1fr 1fr 1fr 0.7fr 0.8fr 0.9fr 1fr 0.6fr">
              <div>Receipt</div><div>Site</div><div>Event</div><div>Items</div><div>Subtotal</div><div>Total</div><div>Created</div><div>Actions</div>
            </Header>
            {paged.rows.map((item) => (
              <Row key={item.id} $columns="1fr 1fr 1fr 0.7fr 0.8fr 0.9fr 1fr 0.6fr">
                <Cell>{item.receipt_number}</Cell>
                <Cell>{siteNameById[item.site_id] || item.site_id}</Cell>
                <Cell>{eventNameById[item.event_id] || item.event_id || '-'}</Cell>
                <Cell>{(item.items || []).length}</Cell>
                <Cell>{peso(item.subtotal)}</Cell>
                <Cell>{peso(item.total_amount)}</Cell>
                <Cell>{formatDateTime(item.created_at)}</Cell>
                <ActionsCell>
                  <ActionButton type="button" onClick={() => history.push(`/sales/${item.id}`)}>VIEW</ActionButton>
                </ActionsCell>
              </Row>
            ))}
            {paged.rows.length === 0 && (
              <Row $columns="1fr 1fr 1fr 0.7fr 0.8fr 0.9fr 1fr 0.6fr">
                <EmptyCell>No sales yet.</EmptyCell>
              </Row>
            )}
          </Table>

          {loading && <Meta>Loading sales...</Meta>}
          {!!error && <ErrorText>{error}</ErrorText>}
          {!loading && (
            <PaginationBar>
              <Meta>Page {paged.safePage} / {paged.totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={paged.safePage <= 1}>Prev</PaginationButton>
              <PaginationButton type="button" onClick={() => setPage((p) => Math.min(paged.totalPages, p + 1))} disabled={paged.safePage >= paged.totalPages}>Next</PaginationButton>
            </PaginationBar>
          )}
        </TabPanel>
      </Surface>
    </PageContent>
  )
}

export default SalesPage
