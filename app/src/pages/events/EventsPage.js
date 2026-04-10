import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import { PagePrimaryButton, PageSecondaryButton } from 'components/reusable/buttons/PageButtons'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { useEventsResource } from 'hooks/bazaar/useBazaarApi'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 14px;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const Toolbar = styled.div`
  margin-bottom: 12px;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.4fr 1fr 1.1fr 0.5fr 0.8fr 0.9fr 1fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.4fr 1fr 1.1fr 0.5fr 0.8fr 0.9fr 1fr 0.7fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
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

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
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

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
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

const Select = styled.select`
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  overflow: hidden;
`

const SummaryCell = styled.div`
  padding: 12px;
  background: #f7fafc;
`

const SummaryValue = styled.div`
  color: #243648;
  font-size: 24px;
  font-weight: 800;
`

const SummaryLabel = styled.div`
  color: #607589;
  font-size: 12px;
  text-transform: uppercase;
`

const SalesTable = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 10px;
`

const SalesHeader = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 0.8fr 0.8fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const SalesRow = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 0.8fr 0.8fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #eef2f6;
  min-height: 46px;
  align-items: center;
`

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const money = (value) => `PHP ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const deriveDays = (startDate, endDate) => {
  try {
    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)
    const delta = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
    return Math.max(1, delta + 1)
  } catch (_err) {
    return 1
  }
}

const EventsPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
  } = useEventsResource()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [editError, setEditError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const [titleInput, setTitleInput] = useState('')
  const [organizerInput, setOrganizerInput] = useState('')
  const [rentCostInput, setRentCostInput] = useState('0')
  const [startDateInput, setStartDateInput] = useState('')
  const [endDateInput, setEndDateInput] = useState('')
  const [startTimeInput, setStartTimeInput] = useState('09:00')
  const [endTimeInput, setEndTimeInput] = useState('18:00')
  const [locationInput, setLocationInput] = useState('')
  const [statusInput, setStatusInput] = useState('scheduled')

  const selectedEvent = useMemo(() => (events || []).find((item) => item.id === id) || null, [events, id])

  useEffect(() => {
    if (!selectedEvent) return
    setTitleInput(selectedEvent.title || '')
    setOrganizerInput(selectedEvent.organizer || '')
    setRentCostInput(String(selectedEvent.rent_cost_per_day || 0))
    setStartDateInput(selectedEvent.start_date || '')
    setEndDateInput(selectedEvent.end_date || '')
    setStartTimeInput(selectedEvent.start_time || '09:00')
    setEndTimeInput(selectedEvent.end_time || '18:00')
    setLocationInput(selectedEvent.location || '')
    setStatusInput(selectedEvent.status || 'scheduled')
    setEditError('')
  }, [selectedEvent])

  const filteredEvents = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    return (events || []).filter((item) => {
      if (statusFilter !== 'all' && String(item.status || '').toLowerCase() !== statusFilter) return false
      if (!query) return true
      return [
        item.code,
        item.title,
        item.organizer,
        item.location,
        item.start_date,
        item.end_date,
      ].join(' ').toLowerCase().includes(query)
    })
  }, [events, search, statusFilter])

  const PAGE_SIZE = 20
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedEvents = filteredEvents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [filteredEvents.length])

  const listTitle = id ? (
    <BreadcrumbTitle items={[
      { label: 'Events', to: '/events' },
      { label: selectedEvent ? selectedEvent.title : 'Event Detail' },
    ]}
    />
  ) : 'Events'

  const resetFormInputs = () => {
    setTitleInput('')
    setOrganizerInput('')
    setRentCostInput('0')
    setStartDateInput('')
    setEndDateInput('')
    setStartTimeInput('09:00')
    setEndTimeInput('18:00')
    setLocationInput('')
    setStatusInput('scheduled')
  }

  const buildPayload = () => ({
    title: String(titleInput || '').trim(),
    organizer: String(organizerInput || '').trim() || null,
    rent_cost_per_day: Number(rentCostInput || 0),
    start_date: String(startDateInput || '').trim(),
    end_date: String(endDateInput || '').trim(),
    start_time: String(startTimeInput || '').trim() || null,
    end_time: String(endTimeInput || '').trim() || null,
    location: String(locationInput || '').trim() || null,
    status: statusInput || 'scheduled',
  })

  const validatePayload = (payload) => {
    if (!payload.title) return 'Event title is required.'
    if (!payload.start_date || !payload.end_date) return 'Start and end dates are required.'
    if (Number(payload.rent_cost_per_day || 0) < 0) return 'Rent cost per day cannot be negative.'
    return ''
  }

  const handleCreate = async () => {
    setFormError('')
    const payload = buildPayload()
    const validationError = validatePayload(payload)
    if (validationError) {
      setFormError(validationError)
      return
    }
    try {
      await createEvent(payload)
      setShowCreateModal(false)
      resetFormInputs()
    } catch (err) {
      setFormError(err.message || 'Failed to create event.')
    }
  }

  const handleSave = async () => {
    if (!selectedEvent) return
    setEditError('')
    const payload = buildPayload()
    const validationError = validatePayload(payload)
    if (validationError) {
      setEditError(validationError)
      return
    }
    try {
      await updateEvent(selectedEvent.id, payload)
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || 'Failed to update event.')
    }
  }

  const closeEvent = async (eventRecord) => {
    if (!eventRecord) return
    const payload = {
      title: eventRecord.title,
      organizer: eventRecord.organizer || null,
      rent_cost_per_day: Number(eventRecord.rent_cost_per_day || 0),
      start_date: eventRecord.start_date,
      end_date: eventRecord.end_date,
      start_time: eventRecord.start_time || null,
      end_time: eventRecord.end_time || null,
      location: eventRecord.location || null,
      status: 'done',
    }
    await updateEvent(eventRecord.id, payload)
  }

  const previewDays = deriveDays(startDateInput, endDateInput)
  const previewTotal = previewDays * Number(rentCostInput || 0)

  return (
    <PageContent title={listTitle}>
      {!id && (
        <Surface>
          <Toolbar>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search code, title, organizer, location"
              filters={[
                {
                  key: 'events-status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    ...STATUS_OPTIONS,
                  ],
                },
              ]}
              right={<PagePrimaryButton type="button" onClick={() => setShowCreateModal(true)}>Add Event</PagePrimaryButton>}
            />
          </Toolbar>
          <Table>
            <Header>
              <div>Code</div>
              <div>Event</div>
              <div>Organizer</div>
              <div>Date Range</div>
              <div>Days</div>
              <div>Time</div>
              <div>Total Rent</div>
              <div>Location</div>
              <div>Action</div>
            </Header>
            {pagedEvents.map((item) => (
              <Row key={item.id}>
                <Cell>{item.code}</Cell>
                <Cell>{item.title}</Cell>
                <Cell>{item.organizer || '-'}</Cell>
                <Cell>{item.start_date} to {item.end_date}</Cell>
                <Cell>{item.days}</Cell>
                <Cell>{item.start_time || '--:--'} to {item.end_time || '--:--'}</Cell>
                <Cell>{money(item.total_rent_cost)}</Cell>
                <Cell>{item.location || '-'}</Cell>
                <ActionsCell>
                  <ActionButton
                    type="button"
                    onClick={() => history.push(`/events/${item.id}`)}
                  >
                    VIEW
                  </ActionButton>
                  <span>|</span>
                  <ActionButton
                    type="button"
                    disabled={String(item.status || '').toLowerCase() === 'done'}
                    onClick={async () => closeEvent(item)}
                  >
                    CLOSE
                  </ActionButton>
                </ActionsCell>
              </Row>
            ))}
          </Table>
          {loading && <Meta>Loading events...</Meta>}
          {!loading && !events.length && <Meta>No events yet.</Meta>}
          {error && <Meta>{error}</Meta>}
          {!loading && events.length > 0 && (
            <PaginationBar>
              <Meta>Page {safePage} / {totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={safePage <= 1}>Prev</PaginationButton>
              <PaginationButton type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages}>Next</PaginationButton>
            </PaginationBar>
          )}
        </Surface>
      )}

      {id && (
        <>
          {!loading && selectedEvent && (
            <PageActions>
              {!isEditing && <PagePrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PagePrimaryButton>}
              {isEditing && <PagePrimaryButton type="button" onClick={handleSave}>SAVE</PagePrimaryButton>}
              {isEditing && (
                <PageSecondaryButton
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setTitleInput(selectedEvent.title || '')
                    setOrganizerInput(selectedEvent.organizer || '')
                    setRentCostInput(String(selectedEvent.rent_cost_per_day || 0))
                    setStartDateInput(selectedEvent.start_date || '')
                    setEndDateInput(selectedEvent.end_date || '')
                    setStartTimeInput(selectedEvent.start_time || '09:00')
                    setEndTimeInput(selectedEvent.end_time || '18:00')
                    setLocationInput(selectedEvent.location || '')
                    setStatusInput(selectedEvent.status || 'scheduled')
                    setEditError('')
                  }}
                >
                  CANCEL
                </PageSecondaryButton>
              )}
              {!isEditing && (
                <PageSecondaryButton
                  type="button"
                  onClick={async () => closeEvent(selectedEvent)}
                  disabled={String((selectedEvent && selectedEvent.status) || '').toLowerCase() === 'done'}
                >
                  CLOSE
                </PageSecondaryButton>
              )}
            </PageActions>
          )}
          <Section>
            {loading && <Meta>Loading event detail...</Meta>}
            {!loading && !selectedEvent && <Meta>Event not found.</Meta>}
            {!loading && selectedEvent && (
              <>
                <SectionTitle>Event Details</SectionTitle>
                <Grid>
                  <div>
                    <Label>Code</Label>
                    <Value>{selectedEvent.code}</Value>
                  </div>
                  <div>
                    <Label>Status</Label>
                    {!isEditing && <Value>{selectedEvent.status || 'scheduled'}</Value>}
                    {isEditing && (
                      <Select value={statusInput} onChange={(event) => setStatusInput(event.target.value)}>
                        {STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
                        ))}
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label>Event</Label>
                    {!isEditing && <Value>{selectedEvent.title}</Value>}
                    {isEditing && <Input value={titleInput} onChange={(event) => setTitleInput(event.target.value)} />}
                  </div>
                  <div>
                    <Label>Organizer</Label>
                    {!isEditing && <Value>{selectedEvent.organizer || '-'}</Value>}
                    {isEditing && <Input value={organizerInput} onChange={(event) => setOrganizerInput(event.target.value)} />}
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    {!isEditing && <Value>{selectedEvent.start_date} to {selectedEvent.end_date}</Value>}
                    {isEditing && (
                      <Grid>
                        <Input type="date" value={startDateInput} onChange={(event) => setStartDateInput(event.target.value)} />
                        <Input type="date" value={endDateInput} onChange={(event) => setEndDateInput(event.target.value)} />
                      </Grid>
                    )}
                  </div>
                  <div>
                    <Label>Time</Label>
                    {!isEditing && <Value>{selectedEvent.start_time || '--:--'} to {selectedEvent.end_time || '--:--'}</Value>}
                    {isEditing && (
                      <Grid>
                        <Input type="time" value={startTimeInput} onChange={(event) => setStartTimeInput(event.target.value)} />
                        <Input type="time" value={endTimeInput} onChange={(event) => setEndTimeInput(event.target.value)} />
                      </Grid>
                    )}
                  </div>
                  <div>
                    <Label>Rent Cost Per Day</Label>
                    {!isEditing && <Value>{money(selectedEvent.rent_cost_per_day)}</Value>}
                    {isEditing && <Input type="number" min="0" step="0.01" value={rentCostInput} onChange={(event) => setRentCostInput(event.target.value)} />}
                  </div>
                  <div>
                    <Label>Location (if not yet available)</Label>
                    {!isEditing && <Value>{selectedEvent.location || '-'}</Value>}
                    {isEditing && <Input value={locationInput} onChange={(event) => setLocationInput(event.target.value)} />}
                  </div>
                  <div>
                    <Label>Days (derived)</Label>
                    <Value>{isEditing ? previewDays : selectedEvent.days}</Value>
                  </div>
                  <div>
                    <Label>Total Rent Cost</Label>
                    <Value>{isEditing ? money(previewTotal) : money(selectedEvent.total_rent_cost)}</Value>
                  </div>
                </Grid>
                {editError && <ErrorText>{editError}</ErrorText>}
              </>
            )}
          </Section>
          <Section>
            <SectionTitle>Sales Summary</SectionTitle>
            <SummaryGrid>
              <SummaryCell>
                <SummaryValue>{money(0)}</SummaryValue>
                <SummaryLabel>Total Sales</SummaryLabel>
              </SummaryCell>
              <SummaryCell>
                <SummaryValue>{0}</SummaryValue>
                <SummaryLabel>Sold Items</SummaryLabel>
              </SummaryCell>
            </SummaryGrid>
            <Meta>Sales integration pending: values will populate once sales workflows are connected.</Meta>
            <SalesTable>
              <SalesHeader>
                <div>Sold Item</div>
                <div>Qty</div>
                <div>Total</div>
              </SalesHeader>
              <SalesRow>
                <Cell>No sold items yet.</Cell>
                <Cell>0</Cell>
                <Cell>{money(0)}</Cell>
              </SalesRow>
            </SalesTable>
          </Section>
        </>
      )}

      <FormModal
        open={showCreateModal}
        title="Add Event"
        onClose={() => {
          setShowCreateModal(false)
          setFormError('')
          resetFormInputs()
        }}
        onConfirm={handleCreate}
        confirmLabel="Create"
        cancelLabel="Cancel"
        closeControl="glyph"
      >
        <Field>
          <Label>Event *</Label>
          <Input value={titleInput} onChange={(event) => setTitleInput(event.target.value)} />
        </Field>
        <Field>
          <Label>Organizer</Label>
          <Input value={organizerInput} onChange={(event) => setOrganizerInput(event.target.value)} />
        </Field>
        <Grid>
          <Field>
            <Label>Start Date *</Label>
            <Input type="date" value={startDateInput} onChange={(event) => setStartDateInput(event.target.value)} />
          </Field>
          <Field>
            <Label>End Date *</Label>
            <Input type="date" value={endDateInput} onChange={(event) => setEndDateInput(event.target.value)} />
          </Field>
        </Grid>
        <Grid>
          <Field>
            <Label>Start Time (HH:MM)</Label>
            <Input type="time" value={startTimeInput} onChange={(event) => setStartTimeInput(event.target.value)} />
          </Field>
          <Field>
            <Label>End Time (HH:MM)</Label>
            <Input type="time" value={endTimeInput} onChange={(event) => setEndTimeInput(event.target.value)} />
          </Field>
        </Grid>
        <Grid>
          <Field>
            <Label>Rent Cost Per Day</Label>
            <Input type="number" min="0" step="0.01" value={rentCostInput} onChange={(event) => setRentCostInput(event.target.value)} />
          </Field>
          <Field>
            <Label>Status</Label>
            <Select value={statusInput} onChange={(event) => setStatusInput(event.target.value)}>
              {STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
              ))}
            </Select>
          </Field>
        </Grid>
        <Field>
          <Label>Location (if not yet available)</Label>
          <Input value={locationInput} onChange={(event) => setLocationInput(event.target.value)} />
        </Field>
        <Meta>Days (derived): {previewDays} | Total Rent Cost: {money(previewTotal)}</Meta>
        {formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>
    </PageContent>
  )
}

export default EventsPage
