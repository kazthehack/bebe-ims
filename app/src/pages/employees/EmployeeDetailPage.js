import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import { PagePrimaryButton, PageSecondaryButton } from 'components/reusable/buttons/PageButtons'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { UserManagementApi } from 'api/userManagement'

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

  ${SectionTitle} {
    margin-bottom: 0;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
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
  overflow-wrap: anywhere;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
  width: 100%;
  box-sizing: border-box;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
  width: 100%;
  box-sizing: border-box;
`

const CheckboxRow = styled.label`
  color: #243648;
  font-size: 14px;
  font-weight: 600;
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Message = styled.div`
  margin-bottom: 8px;
  color: ${({ $error }) => ($error ? '#b42318' : '#2f6f4e')};
  font-size: 12px;
`

const AccessActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
`

const AccessPrimaryButton = styled(PagePrimaryButton)`
  height: 38px;
  min-width: 88px;
  padding: 0 12px;
`

const AccessSecondaryButton = styled(PageSecondaryButton)`
  height: 38px;
  min-width: 88px;
  padding: 0 12px;
`

const ModalField = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 10px;
  color: #4b6176;
  font-size: 12px;
`

const ModalInput = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const roles = ['admin', 'manager', 'user']

const defaultEmployeeForm = {
  display_name: '',
  legal_name: '',
  employee_code: '',
  email: '',
  phone: '',
  employment_status: 'active',
  site_ids: '',
  active: true,
}

const defaultPasswordForm = {
  password: '',
  force_password_change: true,
}

const defaultAccessForm = {
  role: 'user',
}

const normalizeEmployee = record => ({
  id: record.object_id,
  ...(record.payload || {}),
})

const display = value => (value === undefined || value === null || value === '' ? 'N/A' : value)
const formatBool = value => (value ? 'Yes' : 'No')
const formatSites = value => (Array.isArray(value) && value.length ? value.join(', ') : 'None')

const toEmployeeForm = employee => ({
  display_name: employee.display_name || '',
  legal_name: employee.legal_name || '',
  employee_code: employee.employee_code || '',
  email: employee.email || '',
  phone: employee.phone || '',
  employment_status: employee.employment_status || (employee.active === false ? 'inactive' : 'active'),
  site_ids: Array.isArray(employee.site_ids) ? employee.site_ids.join(', ') : '',
  active: employee.active !== false,
})

const EmployeeDetailPage = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [users, setUsers] = useState([])
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm)
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm)
  const [accessForm, setAccessForm] = useState(defaultAccessForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isAccessEditing, setIsAccessEditing] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadData = useCallback(() => {
    setLoading(true)
    setError('')
    return Promise.all([
      UserManagementApi.getEmployee(id),
      UserManagementApi.listUsers(),
    ])
      .then(([employeeResponse, userResponse]) => {
        const nextEmployee = normalizeEmployee(employeeResponse)
        setEmployee(nextEmployee)
        setEmployeeForm(toEmployeeForm(nextEmployee))
        setUsers(userResponse.users || [])
      })
      .catch(err => setError(err.message || 'Unable to load employee.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const linkedUser = useMemo(
    () => users.find(user => String(user.employee_id || '') === String(id)) || null,
    [users, id],
  )

  useEffect(() => {
    setAccessForm({ role: (linkedUser && linkedUser.role) || 'user' })
  }, [linkedUser])

  const updateEmployeeForm = key => event => {
    const { type, checked, value } = event.target
    setEmployeeForm(current => ({ ...current, [key]: type === 'checkbox' ? checked : value }))
  }

  const updateUser = (payload, successMessage) => {
    if (!linkedUser) return null
    setSaving(true)
    setMessage('')
    setError('')
    return UserManagementApi.updateUser(linkedUser.id, payload)
      .then(() => {
        setMessage(successMessage)
        return loadData()
      })
      .catch(err => setError(err.message || 'Unable to update user access.'))
      .finally(() => setSaving(false))
  }

  const saveUserAccess = () => {
    if (!linkedUser) return null
    return updateUser({ role: accessForm.role }, 'Role updated.')
      .then(() => setIsAccessEditing(false))
  }

  const cancelAccessEditing = () => {
    setAccessForm({ role: (linkedUser && linkedUser.role) || 'user' })
    setIsAccessEditing(false)
    setError('')
  }

  const saveEmployee = () => {
    setSaving(true)
    setMessage('')
    setError('')
    const payload = {
      display_name: employeeForm.display_name || null,
      legal_name: employeeForm.legal_name || null,
      employee_code: employeeForm.employee_code || null,
      email: employeeForm.email || null,
      phone: employeeForm.phone || null,
      employment_status: employeeForm.employment_status || 'active',
      site_ids: employeeForm.site_ids
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
      active: employeeForm.active,
    }
    return UserManagementApi.updateEmployee(id, payload)
      .then(() => {
        setMessage('Employee updated.')
        setIsEditing(false)
        return loadData()
      })
      .catch(err => setError(err.message || 'Unable to update employee.'))
      .finally(() => setSaving(false))
  }

  const submitPasswordReset = () => {
    if (!linkedUser || !passwordForm.password.trim()) {
      setError('Password is required.')
      return null
    }
    setSaving(true)
    setMessage('')
    setError('')
    return UserManagementApi.resetPassword(linkedUser.id, passwordForm)
      .then(() => {
        setMessage('Password reset.')
        setResetModalOpen(false)
        setPasswordForm(defaultPasswordForm)
        return loadData()
      })
      .catch(err => setError(err.message || 'Unable to reset password.'))
      .finally(() => setSaving(false))
  }

  const forcePasswordChange = () => {
    if (!linkedUser) return null
    setSaving(true)
    setMessage('')
    setError('')
    return UserManagementApi.forcePasswordChange(linkedUser.id, true)
      .then(() => {
        setMessage('Password change required on next login.')
        return loadData()
      })
      .catch(err => setError(err.message || 'Unable to force password change.'))
      .finally(() => setSaving(false))
  }

  const cancelEditing = () => {
    setEmployeeForm(toEmployeeForm(employee))
    setIsEditing(false)
    setError('')
  }

  const title = (
    <BreadcrumbTitle
      items={[
        { label: 'Employees', to: '/employees' },
        (employee && (employee.display_name || employee.legal_name || employee.employee_code || employee.id)) || 'Employee Detail',
      ]}
    />
  )

  return (
    <PageContent title={title}>
      <PageActions>
        {!isEditing && (
          <PagePrimaryButton type="button" onClick={() => setIsEditing(true)} disabled={loading || !employee}>
            EDIT
          </PagePrimaryButton>
        )}
        {isEditing && (
          <PagePrimaryButton type="button" onClick={saveEmployee} disabled={saving}>
            SAVE
          </PagePrimaryButton>
        )}
        {isEditing && (
          <PageSecondaryButton type="button" onClick={cancelEditing} disabled={saving}>
            CANCEL
          </PageSecondaryButton>
        )}
      </PageActions>

      {(error || message) && <Message $error={!!error}>{error || message}</Message>}
      {loading && <Section>Loading employee...</Section>}

      {!loading && employee && (
        <>
          <Section>
            <SectionTitle>Employee Information</SectionTitle>
            <Grid>
              <div>
                <Label>Display Name</Label>
                {isEditing ? (
                  <Input value={employeeForm.display_name} onChange={updateEmployeeForm('display_name')} />
                ) : (
                  <Value>{display(employee.display_name)}</Value>
                )}
              </div>
              <div>
                <Label>Legal Name</Label>
                {isEditing ? (
                  <Input value={employeeForm.legal_name} onChange={updateEmployeeForm('legal_name')} />
                ) : (
                  <Value>{display(employee.legal_name)}</Value>
                )}
              </div>
              <div>
                <Label>Employee Code</Label>
                {isEditing ? (
                  <Input value={employeeForm.employee_code} onChange={updateEmployeeForm('employee_code')} />
                ) : (
                  <Value>{display(employee.employee_code)}</Value>
                )}
              </div>
              <div>
                <Label>Employee ID</Label>
                <Value>{display(employee.id)}</Value>
              </div>
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input type="email" value={employeeForm.email} onChange={updateEmployeeForm('email')} />
                ) : (
                  <Value>{display(employee.email)}</Value>
                )}
              </div>
              <div>
                <Label>Phone</Label>
                {isEditing ? (
                  <Input value={employeeForm.phone} onChange={updateEmployeeForm('phone')} />
                ) : (
                  <Value>{display(employee.phone)}</Value>
                )}
              </div>
              <div>
                <Label>Employment Status</Label>
                {isEditing ? (
                  <Input value={employeeForm.employment_status} onChange={updateEmployeeForm('employment_status')} />
                ) : (
                  <Value>{display(employee.employment_status)}</Value>
                )}
              </div>
              <div>
                <Label>Sites</Label>
                {isEditing ? (
                  <Input value={employeeForm.site_ids} onChange={updateEmployeeForm('site_ids')} />
                ) : (
                  <Value>{formatSites(employee.site_ids)}</Value>
                )}
              </div>
              <div>
                <Label>Active</Label>
                {isEditing ? (
                  <CheckboxRow>
                    <input type="checkbox" checked={employeeForm.active} onChange={updateEmployeeForm('active')} />
                    Active employee
                  </CheckboxRow>
                ) : (
                  <Value>{formatBool(employee.active !== false)}</Value>
                )}
              </div>
            </Grid>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>User Access</SectionTitle>
              {linkedUser && (
                <AccessActions>
                  {!isAccessEditing && (
                    <AccessPrimaryButton type="button" onClick={() => setIsAccessEditing(true)} disabled={saving}>
                      EDIT
                    </AccessPrimaryButton>
                  )}
                  {isAccessEditing && (
                    <AccessPrimaryButton type="button" onClick={saveUserAccess} disabled={saving}>
                      SAVE
                    </AccessPrimaryButton>
                  )}
                  {isAccessEditing && (
                    <AccessSecondaryButton type="button" onClick={cancelAccessEditing} disabled={saving}>
                      CANCEL
                    </AccessSecondaryButton>
                  )}
                  {!isAccessEditing && (
                    <AccessPrimaryButton
                      type="button"
                      onClick={() => updateUser({ active: !linkedUser.active }, 'Status updated.')}
                      disabled={saving}
                    >
                      {linkedUser.active ? 'DEACTIVATE' : 'ACTIVATE'}
                    </AccessPrimaryButton>
                  )}
                  {!isAccessEditing && (
                    <AccessSecondaryButton type="button" onClick={() => setResetModalOpen(true)} disabled={saving}>
                      RESET PASSWORD
                    </AccessSecondaryButton>
                  )}
                  {!isAccessEditing && (
                    <AccessSecondaryButton
                      type="button"
                      onClick={forcePasswordChange}
                      disabled={saving}
                    >
                      FORCE CHANGE
                    </AccessSecondaryButton>
                  )}
                </AccessActions>
              )}
            </SectionHeader>
            {linkedUser ? (
              <>
                <Grid>
                  <div>
                    <Label>Username</Label>
                    <Value>{display(linkedUser.username)}</Value>
                  </div>
                  <div>
                    <Label>User Email</Label>
                    <Value>{display(linkedUser.email)}</Value>
                  </div>
                  <div>
                    <Label>Role</Label>
                    {isAccessEditing ? (
                      <Select
                        value={accessForm.role}
                        onChange={event => setAccessForm(current => ({ ...current, role: event.target.value }))}
                        disabled={saving}
                      >
                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                      </Select>
                    ) : (
                      <Value>{display(linkedUser.role)}</Value>
                    )}
                  </div>
                  <div>
                    <Label>User Status</Label>
                    <Value>{linkedUser.active ? 'Active' : 'Inactive'}</Value>
                  </div>
                  <div>
                    <Label>Password Change Required</Label>
                    <Value>{formatBool(linkedUser.force_password_change)}</Value>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <Value>{display(linkedUser.last_login_at)}</Value>
                  </div>
                </Grid>
              </>
            ) : (
              <Value>No system user is linked to this employee.</Value>
            )}
          </Section>
        </>
      )}

      <FormModal
        open={resetModalOpen}
        title="Reset Password"
        onClose={() => setResetModalOpen(false)}
        onConfirm={submitPasswordReset}
        confirmLabel="Reset"
        confirmDisabled={saving}
        closeControl="glyph"
      >
        <ModalField>
          New temporary password
          <ModalInput
            type="password"
            value={passwordForm.password}
            onChange={event => setPasswordForm(current => ({ ...current, password: event.target.value }))}
          />
        </ModalField>
        <CheckboxRow>
          <input
            type="checkbox"
            checked={passwordForm.force_password_change}
            onChange={event => setPasswordForm(current => ({ ...current, force_password_change: event.target.checked }))}
          />
          Force password change
        </CheckboxRow>
      </FormModal>
    </PageContent>
  )
}

export default EmployeeDetailPage
