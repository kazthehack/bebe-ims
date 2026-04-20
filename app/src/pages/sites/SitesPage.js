import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import { PageDangerButton, PagePrimaryButton, PageSecondaryButton } from 'components/reusable/buttons/PageButtons'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { useEventsResource, useInventoryResource, useSitesResource } from 'hooks/bazaar/useBazaarApi'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 14px;
`

const Toolbar = styled.div`
  display: block;
  margin-bottom: 12px;
`

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
  grid-template-columns: 1fr 1.5fr 1.5fr 0.9fr 0.8fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.button`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 0.9fr 0.8fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
  cursor: pointer;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const ActionCell = styled(Cell)`
  font-size: 12px;
  font-weight: 700;
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

const Field = styled.div`
  margin-bottom: 10px;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  background: #f0f3f6;
`

const ErrorText = styled.div`
  color: #b42318;
  font-size: 12px;
  margin-top: 8px;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  background: #f0f3f6;
`

const ListTable = styled.div`
  display: grid;
  gap: 6px;
`

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || '1fr'};
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const ListRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || '1fr'};
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  align-items: center;
  min-height: 50px;
`

const LinkButton = styled.button`
  border: none;
  background: none;
  color: #25384c;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`

const Subsection = styled.div`
  margin-top: 14px;
`

const SubsectionTitle = styled.div`
  color: #4f6278;
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 8px;
`

const SpacedMeta = styled(Meta)`
  margin-top: 10px;
  margin-bottom: 8px;
`

const STATUS_FILTER_OPTIONS = ['active', 'inactive']

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

const SitesPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignEventModal, setShowAssignEventModal] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [formError, setFormError] = useState('')
  const [assignError, setAssignError] = useState('')
  const [inventoryError, setInventoryError] = useState('')
  const [siteMessage, setSiteMessage] = useState('')
  const [siteActionError, setSiteActionError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editError, setEditError] = useState('')
  const [siteInventoryItems, setSiteInventoryItems] = useState([])
  const [siteInventoryLoading, setSiteInventoryLoading] = useState(false)
  const [siteEventsLoading, setSiteEventsLoading] = useState(false)
  const {
    sites,
    siteEventsById,
    loading,
    error,
    createSite,
    updateSite,
    loadSiteEvents,
    assignEventToSite,
    returnAllInventoryToGlobal,
    closeSiteEvent,
  } = useSitesResource()
  const { events } = useEventsResource()
  const { loadSite } = useInventoryResource()

  const filteredSites = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    const selectedStatuses = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
    return (sites || []).filter((site) => {
      const normalizedStatus = site.active ? 'active' : 'inactive'
      if (!selectedStatuses.includes(normalizedStatus)) return false
      if (!query) return true
      return [
        site.code,
        site.name,
        site.location,
        site.id,
      ].join(' ').toLowerCase().includes(query)
    })
  }, [sites, search, statusFilter])

  const selectedSite = useMemo(
    () => (sites || []).find((site) => site.id === id) || null,
    [sites, id],
  )
  const selectedSiteId = selectedSite ? selectedSite.id : ''
  const PAGE_SIZE = 20
  const totalPages = Math.max(1, Math.ceil((filteredSites || []).length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedSites = useMemo(
    () => (filteredSites || []).slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredSites, safePage],
  )

  useEffect(() => {
    setPage(1)
  }, [filteredSites.length])

  useEffect(() => {
    if (!selectedSite) return
    setEditName(selectedSite.name || '')
    setEditLocation(selectedSite.location || '')
    setEditError('')
  }, [selectedSite])

  useEffect(() => {
    let mounted = true
    if (!selectedSiteId) return () => { mounted = false }
    const run = async () => {
      setSiteActionError('')
      setSiteMessage('')
      setInventoryError('')
      setSiteInventoryLoading(true)
      setSiteEventsLoading(true)
      try {
        const [eventsData, inventoryData] = await Promise.all([
          loadSiteEvents(selectedSiteId),
          loadSite(selectedSiteId),
        ])
        if (!mounted) return
        const sortedInventory = (inventoryData.items || []).slice().sort((left, right) => {
          const leftName = `${left.product_name || ''} ${left.variant_name || ''}`.trim().toLowerCase()
          const rightName = `${right.product_name || ''} ${right.variant_name || ''}`.trim().toLowerCase()
          return leftName.localeCompare(rightName)
        })
        setSiteInventoryItems(sortedInventory)
        if (!selectedEventId && (eventsData || []).length > 0) {
          setSelectedEventId(eventsData[0].id)
        }
      } catch (err) {
        if (!mounted) return
        setInventoryError(err.message || 'Failed to load site inventory.')
      } finally {
        if (mounted) {
          setSiteInventoryLoading(false)
          setSiteEventsLoading(false)
        }
      }
    }
    run()
    return () => { mounted = false }
  }, [selectedSiteId, loadSiteEvents, loadSite])

  const title = id
    ? (
      <BreadcrumbTitle items={[
        { label: 'Sites', to: '/sites' },
        { label: (selectedSite && selectedSite.name) || 'Site Detail' },
      ]}
      />
    )
    : 'Sites'

  const assignedEvents = selectedSite ? (siteEventsById[selectedSite.id] || []) : []
  const isClosedStatus = (value) => ['closed', 'done', 'cancelled'].includes(String(value || '').trim().toLowerCase())
  const formatEventDateRange = (event) => `${event.start_date || '-'} to ${event.end_date || '-'}`
  const eventWithDates = (event) => `${event.title}${event.start_date || event.end_date ? ` (${formatEventDateRange(event)})` : ''}`
  const byEventDate = (left, right) => {
    const leftStart = String(left.start_date || '')
    const rightStart = String(right.start_date || '')
    if (leftStart !== rightStart) return leftStart.localeCompare(rightStart)
    const leftEnd = String(left.end_date || '')
    const rightEnd = String(right.end_date || '')
    if (leftEnd !== rightEnd) return leftEnd.localeCompare(rightEnd)
    return String(left.title || '').localeCompare(String(right.title || ''))
  }
  const visibleAssignedEvents = assignedEvents
    .filter((event) => !isClosedStatus(event.status))
    .slice()
    .sort(byEventDate)
  const activeEvent = visibleAssignedEvents.find((event) => Boolean(event.active_for_site)) || null
  const historyEvents = visibleAssignedEvents.filter((event) => !event.active_for_site)
  const formatStatus = (value) => String(value || '-').trim().toUpperCase()
  const assignableEvents = (events || [])
    .filter((event) => !isClosedStatus(event.status))
    .slice()
    .sort(byEventDate)

  const handleCreate = async () => {
    setFormError('')
    if (!name.trim()) {
      setFormError('Name is required.')
      return
    }
    try {
      await createSite({
        name: name.trim(),
        location: location.trim() || null,
        active: true,
      })
      setName('')
      setLocation('')
      setShowCreateModal(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create site.')
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedSite) return
    setEditError('')
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    try {
      await updateSite(selectedSite.id, {
        name: editName.trim(),
        location: editLocation.trim() || null,
        active: Boolean(selectedSite.active),
      })
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || 'Failed to update site.')
    }
  }

  const handleAssignEvent = async () => {
    if (!selectedSite) return
    setAssignError('')
    if (!selectedEventId) {
      setAssignError('Event is required.')
      return
    }
    try {
      await assignEventToSite({
        siteId: selectedSite.id,
        eventId: selectedEventId,
        makeActive: true,
      })
      setShowAssignEventModal(false)
      setSiteMessage('Event assigned to site and set as active.')
    } catch (err) {
      setAssignError(err.message || 'Failed to assign event.')
    }
  }

  const handleReturnAll = async () => {
    if (!selectedSite) return
    setSiteActionError('')
    setSiteMessage('')
    try {
      const result = await returnAllInventoryToGlobal(selectedSite.id)
      const inventoryData = await loadSite(selectedSite.id)
      const sortedInventory = (inventoryData.items || []).slice().sort((left, right) => {
        const leftName = `${left.product_name || ''} ${left.variant_name || ''}`.trim().toLowerCase()
        const rightName = `${right.product_name || ''} ${right.variant_name || ''}`.trim().toLowerCase()
        return leftName.localeCompare(rightName)
      })
      setSiteInventoryItems(sortedInventory)
      setSiteMessage(`Returned ${Number(result.moved_qty || 0).toFixed(2)} units across ${result.moved_variants || 0} variants to global.`)
    } catch (err) {
      setSiteActionError(err.message || 'Failed to return inventory to global.')
    }
  }

  const handleCloseActiveEvent = async () => {
    if (!selectedSite || !activeEvent) return
    setSiteActionError('')
    setSiteMessage('')
    try {
      await closeSiteEvent(selectedSite.id, activeEvent.id)
      setSiteMessage(`Closed event ${activeEvent.code || activeEvent.title}.`)
    } catch (err) {
      setSiteActionError(err.message || 'Failed to close active event.')
    }
  }

  return (
    <PageContent title={title}>
      {!id && (
        <Surface>
          <Toolbar>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search code, name, location"
              filters={[
                {
                  key: 'site-status',
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
                  options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ],
                },
              ]}
              right={<PagePrimaryButton type="button" onClick={() => setShowCreateModal(true)}>Add Site</PagePrimaryButton>}
            />
          </Toolbar>
          <Table>
            <Header>
              <div>Code</div>
              <div>Name</div>
              <div>Location</div>
              <div>Status</div>
              <div>Action</div>
            </Header>
            {pagedSites.map((site) => (
              <Row key={site.id} type="button" onClick={() => history.push(`/sites/${site.id}`)}>
                <Cell>{site.code}</Cell>
                <Cell>{site.name}</Cell>
                <Cell>{site.location || '-'}</Cell>
                <Cell>{site.active ? 'Active' : 'Inactive'}</Cell>
                <ActionCell>VIEW</ActionCell>
              </Row>
            ))}
          </Table>
          {loading && <Meta>Loading sites...</Meta>}
          {!loading && !(sites || []).length && <Meta>No sites yet.</Meta>}
          {error && <Meta>{error}</Meta>}
          {!loading && (sites || []).length > 0 && (
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
        </Surface>
      )}

      {id && (
        <>
          {!loading && selectedSite && (
            <PageActions>
              {!isEditing && <PagePrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PagePrimaryButton>}
              {isEditing && <PagePrimaryButton type="button" onClick={handleSaveEdit}>SAVE</PagePrimaryButton>}
              {isEditing && (
                <PageSecondaryButton
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditName(selectedSite.name || '')
                    setEditLocation(selectedSite.location || '')
                    setEditError('')
                  }}
                >
                  CANCEL
                </PageSecondaryButton>
              )}
            </PageActions>
          )}
          <Section>
          {loading && <Meta>Loading site detail...</Meta>}
          {!loading && !selectedSite && <Meta>Site not found.</Meta>}
          {!loading && selectedSite && (
            <>
              <SectionTitle>Site Details</SectionTitle>
              <Grid>
                <div>
                  <Label>Code</Label>
                  <Value>{selectedSite.code}</Value>
                </div>
                <div>
                  <Label>Name</Label>
                  {!isEditing && <Value>{selectedSite.name}</Value>}
                  {isEditing && <Input value={editName} onChange={(event) => setEditName(event.target.value)} />}
                </div>
                <div>
                  <Label>Location</Label>
                  {!isEditing && <Value>{selectedSite.location || '-'}</Value>}
                  {isEditing && <Input value={editLocation} onChange={(event) => setEditLocation(event.target.value)} />}
                </div>
                <div>
                  <Label>Status</Label>
                  <Value>{selectedSite.active ? 'Active' : 'Inactive'}</Value>
                </div>
              </Grid>
              {editError && <ErrorText>{editError}</ErrorText>}
            </>
          )}
          </Section>
          {!loading && selectedSite && (
            <Section>
              <SectionHeader>
                <SectionTitle style={{ margin: 0 }}>Assigned Events</SectionTitle>
                <PagePrimaryButton type="button" onClick={() => {
                  setSelectedEventId((assignableEvents[0] && assignableEvents[0].id) || '')
                  setAssignError('')
                  setShowAssignEventModal(true)
                }}
                >
                  Assign Event
                </PagePrimaryButton>
              </SectionHeader>
              <Subsection>
                <SubsectionTitle>Active Event</SubsectionTitle>
                <ListTable>
                  <ListHeader columns="1fr 2fr 1.4fr 1fr 1fr">
                    <div>Code</div>
                    <div>Event</div>
                    <div>Date Range</div>
                    <div>Status</div>
                    <div>Action</div>
                  </ListHeader>
                  {siteEventsLoading && <SpacedMeta>Loading site events...</SpacedMeta>}
                  {!siteEventsLoading && activeEvent && (
                    <ListRow key={activeEvent.id} columns="1fr 2fr 1.4fr 1fr 1fr">
                      <Cell>{activeEvent.code}</Cell>
                      <Cell>{eventWithDates(activeEvent)}</Cell>
                      <Cell>{formatEventDateRange(activeEvent)}</Cell>
                      <Cell>{formatStatus(activeEvent.status)}</Cell>
                      <Cell>
                        <LinkButton type="button" onClick={handleCloseActiveEvent}>
                          CLOSE
                        </LinkButton>
                      </Cell>
                    </ListRow>
                  )}
                  {!siteEventsLoading && !activeEvent && (
                    <ListRow columns="1fr 2fr 1.4fr 1fr 1fr">
                      <Cell>No events assigned</Cell>
                      <Cell>-</Cell>
                      <Cell>-</Cell>
                      <Cell>-</Cell>
                      <Cell>-</Cell>
                    </ListRow>
                  )}
                </ListTable>
              </Subsection>
              <Subsection>
                <SubsectionTitle>Event History</SubsectionTitle>
                <ListTable>
                  <ListHeader columns="1fr 2fr 1.4fr 1fr">
                    <div>Code</div>
                    <div>Event</div>
                    <div>Date Range</div>
                    <div>Status</div>
                  </ListHeader>
                  {siteEventsLoading && <SpacedMeta>Loading site history...</SpacedMeta>}
                  {!siteEventsLoading && historyEvents.map((event) => (
                    <ListRow key={event.id} columns="1fr 2fr 1.4fr 1fr">
                      <Cell>{event.code}</Cell>
                      <Cell>{eventWithDates(event)}</Cell>
                      <Cell>{formatEventDateRange(event)}</Cell>
                      <Cell>{formatStatus(event.status)}</Cell>
                    </ListRow>
                  ))}
                  {!siteEventsLoading && historyEvents.length === 0 && (
                    <SpacedMeta>No event history yet.</SpacedMeta>
                  )}
                </ListTable>
              </Subsection>
            </Section>
          )}
          {!loading && selectedSite && (
            <Section>
              <SectionHeader>
                <SectionTitle style={{ margin: 0 }}>Inventory Variants</SectionTitle>
                <PageDangerButton type="button" onClick={handleReturnAll}>Return All to Global</PageDangerButton>
              </SectionHeader>
              <ListTable>
                <ListHeader columns="2fr 1.5fr 1fr 1fr">
                  <div>Product</div>
                  <div>Variant</div>
                  <div>Qty Available</div>
                  <div>Action</div>
                </ListHeader>
                {siteInventoryLoading && <Meta>Loading site inventory...</Meta>}
                {!siteInventoryLoading && siteInventoryItems.map((item) => (
                  <ListRow key={item.inventory_id || item.product_variant_id} columns="2fr 1.5fr 1fr 1fr">
                    <Cell>{item.product_name}</Cell>
                    <Cell>{item.variant_name || '-'}</Cell>
                    <Cell>{Number(item.qty_available || 0).toFixed(2)}</Cell>
                    <Cell>
                      <LinkButton
                        type="button"
                        onClick={() => history.push(`/inventory/${item.inventory_id || item.product_variant_id}`)}
                      >
                        VIEW
                      </LinkButton>
                    </Cell>
                  </ListRow>
                ))}
                {!siteInventoryLoading && siteInventoryItems.length === 0 && (
                  <Meta>No inventory variants at this site yet.</Meta>
                )}
              </ListTable>
              {siteMessage && <Meta>{siteMessage}</Meta>}
              {inventoryError && <ErrorText>{inventoryError}</ErrorText>}
              {siteActionError && <ErrorText>{siteActionError}</ErrorText>}
            </Section>
          )}
        </>
      )}

      <FormModal
        open={showCreateModal}
        title="Add Site"
        onClose={() => {
          setShowCreateModal(false)
          setFormError('')
        }}
        onConfirm={handleCreate}
        confirmLabel="Create"
        cancelLabel="Cancel"
      >
        <Field>
          <Label>Name</Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field>
          <Label>Location</Label>
          <Input value={location} onChange={(event) => setLocation(event.target.value)} />
        </Field>
        {formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>
      <FormModal
        open={showAssignEventModal}
        title="Assign Event"
        onClose={() => {
          setShowAssignEventModal(false)
          setAssignError('')
        }}
        onConfirm={handleAssignEvent}
        confirmLabel="Assign"
        cancelLabel="Cancel"
      >
        <Field>
          <Label>Event</Label>
          <Select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
            <option value="">Select event</option>
            {assignableEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.code ? `${event.code} - ` : ''}{eventWithDates(event)}
              </option>
            ))}
          </Select>
        </Field>
        {assignError && <ErrorText>{assignError}</ErrorText>}
      </FormModal>
    </PageContent>
  )
}

export default SitesPage
