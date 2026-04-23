import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import ConfirmActionModal from 'components/reusable/modals/ConfirmActionModal'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import WorkspaceTabs from 'components/reusable/layouts/WorkspaceTabs'
import { PagePrimaryButton, PageSecondaryButton } from 'components/reusable/buttons/PageButtons'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { usePartnersResource } from 'hooks/bazaar/useBazaarApi'
import { useListPageScope } from 'contexts/ListPageContext'

const PAGE_SIZE = 20
const STATUS_FILTER_OPTIONS = ['active', 'open', 'outstanding', 'inactive', 'done']
const CRM_LIST_CONTEXT_SCOPE = 'crm'

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

const readCrmListStateFromSearch = (search) => {
  try {
    const params = new URLSearchParams(String(search || ''))
    const num = (key, fallback = 1) => {
      const parsed = Number(params.get(key) || fallback)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }
    return {
      activeTab: params.get('tab') || undefined,
      search: params.get('q') || undefined,
      statusFilter: params.get('status') || undefined,
      partnershipsPage: num('partnerships_page', 1),
      requestsPage: num('requests_page', 1),
    }
  } catch (_err) {
    return {}
  }
}

const toCrmListQuery = (state) => {
  const params = new URLSearchParams()
  const activeTab = String((state && state.activeTab) || 'partnerships')
  const search = String((state && state.search) || '')
  const statusFilter = String((state && state.statusFilter) || 'all')
  const partnershipsPage = Math.max(1, Number((state && state.partnershipsPage) || 1))
  const requestsPage = Math.max(1, Number((state && state.requestsPage) || 1))
  params.set('tab', activeTab)
  params.set('partnerships_page', String(partnershipsPage))
  params.set('requests_page', String(requestsPage))
  if (search) params.set('q', search)
  if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
  return params.toString()
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0;
  color: #243648;
  font-size: 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const TextArea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 90px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background: #f0f3f6;
  resize: vertical;
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

const dateRangeText = (startDate, endDate) => {
  if (!startDate && !endDate) return '-'
  if (startDate && endDate) return `${startDate} to ${endDate}`
  return startDate || endDate
}

const money = (value) => `PHP ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const paginate = (rows, page) => {
  const totalPages = Math.max(1, Math.ceil((rows || []).length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return {
    rows: (rows || []).slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    totalPages,
    safePage,
  }
}

const CrmListPage = () => {
  const history = useHistory()
  const location = useLocation()
  const { scopeState, setScopeState } = useListPageScope(CRM_LIST_CONTEXT_SCOPE)
  const restoredState = useMemo(() => ({
    ...scopeState,
    ...readCrmListStateFromSearch(location.search),
  }), [scopeState, location.search])
  const path = location.pathname || '/crm'
  const partnershipMatch = path.match(/^\/crm\/partnerships\/([^/]+)$/)
  const requestMatch = path.match(/^\/crm\/requests\/([^/]+)$/)
  const partnershipId = partnershipMatch ? decodeURIComponent(partnershipMatch[1]) : null
  const requestId = requestMatch ? decodeURIComponent(requestMatch[1]) : null
  const inDetail = Boolean(partnershipId || requestId)

  const [activeTab, setActiveTab] = useState(() => String(restoredState.activeTab || 'partnerships'))
  const [search, setSearch] = useState(() => String(restoredState.search || ''))
  const [statusFilter, setStatusFilter] = useState(() => String(restoredState.statusFilter || 'all'))
  const [partnershipsPage, setPartnershipsPage] = useState(() => Math.max(1, Number(restoredState.partnershipsPage || 1)))
  const [requestsPage, setRequestsPage] = useState(() => Math.max(1, Number(restoredState.requestsPage || 1)))
  const [remittancesPage, setRemittancesPage] = useState(1)
  const [requestHistoryPage, setRequestHistoryPage] = useState(1)

  const [showPartnershipModal, setShowPartnershipModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showRemittanceModal, setShowRemittanceModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [formError, setFormError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)

  const [partnershipDetail, setPartnershipDetail] = useState(null)
  const [requestDetail, setRequestDetail] = useState(null)
  const [isEditingPartnership, setIsEditingPartnership] = useState(false)
  const [isEditingRequest, setIsEditingRequest] = useState(false)

  const [partnershipForm, setPartnershipForm] = useState({
    name: '',
    status: 'active',
    contact_person: '',
    contact_number: '',
    start_date: '',
    end_date: '',
    notes: '',
  })
  const [requestForm, setRequestForm] = useState({
    partnership_id: '',
    title: '',
    status: 'open',
    cost_php: '0',
    start_date: '',
    end_date: '',
    notes: '',
  })
  const [remittanceForm, setRemittanceForm] = useState({
    date: '',
    amount_php: '0',
    notes: '',
  })
  const [editPartnership, setEditPartnership] = useState({
    name: '',
    status: 'active',
    contact_person: '',
    contact_number: '',
    start_date: '',
    end_date: '',
    notes: '',
  })
  const [editRequest, setEditRequest] = useState({
    partnership_id: '',
    title: '',
    status: 'open',
    cost_php: '0',
    start_date: '',
    end_date: '',
    notes: '',
  })

  const [remittances, setRemittances] = useState([])
  const [requestHistory, setRequestHistory] = useState([])

  const {
    partnerships,
    requests,
    loading,
    error,
    createPartnership,
    updatePartnership,
    deletePartnership,
    createRequest,
    updateRequest,
    deleteRequest,
    createRemittance,
    getPartnership,
    getRequest,
    getPartnershipRemittances,
    getPartnershipRequests,
  } = usePartnersResource()

  useEffect(() => {
    if (requestId) setActiveTab('requests')
    if (partnershipId) setActiveTab('partnerships')
  }, [requestId, partnershipId])

  useEffect(() => {
    setPartnershipsPage(1)
    setRequestsPage(1)
  }, [search, statusFilter, activeTab])

  const listQuery = useMemo(() => toCrmListQuery({
    activeTab,
    search,
    statusFilter,
    partnershipsPage,
    requestsPage,
  }), [activeTab, search, statusFilter, partnershipsPage, requestsPage])

  useEffect(() => {
    setScopeState({
      activeTab,
      search,
      statusFilter,
      partnershipsPage,
      requestsPage,
    })
  }, [activeTab, search, statusFilter, partnershipsPage, requestsPage, setScopeState])

  useEffect(() => {
    const currentQuery = String(location.search || '').replace(/^\?/, '')
    if (currentQuery === listQuery) return
    history.replace(`/crm?${listQuery}`)
  }, [history, location.search, listQuery])

  useEffect(() => {
    setRemittancesPage(1)
  }, [remittances.length])

  useEffect(() => {
    setRequestHistoryPage(1)
  }, [requestHistory.length])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!partnershipId) return
      setDetailLoading(true)
      setDetailError('')
      try {
        const [partnershipData, remittanceData, requestData] = await Promise.all([
          getPartnership(partnershipId),
          getPartnershipRemittances(partnershipId),
          getPartnershipRequests(partnershipId),
        ])
        if (cancelled) return
        setPartnershipDetail(partnershipData)
        setRemittances(remittanceData.remittances || [])
        setRequestHistory(requestData.requests || [])
        setEditPartnership({
          name: partnershipData.name || '',
          status: partnershipData.status || 'active',
          contact_person: partnershipData.contact_person || '',
          contact_number: partnershipData.contact_number || '',
          start_date: partnershipData.start_date || '',
          end_date: partnershipData.end_date || '',
          notes: partnershipData.notes || '',
        })
        setRequestForm((prev) => ({ ...prev, partnership_id: partnershipData.id }))
      } catch (err) {
        if (!cancelled) setDetailError(err.message || 'Failed to load partnership detail.')
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [partnershipId, getPartnership, getPartnershipRemittances, getPartnershipRequests])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!requestId) return
      setDetailLoading(true)
      setDetailError('')
      try {
        const data = await getRequest(requestId)
        if (cancelled) return
        setRequestDetail(data)
        setEditRequest({
          partnership_id: data.partnership_id || '',
          title: data.title || '',
          status: data.status || 'open',
          cost_php: String(data.cost_php || 0),
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          notes: data.notes || '',
        })
      } catch (err) {
        if (!cancelled) setDetailError(err.message || 'Failed to load request detail.')
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [requestId, getRequest])

  const filteredPartnerships = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    const selectedStatuses = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
    return (partnerships || []).filter((item) => {
      if (!selectedStatuses.includes(String(item.status || '').toLowerCase())) return false
      if (!query) return true
      return `${item.code} ${item.name} ${item.contact_person || ''} ${item.contact_number || ''}`.toLowerCase().includes(query)
    })
  }, [partnerships, search, statusFilter])

  const filteredRequests = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    const selectedStatuses = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
    return (requests || []).filter((item) => {
      if (!selectedStatuses.includes(String(item.status || '').toLowerCase())) return false
      if (!query) return true
      return `${item.code} ${item.title} ${item.partnership_name || ''} ${item.notes || ''}`.toLowerCase().includes(query)
    })
  }, [requests, search, statusFilter])

  const requestCountByPartnership = useMemo(() => (
    (requests || []).reduce((index, item) => {
      if (item.partnership_id) index[item.partnership_id] = (index[item.partnership_id] || 0) + 1
      return index
    }, {})
  ), [requests])
  const partnerOptions = useMemo(() => (
    (partnerships || [])
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || ''),
        name: String(item.name || item.code || 'Unnamed Partner'),
      }))
      .filter((item) => item.id)
  ), [partnerships])

  const pagedPartnerships = paginate(filteredPartnerships, partnershipsPage)
  const pagedRequests = paginate(filteredRequests, requestsPage)
  const pagedRemittances = paginate(remittances, remittancesPage)
  const pagedRequestHistory = paginate(requestHistory, requestHistoryPage)
  const totalRemitted = useMemo(
    () => (remittances || []).reduce((sum, item) => sum + Number(item.amount_php || 0), 0),
    [remittances],
  )

  const partnershipTitle = partnershipDetail ? (partnershipDetail.name || partnershipDetail.code || 'Partnership') : 'Partnership'
  const requestTitle = requestDetail ? (requestDetail.title || requestDetail.code || 'Request') : 'Request'

  const pageTitle = partnershipId ? (
    <BreadcrumbTitle items={[{ label: 'Partners', to: `/crm?${listQuery}` }, { label: 'Partnerships', to: `/crm?${listQuery}` }, { label: partnershipTitle }]} />
  ) : requestId ? (
    <BreadcrumbTitle items={[{ label: 'Partners', to: `/crm?${listQuery}` }, { label: 'Requests', to: `/crm?${listQuery}` }, { label: requestTitle }]} />
  ) : 'Partners'

  const openRequestModal = (prefilledPartnershipId = '') => {
    setFormError('')
    setRequestForm({
      partnership_id: prefilledPartnershipId || '',
      title: '',
      status: 'open',
      cost_php: '0',
      start_date: '',
      end_date: '',
      notes: '',
    })
    setShowRequestModal(true)
  }

  const submitPartnership = async () => {
    if (!partnershipForm.name.trim()) return setFormError('Partnership name is required.')
    try {
      setFormError('')
      await createPartnership({
        name: partnershipForm.name.trim(),
        status: partnershipForm.status,
        contact_person: partnershipForm.contact_person.trim() || null,
        contact_number: partnershipForm.contact_number.trim() || null,
        start_date: partnershipForm.start_date || null,
        end_date: partnershipForm.end_date || null,
        notes: partnershipForm.notes.trim() || null,
      })
      setShowPartnershipModal(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create partnership.')
    }
  }

  const submitRequest = async () => {
    if (!requestForm.title.trim()) return setFormError('Request title is required.')
    try {
      setFormError('')
      await createRequest({
        partnership_id: requestForm.partnership_id || null,
        title: requestForm.title.trim(),
        status: requestForm.status,
        cost_php: Number(requestForm.cost_php || 0),
        start_date: requestForm.start_date || null,
        end_date: requestForm.end_date || null,
        notes: requestForm.notes.trim() || null,
      })
      setShowRequestModal(false)
      if (partnershipId) {
        const requestData = await getPartnershipRequests(partnershipId)
        setRequestHistory(requestData.requests || [])
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create request.')
    }
  }

  const submitRemittance = async () => {
    if (!partnershipId) return
    if (!remittanceForm.date) return setFormError('Date is required.')
    try {
      setFormError('')
      await createRemittance(partnershipId, {
        date: remittanceForm.date,
        amount_php: Number(remittanceForm.amount_php || 0),
        notes: remittanceForm.notes.trim() || null,
      })
      const remittanceData = await getPartnershipRemittances(partnershipId)
      setRemittances(remittanceData.remittances || [])
      setShowRemittanceModal(false)
    } catch (err) {
      setFormError(err.message || 'Failed to add remittance.')
    }
  }

  const savePartnership = async () => {
    if (!partnershipId) return
    try {
      setDetailError('')
      await updatePartnership(partnershipId, {
        name: editPartnership.name.trim(),
        status: editPartnership.status,
        contact_person: editPartnership.contact_person.trim() || null,
        contact_number: editPartnership.contact_number.trim() || null,
        start_date: editPartnership.start_date || null,
        end_date: editPartnership.end_date || null,
        notes: editPartnership.notes.trim() || null,
      })
      const data = await getPartnership(partnershipId)
      setPartnershipDetail(data)
      setIsEditingPartnership(false)
    } catch (err) {
      setDetailError(err.message || 'Failed to update partnership.')
    }
  }

  const saveRequest = async () => {
    if (!requestId) return
    try {
      setDetailError('')
      await updateRequest(requestId, {
        partnership_id: editRequest.partnership_id || null,
        title: editRequest.title.trim(),
        status: editRequest.status,
        cost_php: Number(editRequest.cost_php || 0),
        start_date: editRequest.start_date || null,
        end_date: editRequest.end_date || null,
        notes: editRequest.notes.trim() || null,
      })
      const data = await getRequest(requestId)
      setRequestDetail(data)
      setIsEditingRequest(false)
    } catch (err) {
      setDetailError(err.message || 'Failed to update request.')
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return
    if (pendingDelete.type === 'partnership') {
      await deletePartnership(pendingDelete.id)
      if (partnershipId === pendingDelete.id) history.push(`/crm?${listQuery}`)
    } else {
      await deleteRequest(pendingDelete.id)
      if (requestId === pendingDelete.id) history.push(`/crm?${listQuery}`)
      if (partnershipId) {
        const requestData = await getPartnershipRequests(partnershipId)
        setRequestHistory(requestData.requests || [])
      }
    }
  }

  return (
    <PageContent title={pageTitle}>
      {!inDetail && (
        <Surface>
          <WorkspaceTabs
            ariaLabel="Partners workspace tabs"
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { key: 'partnerships', label: 'Partnerships' },
              { key: 'requests', label: 'Requests' },
            ]}
          />
          <TabPanel>
          <Toolbar>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder={activeTab === 'partnerships' ? 'Search partnerships' : 'Search requests'}
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
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'open', label: 'Open' },
                  { value: 'outstanding', label: 'Outstanding' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'done', label: 'Done' },
                ],
              }]}
              right={activeTab === 'partnerships'
                ? <PagePrimaryButton type="button" onClick={() => setShowPartnershipModal(true)}>Add Partnership</PagePrimaryButton>
                : <PagePrimaryButton type="button" onClick={() => openRequestModal('')}>Add Request</PagePrimaryButton>}
            />
          </Toolbar>

          {activeTab === 'partnerships' && (
            <Table>
              <Header $columns="0.8fr 1.5fr 0.9fr 1fr 0.8fr 1fr">
                <div>Code</div><div>Name</div><div>Status</div><div>Contact</div><div>Requests</div><div>Actions</div>
              </Header>
              {pagedPartnerships.rows.map((item) => (
                <Row key={item.id} $columns="0.8fr 1.5fr 0.9fr 1fr 0.8fr 1fr">
                  <Cell>{item.code}</Cell>
                  <Cell>{item.name}</Cell>
                  <Cell>{String(item.status || '').toUpperCase()}</Cell>
                  <Cell>{item.contact_person || '-'}</Cell>
                  <Cell>{requestCountByPartnership[item.id] || 0}</Cell>
                  <ActionsCell>
                    <ActionButton type="button" onClick={() => history.push(`/crm/partnerships/${item.id}?${listQuery}`)}>VIEW</ActionButton>
                    <span>|</span>
                    <ActionButton type="button" onClick={() => { setPendingDelete({ type: 'partnership', id: item.id, code: item.code, label: item.name }); setShowDeleteConfirm(true) }}>DELETE</ActionButton>
                  </ActionsCell>
                </Row>
              ))}
              {pagedPartnerships.rows.length === 0 && (
                <Row $columns="0.8fr 1.5fr 0.9fr 1fr 0.8fr 1fr">
                  <EmptyCell>No partnerships yet.</EmptyCell>
                </Row>
              )}
            </Table>
          )}

          {activeTab === 'requests' && (
            <Table>
              <Header $columns="0.8fr 1.2fr 1.4fr 0.8fr 1.2fr 0.8fr 1fr">
                <div>Code</div><div>Partner</div><div>Request</div><div>Cost</div><div>Dates</div><div>Status</div><div>Actions</div>
              </Header>
              {pagedRequests.rows.map((item) => (
                <Row key={item.id} $columns="0.8fr 1.2fr 1.4fr 0.8fr 1.2fr 0.8fr 1fr">
                  <Cell>{item.code}</Cell>
                  <Cell>{item.partnership_name || '-'}</Cell>
                  <Cell>{item.title}</Cell>
                  <Cell>{money(item.cost_php)}</Cell>
                  <Cell>{dateRangeText(item.start_date, item.end_date)}</Cell>
                  <Cell>{String(item.status || '').toUpperCase()}</Cell>
                  <ActionsCell>
                    <ActionButton type="button" onClick={() => history.push(`/crm/requests/${item.id}?${listQuery}`)}>VIEW</ActionButton>
                    <span>|</span>
                    <ActionButton type="button" onClick={() => { setPendingDelete({ type: 'request', id: item.id, code: item.code, label: item.title }); setShowDeleteConfirm(true) }}>DELETE</ActionButton>
                  </ActionsCell>
                </Row>
              ))}
              {pagedRequests.rows.length === 0 && (
                <Row $columns="0.8fr 1.2fr 1.4fr 0.8fr 1.2fr 0.8fr 1fr">
                  <EmptyCell>No requests yet.</EmptyCell>
                </Row>
              )}
            </Table>
          )}

          {loading && <Meta>Loading partners...</Meta>}
          {!!error && <Meta>{error}</Meta>}
          {!loading && activeTab === 'partnerships' && filteredPartnerships.length > 0 && (
            <PaginationBar>
              <Meta>Page {pagedPartnerships.safePage} / {pagedPartnerships.totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setPartnershipsPage(1)} disabled={pagedPartnerships.safePage <= 1}>FIRST</PaginationButton>
              <PaginationButton type="button" onClick={() => setPartnershipsPage((p) => Math.max(1, p - 1))} disabled={pagedPartnerships.safePage <= 1}>Prev</PaginationButton>
              <PaginationButton type="button" onClick={() => setPartnershipsPage((p) => Math.min(pagedPartnerships.totalPages, p + 1))} disabled={pagedPartnerships.safePage >= pagedPartnerships.totalPages}>Next</PaginationButton>
            </PaginationBar>
          )}

          {!loading && activeTab === 'requests' && (
            <PaginationBar>
              <Meta>Page {pagedRequests.safePage} / {pagedRequests.totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setRequestsPage(1)} disabled={pagedRequests.safePage <= 1}>FIRST</PaginationButton>
              <PaginationButton type="button" onClick={() => setRequestsPage((p) => Math.max(1, p - 1))} disabled={pagedRequests.safePage <= 1}>Prev</PaginationButton>
              <PaginationButton type="button" onClick={() => setRequestsPage((p) => Math.min(pagedRequests.totalPages, p + 1))} disabled={pagedRequests.safePage >= pagedRequests.totalPages}>Next</PaginationButton>
            </PaginationBar>
          )}
          </TabPanel>
        </Surface>
      )}

      {partnershipId && (
        <>
          <PageActions>
            {!isEditingPartnership && <PagePrimaryButton type="button" onClick={() => setIsEditingPartnership(true)}>EDIT</PagePrimaryButton>}
            {isEditingPartnership && <PagePrimaryButton type="button" onClick={savePartnership}>SAVE</PagePrimaryButton>}
            {isEditingPartnership && <PageSecondaryButton type="button" onClick={() => setIsEditingPartnership(false)}>CANCEL</PageSecondaryButton>}
            <PageSecondaryButton
              type="button"
              onClick={() => {
                if (!partnershipDetail) return
                setPendingDelete({ type: 'partnership', id: partnershipDetail.id, code: partnershipDetail.code, label: partnershipDetail.name })
                setShowDeleteConfirm(true)
              }}
            >
              DELETE
            </PageSecondaryButton>
          </PageActions>

          <Section>
            <SectionTitle>Details</SectionTitle>
            {detailLoading && <Meta>Loading partnership detail...</Meta>}
            {!!detailError && <ErrorText>{detailError}</ErrorText>}
            {!!partnershipDetail && (
              <Grid>
                <div><Label>Code</Label><Value>{partnershipDetail.code}</Value></div>
                <div>
                  <Label>Name</Label>
                  {!isEditingPartnership && <Value>{partnershipDetail.name}</Value>}
                  {isEditingPartnership && <Input value={editPartnership.name} onChange={(e) => setEditPartnership((p) => ({ ...p, name: e.target.value }))} />}
                </div>
                <div>
                  <Label>Status</Label>
                  {!isEditingPartnership && <Value>{String(partnershipDetail.status || '').toUpperCase()}</Value>}
                  {isEditingPartnership && (
                    <Select value={editPartnership.status} onChange={(e) => setEditPartnership((p) => ({ ...p, status: e.target.value }))}>
                      <option value="active">ACTIVE</option>
                      <option value="inactive">INACTIVE</option>
                      <option value="done">DONE</option>
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Contact Person</Label>
                  {!isEditingPartnership && <Value>{partnershipDetail.contact_person || '-'}</Value>}
                  {isEditingPartnership && <Input value={editPartnership.contact_person} onChange={(e) => setEditPartnership((p) => ({ ...p, contact_person: e.target.value }))} />}
                </div>
                <div>
                  <Label>Contact Number</Label>
                  {!isEditingPartnership && <Value>{partnershipDetail.contact_number || '-'}</Value>}
                  {isEditingPartnership && <Input value={editPartnership.contact_number} onChange={(e) => setEditPartnership((p) => ({ ...p, contact_number: e.target.value }))} />}
                </div>
                <div><Label>Date Range</Label><Value>{dateRangeText(partnershipDetail.start_date, partnershipDetail.end_date)}</Value></div>
                {isEditingPartnership && (
                  <>
                    <div><Label>Start Date</Label><Input type="date" value={editPartnership.start_date} onChange={(e) => setEditPartnership((p) => ({ ...p, start_date: e.target.value }))} /></div>
                    <div><Label>End Date</Label><Input type="date" value={editPartnership.end_date} onChange={(e) => setEditPartnership((p) => ({ ...p, end_date: e.target.value }))} /></div>
                  </>
                )}
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Notes</Label>
                  {!isEditingPartnership && <Value>{partnershipDetail.notes || '-'}</Value>}
                  {isEditingPartnership && <TextArea value={editPartnership.notes} onChange={(e) => setEditPartnership((p) => ({ ...p, notes: e.target.value }))} />}
                </div>
              </Grid>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Remittances</SectionTitle>
              <PagePrimaryButton type="button" onClick={() => setShowRemittanceModal(true)}>Add Remittance</PagePrimaryButton>
            </SectionHeader>
            <StatsGrid>
              <StatsCell>
                <StatsValue>{money(totalRemitted)}</StatsValue>
                <StatsLabel>Total Remitted</StatsLabel>
              </StatsCell>
              <StatsCell>
                <StatsValue>{(remittances || []).length}</StatsValue>
                <StatsLabel>Remittance Records</StatsLabel>
              </StatsCell>
            </StatsGrid>
            <Table>
              <Header $columns="1fr 1fr 2fr"><div>Date</div><div>Amount</div><div>Notes</div></Header>
              {pagedRemittances.rows.map((item) => (
                <Row key={item.id} $columns="1fr 1fr 2fr">
                  <Cell>{item.date}</Cell><Cell>{money(item.amount_php)}</Cell><Cell>{item.notes || '-'}</Cell>
                </Row>
              ))}
              {pagedRemittances.rows.length === 0 && (
                <Row $columns="1fr 1fr 2fr">
                  <EmptyCell>No remittances yet.</EmptyCell>
                </Row>
              )}
            </Table>
            {remittances.length > 0 && (
              <PaginationBar>
                <Meta>Page {pagedRemittances.safePage} / {pagedRemittances.totalPages}</Meta>
                <PaginationButton type="button" onClick={() => setRemittancesPage(1)} disabled={pagedRemittances.safePage <= 1}>FIRST</PaginationButton>
                <PaginationButton type="button" onClick={() => setRemittancesPage((p) => Math.max(1, p - 1))} disabled={pagedRemittances.safePage <= 1}>Prev</PaginationButton>
                <PaginationButton type="button" onClick={() => setRemittancesPage((p) => Math.min(pagedRemittances.totalPages, p + 1))} disabled={pagedRemittances.safePage >= pagedRemittances.totalPages}>Next</PaginationButton>
              </PaginationBar>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Request History</SectionTitle>
              <PagePrimaryButton type="button" onClick={() => openRequestModal(partnershipId)}>Add Request</PagePrimaryButton>
            </SectionHeader>
            <Table>
              <Header $columns="0.8fr 1.4fr 0.8fr 1.2fr 0.8fr 0.7fr"><div>Code</div><div>Request</div><div>Cost</div><div>Dates</div><div>Status</div><div>Action</div></Header>
              {pagedRequestHistory.rows.map((item) => (
                <Row key={item.id} $columns="0.8fr 1.4fr 0.8fr 1.2fr 0.8fr 0.7fr">
                  <Cell>{item.code}</Cell><Cell>{item.title}</Cell><Cell>{money(item.cost_php)}</Cell><Cell>{dateRangeText(item.start_date, item.end_date)}</Cell><Cell>{String(item.status || '').toUpperCase()}</Cell>
                  <ActionsCell><ActionButton type="button" onClick={() => history.push(`/crm/requests/${item.id}?${listQuery}`)}>VIEW</ActionButton></ActionsCell>
                </Row>
              ))}
              {pagedRequestHistory.rows.length === 0 && (
                <Row $columns="0.8fr 1.4fr 0.8fr 1.2fr 0.8fr 0.7fr">
                  <EmptyCell>No request history yet.</EmptyCell>
                </Row>
              )}
            </Table>
            <PaginationBar>
              <Meta>Page {pagedRequestHistory.safePage} / {pagedRequestHistory.totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setRequestHistoryPage(1)} disabled={pagedRequestHistory.safePage <= 1}>FIRST</PaginationButton>
              <PaginationButton type="button" onClick={() => setRequestHistoryPage((p) => Math.max(1, p - 1))} disabled={pagedRequestHistory.safePage <= 1}>Prev</PaginationButton>
              <PaginationButton type="button" onClick={() => setRequestHistoryPage((p) => Math.min(pagedRequestHistory.totalPages, p + 1))} disabled={pagedRequestHistory.safePage >= pagedRequestHistory.totalPages}>Next</PaginationButton>
            </PaginationBar>
          </Section>
        </>
      )}

      {requestId && (
        <>
          <PageActions>
            {!isEditingRequest && <PagePrimaryButton type="button" onClick={() => setIsEditingRequest(true)}>EDIT</PagePrimaryButton>}
            {isEditingRequest && <PagePrimaryButton type="button" onClick={saveRequest}>SAVE</PagePrimaryButton>}
            {isEditingRequest && <PageSecondaryButton type="button" onClick={() => setIsEditingRequest(false)}>CANCEL</PageSecondaryButton>}
            <PageSecondaryButton
              type="button"
              onClick={() => {
                if (!requestDetail) return
                setPendingDelete({ type: 'request', id: requestDetail.id, code: requestDetail.code, label: requestDetail.title })
                setShowDeleteConfirm(true)
              }}
            >
              DELETE
            </PageSecondaryButton>
          </PageActions>
          <Section>
            <SectionTitle>Details</SectionTitle>
            {detailLoading && <Meta>Loading request detail...</Meta>}
            {!!detailError && <ErrorText>{detailError}</ErrorText>}
            {!!requestDetail && (
              <Grid>
                <div><Label>Code</Label><Value>{requestDetail.code}</Value></div>
                <div>
                  <Label>Status</Label>
                  {!isEditingRequest && <Value>{String(requestDetail.status || '').toUpperCase()}</Value>}
                  {isEditingRequest && (
                    <Select value={editRequest.status} onChange={(e) => setEditRequest((p) => ({ ...p, status: e.target.value }))}>
                      <option value="open">OPEN</option>
                      <option value="outstanding">OUTSTANDING</option>
                      <option value="done">DONE</option>
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Partner</Label>
                  {!isEditingRequest && <Value>{requestDetail.partnership_name || '-'}</Value>}
                  {isEditingRequest && (
                    <Select value={editRequest.partnership_id} onChange={(e) => setEditRequest((p) => ({ ...p, partnership_id: e.target.value }))}>
                      <option value="">Unassigned</option>
                      {partnerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Cost</Label>
                  {!isEditingRequest && <Value>{money(requestDetail.cost_php)}</Value>}
                  {isEditingRequest && <Input type="number" min="0" step="0.01" value={editRequest.cost_php} onChange={(e) => setEditRequest((p) => ({ ...p, cost_php: e.target.value }))} />}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Request</Label>
                  {!isEditingRequest && <Value>{requestDetail.title}</Value>}
                  {isEditingRequest && <Input value={editRequest.title} onChange={(e) => setEditRequest((p) => ({ ...p, title: e.target.value }))} />}
                </div>
                <div><Label>Date Range</Label><Value>{dateRangeText(requestDetail.start_date, requestDetail.end_date)}</Value></div>
                <div><Label>Created At</Label><Value>{String(requestDetail.created_at || '').replace('T', ' ').slice(0, 16) || '-'}</Value></div>
                {isEditingRequest && (
                  <>
                    <div><Label>Start Date</Label><Input type="date" value={editRequest.start_date} onChange={(e) => setEditRequest((p) => ({ ...p, start_date: e.target.value }))} /></div>
                    <div><Label>End Date</Label><Input type="date" value={editRequest.end_date} onChange={(e) => setEditRequest((p) => ({ ...p, end_date: e.target.value }))} /></div>
                  </>
                )}
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Notes</Label>
                  {!isEditingRequest && <Value>{requestDetail.notes || '-'}</Value>}
                  {isEditingRequest && <TextArea value={editRequest.notes} onChange={(e) => setEditRequest((p) => ({ ...p, notes: e.target.value }))} />}
                </div>
              </Grid>
            )}
          </Section>
        </>
      )}

      <FormModal open={showPartnershipModal} title="Add Partnership" onClose={() => setShowPartnershipModal(false)} onConfirm={submitPartnership} confirmLabel="Add" closeControl="glyph">
        <Field><Label>Name</Label><Input value={partnershipForm.name} onChange={(e) => setPartnershipForm((p) => ({ ...p, name: e.target.value }))} /></Field>
        <Field><Label>Status</Label><Select value={partnershipForm.status} onChange={(e) => setPartnershipForm((p) => ({ ...p, status: e.target.value }))}><option value="active">ACTIVE</option><option value="inactive">INACTIVE</option><option value="done">DONE</option></Select></Field>
        <Field><Label>Contact Person</Label><Input value={partnershipForm.contact_person} onChange={(e) => setPartnershipForm((p) => ({ ...p, contact_person: e.target.value }))} /></Field>
        <Field><Label>Contact Number</Label><Input value={partnershipForm.contact_number} onChange={(e) => setPartnershipForm((p) => ({ ...p, contact_number: e.target.value }))} /></Field>
        <Field><Label>Start Date</Label><Input type="date" value={partnershipForm.start_date} onChange={(e) => setPartnershipForm((p) => ({ ...p, start_date: e.target.value }))} /></Field>
        <Field><Label>End Date</Label><Input type="date" value={partnershipForm.end_date} onChange={(e) => setPartnershipForm((p) => ({ ...p, end_date: e.target.value }))} /></Field>
        <Field><Label>Notes</Label><TextArea value={partnershipForm.notes} onChange={(e) => setPartnershipForm((p) => ({ ...p, notes: e.target.value }))} /></Field>
        {!!formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>

      <FormModal open={showRequestModal} title="Add Request" onClose={() => setShowRequestModal(false)} onConfirm={submitRequest} confirmLabel="Add" closeControl="glyph">
        <Field><Label>Partner</Label><Select value={requestForm.partnership_id} onChange={(e) => setRequestForm((p) => ({ ...p, partnership_id: e.target.value }))}><option value="">Unassigned</option>{partnerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
        <Field><Label>Request</Label><Input value={requestForm.title} onChange={(e) => setRequestForm((p) => ({ ...p, title: e.target.value }))} /></Field>
        <Field><Label>Status</Label><Select value={requestForm.status} onChange={(e) => setRequestForm((p) => ({ ...p, status: e.target.value }))}><option value="open">OPEN</option><option value="outstanding">OUTSTANDING</option><option value="done">DONE</option></Select></Field>
        <Field><Label>Cost</Label><Input type="number" min="0" step="0.01" value={requestForm.cost_php} onChange={(e) => setRequestForm((p) => ({ ...p, cost_php: e.target.value }))} /></Field>
        <Field><Label>Start Date</Label><Input type="date" value={requestForm.start_date} onChange={(e) => setRequestForm((p) => ({ ...p, start_date: e.target.value }))} /></Field>
        <Field><Label>End Date</Label><Input type="date" value={requestForm.end_date} onChange={(e) => setRequestForm((p) => ({ ...p, end_date: e.target.value }))} /></Field>
        <Field><Label>Notes</Label><TextArea value={requestForm.notes} onChange={(e) => setRequestForm((p) => ({ ...p, notes: e.target.value }))} /></Field>
        {!!formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>

      <FormModal open={showRemittanceModal} title="Add Remittance" onClose={() => setShowRemittanceModal(false)} onConfirm={submitRemittance} confirmLabel="Add" closeControl="glyph">
        <Field><Label>Date</Label><Input type="date" value={remittanceForm.date} onChange={(e) => setRemittanceForm((p) => ({ ...p, date: e.target.value }))} /></Field>
        <Field><Label>Amount</Label><Input type="number" min="0" step="0.01" value={remittanceForm.amount_php} onChange={(e) => setRemittanceForm((p) => ({ ...p, amount_php: e.target.value }))} /></Field>
        <Field><Label>Notes</Label><TextArea value={remittanceForm.notes} onChange={(e) => setRemittanceForm((p) => ({ ...p, notes: e.target.value }))} /></Field>
        {!!formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>

      <ConfirmActionModal
        open={showDeleteConfirm}
        title={pendingDelete && pendingDelete.type === 'partnership' ? 'Delete Partnership' : 'Delete Request'}
        description={pendingDelete ? `You are deleting: ${pendingDelete.label}` : ''}
        helperText="This action cannot be undone."
        helperVariant="danger"
        requiredText={pendingDelete ? pendingDelete.code : ''}
        requiredTextLabel="Type code to confirm"
        inputPlaceholder="Enter code"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </PageContent>
  )
}

export default CrmListPage
