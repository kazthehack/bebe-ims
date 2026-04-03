import React, { Fragment, useEffect } from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import { focusOnError } from 'components/common/form/decorators'
import { withModals, connectModal, withConfirm } from 'components/Modal'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { FormTextField } from 'components/common/input/TextField'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormTextArea } from 'components/common/input/TextArea'
import colors from 'styles/colors'
import {
  combineValidators,
  required,
  naturalNumberValidator,
  greaterThanOrEqualTo0,
  sanitizedStringValidator,
  positiveNumber,
} from 'utils/validators'
import { isEmpty, get } from 'lodash'
import { Form } from 'react-final-form'
import { genericDervivedFieldError } from 'utils/mapErrorMessage'
import { withNotifications } from 'components/Notifications'
import withPointsAdjustments from './withPointsAdjustments'
import withAdjustLoyaltyPoints from './withAdjustLoyaltyPoints'

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

const StyledInput = styled(FormTextField)`
  width: 320px;
`

const StyledButton = styled(Button)`
  width: 260px;
`

const reportOptions = [{ name: 'Add', value: 'add' }, { name: 'Loss', value: 'loss' }]

const calcNewQuantityForAmount =
  (val, newQuantity, report) => {
    const result = (report === 'loss' ? newQuantity - Number(val) : Number(newQuantity) + Number(val))
    if (Number.isNaN(result)) return genericDervivedFieldError
    return result
  }

const calcNewQuantityForReport =
  (val, { currentPoints, adjustmentAmount }) => {
    const result = (val === 'loss' ? currentPoints - Number(adjustmentAmount) : Number(currentPoints) + Number(adjustmentAmount))
    if (Number.isNaN(result)) return genericDervivedFieldError
    return result
  }

const resetAdjustCustomerPointsModalForm = (form, initialValues) => form.batch(() => {
  form.change('report', initialValues.report)
  form.change('currentPoints', initialValues.quantity)
  form.change('adjustmentAmount', initialValues.adjustmentAmount)
  form.change('reason', initialValues.reason)
  form.change('newQuantity', initialValues.newQuantity)
})

const ConnectedButtonModal = connectModal('AdjustCustomerPointsModal')(ButtonModal)

const mapInitialValues = initialValues => ({
  report: 'add',
  currentPoints: get(initialValues, 'points.current'),
  adjustmentAmount: '',
  reason: '',
  newQuantity: get(initialValues, 'points.current'),
})

const AdjustCustomerPointsModal = ({
  pushModal,
  popModal,
  initialValues,
  confirm,
  adjustLoyaltyPoints,
  refetchData,
  match,
}) => (
  <Form
    onSubmit={(values) => {
      adjustLoyaltyPoints({
        memberId: match.params.id,
        adjustmentData: {
          points: get(values, 'report') === 'add' ? get(values, 'adjustmentAmount') : get(values, 'adjustmentAmount') * -1,
          reason: get(values, 'reason'),
        },
        refetchData,
      })
    }}
    decorators={[focusOnError]}
    initialValues={mapInitialValues(initialValues)}
    render={({ handleSubmit, values, submitting, pristine, form, errors }) => {
        useEffect(() => () => {
            resetAdjustCustomerPointsModalForm(form, initialValues)
          }, [initialValues])
        return (
          <Fragment>
            <StyledButton white type="button" onClick={() => pushModal('AdjustCustomerPointsModal')}>Adjust Customer Points</StyledButton>
            <ConnectedButtonModal
              white
              title="Adjust Customer Points"
              header="Adjust Customer Points"
              primaryButton={{
                onClick: () => {
                  handleSubmit()
                  if (isEmpty(errors)) {
                    popModal()
                  }
                },
                text: 'save',
                disabled: submitting || pristine || !isEmpty(errors),
              }}
              secondaryButton={{
                text: 'cancel',
                onClick: () => {
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
                  <label>Current points</label>
                  <StyledInput
                    disabled
                    value={values.currentPoints}
                    name="currentPoints"
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>{values.report === 'add' ? 'Add' : 'Subtract'}</label>
                  <StyledInput
                    name="adjustmentAmount"
                    validate={combineValidators(
                        required,
                        naturalNumberValidator,
                        positiveNumber,
                      )}
                    onChange={
                      e => form.change('newQuantity', calcNewQuantityForAmount(e.target.value, values.currentPoints, values.report))
                    }
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>New quantity</label>
                  <StyledInput
                    disabled
                    name="newQuantity"
                    validate={greaterThanOrEqualTo0}
                    value={values.newQuantity}
                  />
                </StyledFormGroup>
                <StyledFormGroup
                  style={{
                    alignItems: 'initial',
                    height: '200px',
                  }}
                >
                  <label>Reason</label>
                  <FormTextArea
                    required
                    style={{
                      height: '175px',
                      padding: '5px',
                    }}
                    name="reason"
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

AdjustCustomerPointsModal.propTypes = {
  pushModal: PropTypes.func.isRequired,
  popModal: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  adjustLoyaltyPoints: PropTypes.func,
  refetchData: PropTypes.func,
  match: PropTypes.object,
}

const AdjustCustomerPointsModalHOC = C => compose(
  withConfirm(),
  withModals,
  withRouter,
  withPointsAdjustments,
  withNotifications,
  withAdjustLoyaltyPoints(),
)(C)

export default AdjustCustomerPointsModalHOC(AdjustCustomerPointsModal)
