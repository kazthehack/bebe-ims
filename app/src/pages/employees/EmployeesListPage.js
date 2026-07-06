import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import { PagePrimaryButton } from 'components/reusable/buttons/PageButtons'
import { UserManagementApi } from 'api/userManagement'
import CreateUserModal from './modals/CreateUserModal'

const PAGE_SIZE = 20
const STATUS_FILTER_OPTIONS = ['active', 'inactive']

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

const Header = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 0.8fr 1fr 0.7fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.button`
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 0.8fr 1fr 0.7fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
  cursor: pointer;
  width: 100%;
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

const Message = styled.div`
  color: ${({ $error }) => ($error ? '#b3261e' : '#2f6f4e')};
  font-size: 13px;
  min-height: 18px;
  margin-bottom: 10px;
`

const defaultForm = {
  username: '',
  password: '',
  role: 'user',
  email: '',
  displayName: '',
  employeeCode: '',
  forcePasswordChange: true,
}

const normalizeEmployee = record => ({
  id: record.object_id,
  ...(record.payload || {}),
})

const normalizeSearch = value => String(value || '').trim().toLowerCase()
const parseMultiFilter = (rawValue, allowedValues) => {
  if (rawValue == null || rawValue === 'all') return [...allowedValues]
  if (String(rawValue) === '__none__') return []
  const allowed = new Set(allowedValues)
  const parsed = String(rawValue)
    .split(',')
    .map(value => value.trim())
    .filter(value => allowed.has(value))
  return parsed.length ? parsed : [...allowedValues]
}

const EmployeesListPage = () => {
  const history = useHistory()
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState(defaultForm)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const loadEmployees = useCallback(() => {
    setLoading(true)
    setError('')
    return UserManagementApi.listEmployees()
      .then(employeeResponse => setEmployees((employeeResponse || []).map(normalizeEmployee)))
      .catch(err => setError(err.message || 'Unable to load employees.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const filteredEmployees = useMemo(() => {
    const term = normalizeSearch(search)
    const selectedStatuses = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
    return employees.filter((employee) => {
      const status = employee.active === false ? 'inactive' : 'active'
      if (!selectedStatuses.includes(status)) return false
      if (!term) return true
      const haystack = [
        employee.display_name,
        employee.legal_name,
        employee.employee_code,
        employee.email,
        employee.phone,
        ...(employee.site_ids || []),
      ].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, [employees, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedEmployees = filteredEmployees.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setForm(defaultForm)
    setFormError('')
  }

  const createUser = () => {
    setFormError('')
    setMessage('')
    setError('')

    if (!form.username.trim() || !form.password.trim()) {
      setFormError('Username and temporary password are required.')
      return null
    }

    setSaving(true)
    return UserManagementApi.createUser({
      username: form.username,
      password: form.password,
      role: form.role,
      email: form.email || null,
      force_password_change: form.forcePasswordChange,
      employee: {
        display_name: form.displayName || form.username,
        email: form.email || null,
        employee_code: form.employeeCode || null,
      },
    })
      .then((createdUser) => {
        setMessage('User created.')
        closeCreateModal()
        return loadEmployees().then(() => {
          if (createdUser && createdUser.employee_id) {
            history.push(`/employees/${createdUser.employee_id}`)
          }
        })
      })
      .catch(err => setFormError(err.message || 'Unable to create user.'))
      .finally(() => setSaving(false))
  }

  return (
    <PageContent title="Employees">
      <Message $error={!!error}>{error || message}</Message>
      <Surface>
        <Toolbar>
          <ListFiltersRow
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search employees"
            filters={[
              {
                key: 'employee-status',
                type: 'multi-checkbox',
                label: 'Status',
                title: 'Status',
                selectedValues: parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS),
                onToggle: (value) => {
                  const current = parseMultiFilter(statusFilter, STATUS_FILTER_OPTIONS)
                  const has = current.includes(value)
                  const next = has ? current.filter(item => item !== value) : [...current, value]
                  setStatusFilter(next.length ? next.join(',') : '__none__')
                },
                onChangeSelected: nextSelected => setStatusFilter(nextSelected.length ? nextSelected.join(',') : '__none__'),
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ],
              },
            ]}
            right={(
              <PagePrimaryButton type="button" onClick={() => setShowCreateModal(true)}>
                Create User
              </PagePrimaryButton>
            )}
          />
        </Toolbar>

        <Table>
          <Header>
            <Cell>Employee</Cell>
            <Cell>Contact</Cell>
            <Cell>Status</Cell>
            <Cell>Sites</Cell>
            <Cell>Actions</Cell>
          </Header>

          {!loading && pagedEmployees.map(employee => (
            <Row key={employee.id} type="button" onClick={() => history.push(`/employees/${employee.id}`)}>
              <Cell>
                {employee.display_name || employee.legal_name || employee.id}
                <Meta>{employee.employee_code || employee.id}</Meta>
              </Cell>
              <Cell>
                {employee.email || 'No email'}
                <Meta>{employee.phone || 'No phone'}</Meta>
              </Cell>
              <Cell>{employee.active === false ? 'Inactive' : 'Active'}</Cell>
              <Cell>{Array.isArray(employee.site_ids) && employee.site_ids.length ? employee.site_ids.join(', ') : 'None'}</Cell>
              <ActionCell>VIEW</ActionCell>
            </Row>
          ))}
        </Table>
        {loading && <Meta>Loading employees...</Meta>}
        {!loading && filteredEmployees.length === 0 && <Meta>No employees found.</Meta>}
        {error && <Meta>{error}</Meta>}
        {!loading && filteredEmployees.length > 0 && (
          <PaginationBar>
            <Meta>Page {safePage} / {totalPages}</Meta>
            <PaginationButton type="button" onClick={() => setPage(1)} disabled={safePage <= 1}>
              FIRST
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={safePage <= 1}>
              Prev
            </PaginationButton>
            <PaginationButton type="button" onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages}>
              Next
            </PaginationButton>
          </PaginationBar>
        )}
      </Surface>

      <CreateUserModal
        open={showCreateModal}
        form={form}
        formError={formError}
        saving={saving}
        onChange={updateForm}
        onClose={closeCreateModal}
        onSubmit={createUser}
      />
    </PageContent>
  )
}

export default EmployeesListPage
