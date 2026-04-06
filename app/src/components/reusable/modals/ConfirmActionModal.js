import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from './FormModal'

const Meta = styled.div`
  margin-top: 8px;
  color: ${({ $variant }) => ($variant === 'danger' ? '#8c2f2f' : '#5f6e7d')};
  font-size: 12px;
`

const Label = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 10px;
  font-size: 12px;
  color: #4b6176;
`

const PromptLine = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const ErrorText = styled.div`
  margin-top: 8px;
  color: #8c2f2f;
  font-size: 12px;
`

const ConfirmActionModal = ({
  open,
  title,
  description,
  helperText,
  helperVariant,
  requiredText,
  requiredTextLabel,
  inputPlaceholder,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
}) => {
  const [typedValue, setTypedValue] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const expectedValue = useMemo(() => String(requiredText || ''), [requiredText])
  const summaryText = useMemo(
    () => String(description || '').trim(),
    [description],
  )
  const isMatch = typedValue.trim() === expectedValue

  if (!open) return null

  const handleClose = () => {
    setTypedValue('')
    setError('')
    setSubmitting(false)
    onClose()
  }

  const handleConfirm = async () => {
    setError('')
    if (!isMatch) {
      setError(`Type the exact value to confirm: ${expectedValue}`)
      return
    }

    try {
      setSubmitting(true)
      await onConfirm()
      handleClose()
    } catch (err) {
      setError(err.message || 'Action failed.')
      setSubmitting(false)
    }
  }

  return (
    <FormModal
      open={open}
      title={title}
      onClose={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      width="460px"
      confirmDisabled={!isMatch || submitting}
      actionsAlign="right"
      closeControl="glyph"
    >
      {summaryText && <Meta>{summaryText}</Meta>}
      {helperText && <Meta $variant={helperVariant}>{helperText}</Meta>}
      <Label>
        <PromptLine>
          <span>{requiredTextLabel}:</span>
          <strong>{expectedValue}</strong>
        </PromptLine>
        <Input
          value={typedValue}
          onChange={(event) => setTypedValue(event.target.value)}
          placeholder={inputPlaceholder}
        />
      </Label>
      {error && <ErrorText>{error}</ErrorText>}
    </FormModal>
  )
}

ConfirmActionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  helperText: PropTypes.string,
  helperVariant: PropTypes.oneOf(['neutral', 'danger']),
  requiredText: PropTypes.string.isRequired,
  requiredTextLabel: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

ConfirmActionModal.defaultProps = {
  title: 'Confirm Action',
  description: '',
  helperText: '',
  helperVariant: 'neutral',
  requiredTextLabel: 'Type to confirm',
  inputPlaceholder: 'Type value',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
}

export default ConfirmActionModal
