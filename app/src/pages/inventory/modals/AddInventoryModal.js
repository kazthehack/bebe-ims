import React, { useMemo, useState } from 'react'
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

const Select = styled.select`
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

const ErrorMeta = styled.div`
  margin-top: 8px;
  color: #9f1f1f;
  background: #fdeaea;
  border: 1px solid #f3b7b7;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
`

const AddInventoryModal = ({ onClose, onCreateInventory, variantsByProductId }) => {
  const [variantId, setVariantId] = useState('')
  const [siteId, setSiteId] = useState('site1')
  const [qtyOnHand, setQtyOnHand] = useState('')
  const [qtyReserved, setQtyReserved] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState('')
  const [error, setError] = useState('')

  const variants = useMemo(() => Object.values(variantsByProductId || {}).flat(), [variantsByProductId])

  const submit = async () => {
    setError('')
    if (!variantId.trim() || !siteId.trim()) {
      setError('Product Variant ID and Site ID are required.')
      return
    }
    try {
      await onCreateInventory({
        product_variant_id: variantId,
        site_id: siteId.trim(),
        qty_on_hand: Number(qtyOnHand || 0),
        qty_reserved: Number(qtyReserved || 0),
        low_stock_threshold: Number(lowStockThreshold || 0),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create inventory.')
    }
  }

  return (
    <ModalFrame title="Add Inventory" onClose={onClose}>
      <Label>
        Product Variant ID *
        {variants.length > 0 ? (
          <Select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
            <option value="">Select variant</option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.sku} ({variant.id})
              </option>
            ))}
          </Select>
        ) : (
          <Input value={variantId} onChange={(event) => setVariantId(event.target.value)} placeholder="var-..." />
        )}
      </Label>
      <Label>Site ID *<Input value={siteId} onChange={(event) => setSiteId(event.target.value)} /></Label>
      <Label>Qty On Hand<Input type="number" value={qtyOnHand} onChange={(event) => setQtyOnHand(event.target.value)} /></Label>
      <Label>Qty Reserved<Input type="number" value={qtyReserved} onChange={(event) => setQtyReserved(event.target.value)} /></Label>
      <Label>Low Stock Threshold<Input type="number" value={lowStockThreshold} onChange={(event) => setLowStockThreshold(event.target.value)} /></Label>
      {error && <ErrorMeta>{error}</ErrorMeta>}
      <div style={{ marginTop: 12 }}>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button $primary type="button" onClick={submit} style={{ marginLeft: 8 }}>Create</Button>
      </div>
    </ModalFrame>
  )
}

AddInventoryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateInventory: PropTypes.func.isRequired,
  variantsByProductId: PropTypes.object.isRequired,
}

export default AddInventoryModal
