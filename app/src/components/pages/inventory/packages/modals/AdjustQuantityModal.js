import React, { Fragment, useEffect, useState } from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import ReactGA from 'react-ga'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { focusOnError } from 'components/common/form/decorators'
import { withModals, connectModal, withConfirm } from 'components/Modal'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormDatePicker } from 'components/common/input/DatePicker'
import { FormTextArea } from 'components/common/input/TextArea'
import colors from 'styles/colors'
import {
  combineValidators,
  required,
  naturalNumberValidator,
  greaterThanOrEqualTo0,
  maxDecimalPlaces,
  positiveNumberValidator,
  sanitizedStringValidator,
  futureDateValidator,
  notBeforeYear2000,
  cannotBe,
} from 'utils/validators'
import reportOptions from 'constants/Report'
import { pick, isEmpty, set, get } from 'lodash'
import { Form } from 'react-final-form'
import { genericDervivedFieldError } from 'utils/mapErrorMessage'
import { withVenueSettings } from 'components/Venue'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { Tooltip, TooltipWithIcon } from 'components/common/display/Tooltip'
import { FormCheckbox } from 'components/common/input/Checkbox'

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
  label {
    flex: 3 0 30%;
    color: ${colors.grayDark2};
    max-width: 8.5rem;
    display: inline-block;
  }
  :last-of-type {
    margin-bottom: 40px;
  }
`

const StyledFormCheckbox = styled(FormCheckbox)`
  margin-bottom: 13px;
  margin-top: -20px;
  margin-right: 7px;
  left: 333px;
`

const StyledInput = styled(FormTextField)`
  width: 320px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
`

const StyledTitle = styled.div`
  margin: 0px;
  padding: 0px;
`

const labelStyle = {
  position: 'relative',
  left: '333px',
  marginTop: '-20px',
}

const calcNewQuantityForAmount =
  (val, newQuantity, report) => {
    const result = (report === 'loss' ? newQuantity - Number(val) : Number(newQuantity) + Number(val))
    if (Number.isNaN(result)) return genericDervivedFieldError
    return result.toFixed(4)
  }

const calcNewQuantityForReport =
  (val, { quantity, adjustmentAmount }) => {
    const result = (val === 'loss' ? quantity - Number(adjustmentAmount) : Number(quantity) + Number(adjustmentAmount))
    if (Number.isNaN(result)) return genericDervivedFieldError
    return result.toFixed(2)
  }

const resetAdjustQuantityModalForm = (form, initialValues) => form.batch(() => {
  form.change('report', initialValues.report)
  form.change('date', initialValues.date)
  form.change('reason', initialValues.reason)
  form.change('quantity', initialValues.quantity)
  form.change('adjustmentAmount', initialValues.adjustmentAmount)
  form.change('unit', initialValues.unit)
  form.change('newQuantity', initialValues.newQuantity)
  form.change('note', initialValues.note)
})

const reasonValidator = combineValidators(
  required,
  cannotBe('Select a reason', 'You must select an adjustment reason'),
)

const ConnectedButtonModal = connectModal('AdjustQuantityModal')(ButtonModal)

const mapInitialValues = initialValues => ({
  ...initialValues,
  newQuantity: initialValues.quantity,
})

const AdjustQuantityModal = ({
  pushModal,
  popModal,
  onSubmitAdjustPackage,
  reasons,
  initialValues,
  confirm,
  disabled,
  metrcReadOnly,
  ...props
}) => {
  const timeZone = get(props, 'venueSettings.store.timezone')
  const [adjustToZero, setAdjustToZero] = useState(false)
  return (
    <Form
      onSubmit={onSubmitAdjustPackage}
      initialValues={mapInitialValues(initialValues)}
      decorators={[focusOnError]}
      render={({ handleSubmit, values, submitting, pristine, form, errors }) => {
        useEffect(() => () => {
            resetAdjustQuantityModalForm(form, initialValues)
            setAdjustToZero(false)
          }, [initialValues])
        return (
          <Fragment>
            {metrcReadOnly && <Button primary disabled>Adjust Quantity</Button>}

            {!metrcReadOnly &&
              <Tooltip text="This package has already been finished and can no longer be adjusted. To make changes, please log in to Metrc and un-finish the package there." disabled={!disabled}>
                <Button disabled={disabled} primary type="button" onClick={() => pushModal('AdjustQuantityModal')}>Adjust Quantity</Button>
              </Tooltip>
            }
            <ConnectedButtonModal
              title="Adjust Quantity"
              header={
                <StyledHeader>
                  <StyledTitle>
                    Adjust Quantity
                  </StyledTitle>
                  <TooltipWithIcon text="Metrc occasionally rounds amounts differently, there may be a minor difference in quantity until Bloom resyncs after an adjustment is made." />
                </StyledHeader>
              }
              primaryButton={{
                onClick: () => {
                  handleSubmit(pick(values, 'packageId', 'adjustmentAmount', 'report', 'reason', 'note', 'date'))
                  if (isEmpty(errors)) {
                    popModal()
                    set(initialValues, 'newQuantity', values.newQuantity)
                    set(initialValues, 'quantity', values.newQuantity)
                    ReactGA.event({
                      category: GATypes.eventCategories.packageAdjustQuantity,
                      action: GATypes.eventActions.adjusted,
                      label: values.newQuantity,
                    })
                  }
                },
                text: 'confirm',
                disabled: submitting || pristine,
              }}
              secondaryButton={{
                text: 'cancel',
                onClick: () => {
                  // Set all r
                  if (!pristine) {
                    confirm({
                      message: 'Are you sure you want to discard your changes',
                    }).then((confirmed) => {
                      if (confirmed) {
                        popModal()
                      }
                    })
                  } else popModal()
                },
              }}
              footerStyle={styles}
            >
              <Fragment>
                <StyledFormGroup>
                  <label>Report</label>
                  <FormSelectField
                    name="report"
                    options={reportOptions}
                    onChange={(e) => {
                      // this IF is here to prevent Invalid from showing
                      // immediately after the user just changes the report type
                      if (values.adjustmentAmount) {
                        form.change('newQuantity', calcNewQuantityForReport(e.target.value, values))
                        form.blur('newQuantity')
                      }
                    }}
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>Date</label>
                  <FormDatePicker
                    validate={
                      combineValidators(
                        required,
                        futureDateValidator(timeZone),
                        notBeforeYear2000(timeZone),
                      )
                    }
                    style={{ width: '275px' }}
                    name="date"
                    suffix={<ProductIcon type="calendar" />}
                    errorText
                    fieldContainerStyle={{
                      position: 'relative',
                    }}
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>Reason</label>
                  <FormSelectField
                    name="reason"
                    placeholder="None"
                    options={reasons.map(reason => ({ name: reason, value: reason }))}
                    validate={reasonValidator}
                    fieldContainerStyle={{
                      position: 'relative',
                    }}
                    errorText
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>Current quantity</label>
                  <StyledInput
                    disabled
                    value={parseFloat(values.quantity).toFixed(4)}
                    name="quantity"
                    suffix={values.unit === 'EACH' ? 'ea' : 'g'}
                  />
                </StyledFormGroup>
                { !adjustToZero &&
                  <StyledFormGroup>
                    <label>{values.report === 'gain' ? 'Amount gained' : 'Amount lost'}</label>
                    <StyledInput
                      name="adjustmentAmount"
                      placeholder="5"
                      fieldContainerStyle={{
                        position: 'relative',
                      }}
                      validate={values.unit === 'EACH' ?
                        combineValidators(
                          required,
                          naturalNumberValidator,
                        ) :
                        combineValidators(
                          required,
                          positiveNumberValidator,
                          maxDecimalPlaces(4),
                        )
                      }
                      suffix={values.unit === 'EACH' ? 'ea' : 'g'}
                      onChange={
                        e => form.change('newQuantity', calcNewQuantityForAmount(e.target.value, values.quantity, values.report))
                      }
                    />
                  </StyledFormGroup>
                }
                <StyledFormGroup>
                  <label>New quantity</label>
                  <StyledInput
                    disabled
                    name="newQuantity"
                    suffix={values.unit === 'EACH' ? 'ea' : 'g'}
                    validate={greaterThanOrEqualTo0}
                    value={adjustToZero ? '0.0000' : Number(values.newQuantity).toFixed(4)}
                  />
                </StyledFormGroup>
                { values.report === 'loss' && values.quantity > 0 &&
                  <StyledFormCheckbox
                    label="Adjust to zero"
                    name="adjustToZero"
                    value="adjustToZero"
                    labelStyle={labelStyle}
                    onChange={() => {
                      form.change('adjustmentAmount', Number(values.quantity).toFixed(4))
                      setAdjustToZero(!adjustToZero)
                    }}
                  />
                }
                <StyledFormGroup
                  style={{
                    alignItems: 'initial',
                    height: '200px',
                  }}
                >
                  <label>Notes</label>
                  <FormTextArea
                    placeholder="Additional details for the state."
                    style={{
                      height: '175px',
                      padding: '5px',
                    }}
                    name="note"
                    fieldContainerStyle={{
                      position: 'relative',
                    }}
                    validate={
                      combineValidators(
                        sanitizedStringValidator,
                        required,
                      )}
                    errorText
                  />
                </StyledFormGroup>
              </Fragment>
            </ConnectedButtonModal>
          </Fragment>
        )
      }
    }
    />
  )
}

AdjustQuantityModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  onSubmitAdjustPackage: PropTypes.func.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialValues: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  metrcReadOnly: PropTypes.bool,
}

const AdjustQuantityModalHOC = C => compose(
  withVenueSettings({ name: 'venueSettings' }),
  withConfirm(),
  withModals,
)(C)

export default AdjustQuantityModalHOC(AdjustQuantityModal)
