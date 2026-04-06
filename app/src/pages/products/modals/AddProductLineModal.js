import React, { useState } from 'react'
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

const Textarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 70px;
  margin: 0;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
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

const AddProductLineModal = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  const submit = async () => {
    setError('')
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || null })
      setName('')
      setDescription('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create product line.')
    }
  }

  return (
    <FormModal
      open={open}
      title="Add Product Line"
      onClose={onClose}
      onConfirm={submit}
      confirmLabel="Create"
      cancelLabel="Cancel"
      width="460px"
      actionsAlign="right"
      closeControl="glyph"
    >
      <Meta>Product line is a collection of products grouped by theme.</Meta>
      <Label>Name *<Input value={name} onChange={event => setName(event.target.value)} placeholder="E.g. Keychains" /></Label>
      <Label>Description<Textarea value={description} onChange={event => setDescription(event.target.value)} /></Label>
      {error && <ErrorMeta>{error}</ErrorMeta>}
    </FormModal>
  )
}

AddProductLineModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default AddProductLineModal
