//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AuthApi } from 'api/client'
import { changePassword, getTenantId } from 'api/imsBridge'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const PrimaryButton = styled.button`
  height: 34px;
  border: 1px solid #25384c;
  background: #25384c;
  color: #fff;
  border-radius: 4px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`

const SecondaryButton = styled.button`
  height: 34px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
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

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

const FullWidth = styled.div`
  grid-column: 1 / -1;
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
  max-width: 100%;
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

const ErrorText = styled.div`
  margin-bottom: 8px;
  color: #b42318;
  font-size: 12px;
`

const SuccessText = styled.div`
  margin-bottom: 8px;
  color: #2f6f4e;
  font-size: 12px;
`

const EmptyText = styled.div`
  color: #607589;
  font-size: 13px;
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

const PermissionTable = styled.div`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  overflow: hidden;
`

const PermissionHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) repeat(4, 48px);
  background: #f0f3f6;
  color: #4f6278;
  font-size: 12px;
  font-weight: 700;
`

const PermissionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) repeat(4, 48px);
  border-top: 1px solid #d7e0ec;
  color: #243648;
  font-size: 13px;
`

const PermissionCell = styled.div`
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};
  padding: 0 10px;
`

const PermissionDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $status }) => {
    if ($status === 'granted') return '#2f9e44'
    if ($status === 'prohibited') return '#d92d20'
    return '#f2c94c'
  }};
  display: inline-block;
`

const OtherPermissions = styled.div`
  color: #607589;
  font-size: 12px;
  margin-top: 8px;
`

const formatList = value => (Array.isArray(value) && value.length ? value.join(', ') : 'None')
const formatBool = value => (value ? 'Yes' : 'No')
const display = value => (value === undefined || value === null || value === '' ? 'N/A' : value)
const CRUD_ACTIONS = ['create', 'read', 'update', 'delete']
const CRUD_PERMISSION_ACTIONS_BY_SCOPE = {
  events: ['create', 'read', 'update', 'delete'],
  inventory: ['create', 'read', 'update', 'delete'],
  partnerships: ['create', 'read', 'update', 'delete'],
  products: ['create', 'read', 'update', 'delete'],
  receipts: ['create', 'read'],
  sites: ['create', 'read', 'update', 'delete'],
  users: ['create', 'read', 'update', 'delete'],
}

const defaultEditForm = {
  email: '',
  display_name: '',
  legal_name: '',
  employee_code: '',
  employee_email: '',
  phone: '',
  active: true,
}

const defaultPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const detailValue = (isEditing, value, input) => (isEditing ? input : <Value>{display(value)}</Value>)

const humanizePermissionScope = value => String(value || '')
  .split('_')
  .map(part => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
  .join(' ')

const buildPermissionMatrix = (permissions = []) => {
  const rowsByScope = {}
  const other = []

  permissions.forEach((permission) => {
    const [scope, action] = String(permission).split(':')
    if (scope && CRUD_ACTIONS.includes(action)) {
      rowsByScope[scope] = rowsByScope[scope] || {
        scope,
        create: false,
        read: false,
        update: false,
        delete: false,
      }
      rowsByScope[scope][action] = true
      return
    }
    other.push(permission)
  })

  return {
    rows: Object.values(rowsByScope).sort((left, right) => left.scope.localeCompare(right.scope)),
    other,
  }
}

const PermissionsGrid = ({ permissions }) => {
  const { rows, other } = buildPermissionMatrix(permissions)

  if (!rows.length && !other.length) {
    return <Value>None</Value>
  }

  return (
    <div>
      {rows.length > 0 && (
        <PermissionTable>
          <PermissionHeader>
            <PermissionCell>Permission</PermissionCell>
            <PermissionCell $center>C</PermissionCell>
            <PermissionCell $center>R</PermissionCell>
            <PermissionCell $center>U</PermissionCell>
            <PermissionCell $center>D</PermissionCell>
          </PermissionHeader>
          {rows.map(row => (
            <PermissionRow key={row.scope}>
              <PermissionCell>{humanizePermissionScope(row.scope)}</PermissionCell>
              {CRUD_ACTIONS.map((action) => {
                const isApplicable = (CRUD_PERMISSION_ACTIONS_BY_SCOPE[row.scope] || CRUD_ACTIONS).includes(action)
                const status = row[action] ? 'granted' : isApplicable ? 'prohibited' : 'not-applicable'
                return (
                  <PermissionCell key={action} $center title={status}>
                    <PermissionDot $status={status} />
                  </PermissionCell>
                )
              })}
            </PermissionRow>
          ))}
        </PermissionTable>
      )}
      {other.length > 0 && (
        <OtherPermissions>
          Other: {other.join(', ')}
        </OtherPermissions>
      )}
    </div>
  )
}

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [editForm, setEditForm] = useState(defaultEditForm)
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const hydrateEditForm = (nextProfile) => {
    const employee = nextProfile && nextProfile.employee
    setEditForm({
      email: (nextProfile && nextProfile.email) || '',
      display_name: (employee && employee.display_name) || '',
      legal_name: (employee && employee.legal_name) || '',
      employee_code: (employee && employee.employee_code) || '',
      employee_email: (employee && employee.email) || '',
      phone: (employee && employee.phone) || '',
      active: employee ? employee.active !== false : true,
    })
  }

  const loadProfile = () => {
    setLoading(true)
    setError('')
    return AuthApi.me(getTenantId())
      .then((nextProfile) => {
        setProfile(nextProfile)
        hydrateEditForm(nextProfile)
      })
      .catch(err => setError(err.message || 'Unable to load profile.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const updateEditField = key => event => {
    const { type, checked, value } = event.target
    setEditForm(current => ({ ...current, [key]: type === 'checkbox' ? checked : value }))
  }

  const updatePasswordField = key => event => {
    setPasswordForm(current => ({ ...current, [key]: event.target.value }))
  }

  const startEditing = () => {
    hydrateEditForm(profile)
    setMessage('')
    setError('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    hydrateEditForm(profile)
    setError('')
    setIsEditing(false)
  }

  const saveProfile = () => {
    setSaving(true)
    setMessage('')
    setError('')
    return AuthApi.updateMe(getTenantId(), editForm)
      .then((nextProfile) => {
        setProfile(nextProfile)
        hydrateEditForm(nextProfile)
        setMessage('Profile updated.')
        setIsEditing(false)
      })
      .catch(err => setError(err.message || 'Unable to update profile.'))
      .finally(() => setSaving(false))
  }

  const closePasswordModal = () => {
    setPasswordModalOpen(false)
    setPasswordForm(defaultPasswordForm)
  }

  const submitPassword = () => {
    setMessage('')
    setError('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.')
      return null
    }

    setSavingPassword(true)
    return changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
      .then(() => {
        setMessage('Password changed.')
        closePasswordModal()
        return loadProfile()
      })
      .catch(err => setError(err.message || 'Unable to change password.'))
      .finally(() => setSavingPassword(false))
  }

  const employee = profile && profile.employee

  return (
    <PageContent title="Profile">
      <PageActions>
        <SecondaryButton type="button" onClick={() => setPasswordModalOpen(true)}>
          CHANGE PASSWORD
        </SecondaryButton>
        {!isEditing && (
          <PrimaryButton type="button" onClick={startEditing} disabled={loading || !profile}>
            EDIT
          </PrimaryButton>
        )}
        {isEditing && (
          <PrimaryButton type="button" onClick={saveProfile} disabled={saving}>
            SAVE
          </PrimaryButton>
        )}
        {isEditing && (
          <SecondaryButton type="button" onClick={cancelEditing} disabled={saving}>
            CANCEL
          </SecondaryButton>
        )}
      </PageActions>

      {error && <ErrorText>{error}</ErrorText>}
      {message && <SuccessText>{message}</SuccessText>}
      {loading && <Section>Loading profile...</Section>}
      {!loading && profile && (
        <>
          <Section>
            <SectionTitle>User Account</SectionTitle>
            <Grid>
              <div>
                <Label>Username</Label>
                <Value>{display(profile.username)}</Value>
              </div>
              <div>
                <Label>Email</Label>
                {detailValue(isEditing, profile.email, (
                  <Input value={editForm.email} onChange={updateEditField('email')} />
                ))}
              </div>
              <div>
                <Label>Role</Label>
                <Value>{display(profile.role)}</Value>
              </div>
              <div>
                <Label>User ID</Label>
                <Value>{display(profile.user_id)}</Value>
              </div>
              <div>
                <Label>Tenant</Label>
                <Value>{display(profile.tenant_id)}</Value>
              </div>
              <div>
                <Label>Store</Label>
                <Value>{display(profile.store_id)}</Value>
              </div>
              <div>
                <Label>Password Change Required</Label>
                <Value>{formatBool(profile.force_password_change)}</Value>
              </div>
              <FullWidth>
                <Label>Permissions</Label>
                <PermissionsGrid permissions={profile.permissions} />
              </FullWidth>
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Employee Information</SectionTitle>
            {employee ? (
              <Grid>
                <div>
                  <Label>Name</Label>
                  {detailValue(isEditing, employee.display_name, (
                    <Input value={editForm.display_name} onChange={updateEditField('display_name')} />
                  ))}
                </div>
                <div>
                  <Label>Legal Name</Label>
                  {detailValue(isEditing, employee.legal_name, (
                    <Input value={editForm.legal_name} onChange={updateEditField('legal_name')} />
                  ))}
                </div>
                <div>
                  <Label>Employee Code</Label>
                  {detailValue(isEditing, employee.employee_code, (
                    <Input value={editForm.employee_code} onChange={updateEditField('employee_code')} />
                  ))}
                </div>
                <div>
                  <Label>Employee ID</Label>
                  <Value>{display(employee.id || profile.employee_id)}</Value>
                </div>
                <div>
                  <Label>Email</Label>
                  {detailValue(isEditing, employee.email, (
                    <Input value={editForm.employee_email} onChange={updateEditField('employee_email')} />
                  ))}
                </div>
                <div>
                  <Label>Phone</Label>
                  {detailValue(isEditing, employee.phone, (
                    <Input value={editForm.phone} onChange={updateEditField('phone')} />
                  ))}
                </div>
                <div>
                  <Label>Active</Label>
                  {isEditing ? (
                    <CheckboxRow>
                      <input type="checkbox" checked={editForm.active} onChange={updateEditField('active')} />
                      Active employee
                    </CheckboxRow>
                  ) : (
                    <Value>{formatBool(employee.active)}</Value>
                  )}
                </div>
                <div>
                  <Label>Sites</Label>
                  <Value>{formatList(employee.site_ids)}</Value>
                </div>
              </Grid>
            ) : (
              <EmptyText>No employee record is linked to this user.</EmptyText>
            )}
          </Section>
        </>
      )}

      <FormModal
        open={passwordModalOpen}
        title="Change Password"
        onClose={closePasswordModal}
        onConfirm={submitPassword}
        confirmLabel="Change Password"
        confirmDisabled={savingPassword}
      >
        <ModalField>
          Current password
          <ModalInput
            type="password"
            value={passwordForm.currentPassword}
            onChange={updatePasswordField('currentPassword')}
          />
        </ModalField>
        <ModalField>
          New password
          <ModalInput
            type="password"
            value={passwordForm.newPassword}
            onChange={updatePasswordField('newPassword')}
          />
        </ModalField>
        <ModalField>
          Confirm new password
          <ModalInput
            type="password"
            value={passwordForm.confirmPassword}
            onChange={updatePasswordField('confirmPassword')}
          />
        </ModalField>
      </FormModal>
    </PageContent>
  )
}

export default UserProfilePage
