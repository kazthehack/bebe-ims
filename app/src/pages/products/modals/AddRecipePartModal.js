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

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
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

const Hint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #5f6e7d;
`

const AddRecipePartModal = ({
  open,
  partId,
  newPartName,
  supplyId,
  supplyType,
  grams,
  quantity,
  printHours,
  partOptions,
  supplyOptions,
  selectedSupplyCostPerKilo,
  selectedSupplyCostPerPiece,
  formError,
  onChangePartId,
  onChangeNewPartName,
  onChangeSupplyId,
  onChangeQuantity,
  onChangeGrams,
  onChangePrintHours,
  onClose,
  onSubmit,
}) => {
  if (!open) return null

  return (
    <FormModal
      open={open}
      title="Add Recipe Part"
      onClose={onClose}
      onConfirm={onSubmit}
      confirmLabel="Create"
      cancelLabel="Cancel"
      width="480px"
      actionsAlign="right"
      closeControl="glyph"
    >
      {supplyType !== 'consumable' && (
        <>
          <Label>
            Part *
            <Select value={partId} onChange={event => onChangePartId(event.target.value)}>
              <option value="">Select part</option>
              {partOptions.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </Select>
          </Label>
          <Label>
            New Part Name (optional)
            <Input value={newPartName} onChange={event => onChangeNewPartName(event.target.value)} placeholder="Create if not in list" />
          </Label>
        </>
      )}
      <Label>
        Supply *
        <Select value={supplyId} onChange={event => onChangeSupplyId(event.target.value)}>
          <option value="">Select supply</option>
          {supplyOptions.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </Select>
      </Label>
      {supplyType === 'consumable' && (
        <Label>
          Quantity *
          <Input type="number" min="0" step="0.01" value={quantity} onChange={event => onChangeQuantity(event.target.value)} />
        </Label>
      )}
      {supplyType !== 'consumable' && (
        <Label>
          Grams *
          <Input type="number" min="0" step="0.01" value={grams} onChange={event => onChangeGrams(event.target.value)} />
        </Label>
      )}
      <Label>
        Print Hours (part)
        <Input type="number" min="0" step="0.01" value={printHours} onChange={event => onChangePrintHours(event.target.value)} />
      </Label>
      {supplyType === 'consumable' && <Hint>Cost per piece is sourced from Supplies: {selectedSupplyCostPerPiece}</Hint>}
      {supplyType !== 'consumable' && <Hint>Cost per kilo is sourced from Supplies: {selectedSupplyCostPerKilo}</Hint>}
      {formError && <ErrorMeta>{formError}</ErrorMeta>}
    </FormModal>
  )
}

AddRecipePartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  partId: PropTypes.string.isRequired,
  newPartName: PropTypes.string.isRequired,
  supplyId: PropTypes.string.isRequired,
  supplyType: PropTypes.string.isRequired,
  grams: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  printHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  partOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  supplyOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    supply_type: PropTypes.string,
  })).isRequired,
  selectedSupplyCostPerKilo: PropTypes.string.isRequired,
  selectedSupplyCostPerPiece: PropTypes.string.isRequired,
  formError: PropTypes.string.isRequired,
  onChangePartId: PropTypes.func.isRequired,
  onChangeNewPartName: PropTypes.func.isRequired,
  onChangeSupplyId: PropTypes.func.isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
  onChangeGrams: PropTypes.func.isRequired,
  onChangePrintHours: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default AddRecipePartModal
