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

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.8fr;
  gap: 8px;
  align-items: end;
  margin-top: 8px;
`

const FilamentHeader = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FilamentLabel = styled.div`
  font-size: 12px;
  color: #4b6176;
  font-weight: 700;
`

const FilamentControls = styled.div`
  display: flex;
  gap: 6px;
`

const RowButton = styled.button`
  height: 34px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
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
  mode,
  partInput,
  partPrintHours,
  partBatchYield,
  partCostPreview,
  filamentRows,
  consumableSupplyInput,
  consumableQuantity,
  partSuggestions,
  filamentSupplySuggestions,
  consumableSupplySuggestions,
  selectedSupplyCostHint,
  formError,
  onChangePartInput,
  onChangePartPrintHours,
  onChangePartBatchYield,
  onAddFilamentRow,
  onRemoveFilamentRow,
  onChangeFilamentRow,
  onChangeConsumableSupplyInput,
  onChangeConsumableQuantity,
  onClose,
  onSubmit,
}) => {
  if (!open) return null

  const isConsumable = String(mode || 'filament').toLowerCase() === 'consumable'

  return (
    <FormModal
      open={open}
      title={isConsumable ? 'Add Consumable' : 'Add Part'}
      onClose={onClose}
      onConfirm={onSubmit}
      confirmLabel={isConsumable ? 'Add' : 'Create'}
      cancelLabel="Cancel"
      width="640px"
      actionsAlign="right"
      closeControl="glyph"
    >
      {!isConsumable && (
        <>
          <Label>
            Part *
            <Select value={partInput} onChange={event => onChangePartInput(event.target.value)}>
              <option value="">Select part</option>
              {partSuggestions.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </Label>
          <Label>
            Part Print Hours *
            <Input
              type="number"
              min="0"
              step="0.01"
              value={partPrintHours}
              onChange={event => onChangePartPrintHours(event.target.value)}
            />
          </Label>
          <Label>
            Yield (Batch Units) *
            <Input
              type="number"
              min="1"
              step="1"
              value={partBatchYield}
              onChange={event => onChangePartBatchYield(event.target.value)}
            />
          </Label>
          <Hint>Part can contain multiple filament rows.</Hint>
          <FilamentHeader>
            <FilamentLabel>Filament</FilamentLabel>
            <FilamentControls>
              <RowButton type="button" onClick={onAddFilamentRow}>+</RowButton>
              <RowButton type="button" onClick={() => onRemoveFilamentRow(filamentRows.length - 1)} disabled={filamentRows.length <= 1}>-</RowButton>
            </FilamentControls>
          </FilamentHeader>
          {(filamentRows || []).map((row, index) => (
            <Row key={`filament-row-${index}`}>
              <Label>
                Filament *
                <Select value={row.supplyInput} onChange={event => onChangeFilamentRow(index, 'supplyInput', event.target.value)}>
                  <option value="">Select filament</option>
                  {filamentSupplySuggestions.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Select>
              </Label>
              <Label>
                Grams *
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.grams}
                  onChange={event => onChangeFilamentRow(index, 'grams', event.target.value)}
                />
              </Label>
            </Row>
          ))}
          <Label>
            Cost of Part (Auto)
            <Input value={partCostPreview} readOnly />
          </Label>
        </>
      )}

      {isConsumable && (
        <>
          <Label>
            Consumable *
            <Select value={consumableSupplyInput} onChange={event => onChangeConsumableSupplyInput(event.target.value)}>
              <option value="">Select consumable</option>
              {consumableSupplySuggestions.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </Label>
          <Label>
            Quantity *
            <Input
              type="number"
              min="0"
              step="0.01"
              value={consumableQuantity}
              onChange={event => onChangeConsumableQuantity(event.target.value)}
            />
          </Label>
        </>
      )}

      {selectedSupplyCostHint && <Hint>{selectedSupplyCostHint}</Hint>}
      {formError && <ErrorMeta>{formError}</ErrorMeta>}
    </FormModal>
  )
}

AddRecipePartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['filament', 'consumable']).isRequired,
  partInput: PropTypes.string.isRequired,
  partPrintHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  partBatchYield: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  partCostPreview: PropTypes.string.isRequired,
  filamentRows: PropTypes.arrayOf(PropTypes.shape({
    supplyInput: PropTypes.string.isRequired,
    grams: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
  consumableSupplyInput: PropTypes.string.isRequired,
  consumableQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  partSuggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  filamentSupplySuggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  consumableSupplySuggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  selectedSupplyCostHint: PropTypes.string,
  formError: PropTypes.string.isRequired,
  onChangePartInput: PropTypes.func.isRequired,
  onChangePartPrintHours: PropTypes.func.isRequired,
  onChangePartBatchYield: PropTypes.func.isRequired,
  onAddFilamentRow: PropTypes.func.isRequired,
  onRemoveFilamentRow: PropTypes.func.isRequired,
  onChangeFilamentRow: PropTypes.func.isRequired,
  onChangeConsumableSupplyInput: PropTypes.func.isRequired,
  onChangeConsumableQuantity: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

AddRecipePartModal.defaultProps = {
  selectedSupplyCostHint: '',
}

export default AddRecipePartModal
