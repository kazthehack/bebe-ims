import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ModalFrame from './ModalFrame'

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

const Button = styled.button`
  height: 38px;
  border: 1px solid ${({ $primary }) => ($primary ? '#25384c' : '#bec8d3')};
  background: ${({ $primary }) => ($primary ? '#25384c' : '#f0f3f6')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#41576d')};
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
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

const AddProductModal = ({ onClose, onCreateProduct }) => {
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [listPrice, setListPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (!sku.trim() || !name.trim()) {
      setError('SKU and Name are required.')
      return
    }
    try {
      await onCreateProduct({
        sku: sku.trim(),
        name: name.trim(),
        list_price: Number(listPrice || 0),
        image_url: imageUrl.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create product.')
    }
  }

  return (
    <ModalFrame title="Add Product" onClose={onClose}>
      <Label>SKU *<Input value={sku} onChange={(event) => setSku(event.target.value)} /></Label>
      <Label>Name *<Input value={name} onChange={(event) => setName(event.target.value)} /></Label>
      <Label>List Price (PHP)<Input type="number" value={listPrice} onChange={(event) => setListPrice(event.target.value)} /></Label>
      <Label>Image URL<Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} /></Label>
      {error && <ErrorMeta>{error}</ErrorMeta>}
      <div style={{ marginTop: 12 }}>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button $primary type="button" onClick={submit} style={{ marginLeft: 8 }}>Create</Button>
      </div>
    </ModalFrame>
  )
}

AddProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateProduct: PropTypes.func.isRequired,
}

export default AddProductModal
