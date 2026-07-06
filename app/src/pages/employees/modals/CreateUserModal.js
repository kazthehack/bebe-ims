import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'components/reusable/modals/FormModal'

const Label = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #4b6176;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const CheckboxLabel = styled.label`
  align-items: center;
  color: #4b6176;
  display: flex;
  font-size: 13px;
  gap: 8px;
  margin-top: 12px;
`

const ErrorMeta = styled.div`
  margin-top: 8px;
  color: #9f1f1f;
  background: #fdeaea;
  border: 1px solid #f3b7b7;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
`

const roles = ['admin', 'manager', 'user']

const CreateUserModal = ({
  open,
  form,
  formError,
  saving,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!open) return null

  return (
    <FormModal
      open={open}
      title="Create User"
      onClose={onClose}
      onConfirm={onSubmit}
      confirmLabel="Create"
      cancelLabel="Cancel"
      confirmDisabled={saving}
      width="480px"
      actionsAlign="right"
      closeControl="glyph"
    >
      <Label>
        Username *
        <Input value={form.username} onChange={event => onChange('username', event.target.value)} />
      </Label>
      <Label>
        Temporary password *
        <Input type="password" value={form.password} onChange={event => onChange('password', event.target.value)} />
      </Label>
      <Label>
        Role
        <Select value={form.role} onChange={event => onChange('role', event.target.value)}>
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </Select>
      </Label>
      <Label>
        Email
        <Input type="email" value={form.email} onChange={event => onChange('email', event.target.value)} />
      </Label>
      <Label>
        Employee name
        <Input value={form.displayName} onChange={event => onChange('displayName', event.target.value)} />
      </Label>
      <Label>
        Employee code
        <Input value={form.employeeCode} onChange={event => onChange('employeeCode', event.target.value)} />
      </Label>
      <CheckboxLabel>
        <input
          type="checkbox"
          checked={form.forcePasswordChange}
          onChange={event => onChange('forcePasswordChange', event.target.checked)}
        />
        Force password change
      </CheckboxLabel>
      {formError && <ErrorMeta>{formError}</ErrorMeta>}
    </FormModal>
  )
}

CreateUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    employeeCode: PropTypes.string.isRequired,
    forcePasswordChange: PropTypes.bool.isRequired,
  }).isRequired,
  formError: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default CreateUserModal
