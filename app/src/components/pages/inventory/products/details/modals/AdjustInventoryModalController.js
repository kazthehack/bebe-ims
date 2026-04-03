import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import { withModals, connectModal } from 'components/Modal'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormDatePicker } from 'components/common/input/DatePicker'
import colors from 'styles/colors'
import {
  combineValidators,
  required,
  naturalNumberValidator,
  nonZero,
} from 'utils/validators'
import { addManagedInventoryEventOptions } from 'constants/Report'
import { get } from 'lodash'
import withAdjustInventory from '../withAdjustInventory'

const styles = {
  button: {
    height: '56px',
  },
  footer: {
    height: '56px',
  },
}

const StyledFormGroup = styled.div`
  display: flex;
  margin-top: 0px;
  margin-bottom: 24px;
  align-items: center;
  width: 474px;
  label {
    flex: 3 0 30%;
    font-size: 16px;
    color: ${colors.grayDark2};
    max-width: 154px;
    display: inline-block;
  }
  :last-of-type {
    margin-bottom: 40px;
  }
`

const StyledInput = styled(FormTextField)`
  width: 320px;
`

const calcNewQuantityForAmount =
  (val, { adjustInventory: { modalCurrentQuantity, modalReport } }) =>
    (modalReport === 'LOSS' ? modalCurrentQuantity - Number(val) : modalCurrentQuantity + Number(val))

const validateFinalNotNegative = (val, values) => (
  (values.adjustInventory.modalReport === 'LOSS' && (values.adjustInventory.modalCurrentQuantity - Number(val) < 0)) ?
    'Final quantity must not be less than 0'
    :
    undefined
)


const ConnectedButtonModal = connectModal('AdjustInventoryModal')(ButtonModal)

const modalAmountValidator = values => combineValidators(
  required,
  naturalNumberValidator,
  nonZero,
  val => validateFinalNotNegative(val, values),
)

const AdjustInventoryModal = withAdjustInventory(({
  pushModal,
  popModal,
  values,
  form,
  errors: { adjustInventory },
  initialValues,
}) => (
  <Fragment>
    <Button primary onClick={() => pushModal('AdjustInventoryModal')}>Edit Inventory</Button>
    <ConnectedButtonModal
      title="Adjust inventory"
      header="Adjust inventory"
      primaryButton={
      { text: 'submit',
        disabled: !!(get(adjustInventory, 'modalAmount', false) ||
          validateFinalNotNegative(values.adjustInventory.modalAmount, values) ||
          get(adjustInventory, 'modalDate', false)
        ),
        onClick: () => {
          if (!(get(adjustInventory, 'modalAmount', false) ||
            validateFinalNotNegative(values.adjustInventory.modalAmount, values))) {
              form.change('queuedAdjustment', values.adjustInventory)
              popModal()
            } // Consider sending notification of validation error in else?
        } }}
      secondaryButton={
        { text: 'cancel',
        onClick: () => {
          popModal()
          if (values.queuedAdjustment) {
            form.change('adjustInventory', values.queuedAdjustment)
          } else {
            form.change('adjustInventory', initialValues.adjustInventory)
          }
        } }
      }
      contentStyle={{
        content: { marginTop: '24px', height: '352px', width: '490px' },
        header: { margin: '32px 40px 0 40px' },
    }}
      footerStyle={styles}
    >
      <Fragment>
        <StyledFormGroup>
          <label>Adjustment type</label>
          <FormSelectField
            name="adjustInventory.modalReport"
            options={addManagedInventoryEventOptions}
            onChange={() => {
              form.change('adjustInventory.modalNewQuantity', values.adjustInventory.modalCurrentQuantity)
              form.change('adjustInventory.modalAmount', undefined)
            }}
          />
        </StyledFormGroup>
        <StyledFormGroup>
          <label>Adjustment date</label>
          <FormDatePicker validate={required} style={{ width: '275px' }} name="adjustInventory.modalDate" view="date" />
        </StyledFormGroup>
        <StyledFormGroup>
          <label>Current quantity</label>
          <StyledInput disabled name="adjustInventory.modalCurrentQuantity" />
        </StyledFormGroup>
        <StyledFormGroup>
          <label>{values.adjustInventory.modalReport === 'RECEIVED' ? 'Quantity added' : 'Quantity lost'}</label>
          <FormTextField
            name="adjustInventory.modalAmount"
            placeholder="5"
            validate={modalAmountValidator(values)}
            onChange={e => form.change('adjustInventory.modalNewQuantity', calcNewQuantityForAmount(e.target.value, values))}
          />
        </StyledFormGroup>
        <StyledFormGroup>
          <label>New quantity</label>
          <StyledInput disabled name="adjustInventory.modalNewQuantity" />
        </StyledFormGroup>
      </Fragment>
    </ConnectedButtonModal>
  </Fragment>
))

AdjustInventoryModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
}

export default withModals(AdjustInventoryModal)
