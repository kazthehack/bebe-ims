import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { FormCheckbox } from 'components/common/input/Checkbox'
import {
  combineValidators,
  required,
  floatValidator,
  integerValidator,
  positiveNumber,
  maxDecimalPlaces,
  withinRangeValidator,
} from 'utils/validators'

import OptionalInput from './OptionalInput'

const StyledDiv = styled.div`
  margin-top: 20px;
`

const positiveIntegerValidator = combineValidators(
  integerValidator,
  positiveNumber,
)

const weightHeavyValidator = combineValidators(
  required,
  floatValidator,
  maxDecimalPlaces(3),
  withinRangeValidator(0, 1, false),
)

const OptionalSettings = ({ disabled, className, values }) => (
  <div className={className}>
    <OptionalInput
      disabled={disabled}
      name="flowerLimit"
      label="Weight-heavy flower limit"
      suffix="g"
      tooltip={
        <div>
          Weight-heavy flower limit determines
          how much oversell can occur without affecting the price.
          <br /><br />Example: If set to .05,
          the budtender can supply the customer with up to 3.55g on a 3.5g sale.
          The price would remain at 3.5g.
        </div>
        }
      checked={values.flowerLimitChecked}
      validate={weightHeavyValidator}
      placeholder="0.03"
    />
    <OptionalInput
      disabled={disabled}
      name="sleepTimer"
      label="POS sleep timer (in minutes)"
      tooltip="POS sleep timer determines how long the screen will stay active before returning to the pin screen."
      checked={values.sleepTimerChecked}
      validate={combineValidators(required, positiveIntegerValidator)}
      placeholder="15"
    />
    <OptionalInput
      disabled={disabled}
      name="packageSoldOutThreshold"
      label="Package sold out threshold (flower)"
      suffix="g"
      tooltip="Package sold out threshold determines when a package is removed from the sales floor to mitigate overselling."
      checked={values.packageSoldOutThresholdChecked}
      validate={combineValidators(required, positiveNumber, floatValidator, maxDecimalPlaces(3))}
      placeholder="10"
    />
    <OptionalInput
      disabled={disabled}
      checkName="useForceAgeCheck"
      name="ageCheck"
      label="Minimum purchase age"
      tooltip="Minimum purchase age determines the minimum age required for recreational purchases and forces budtenders to input the customer's DOB before a sale."
      checked={values.useForceAgeCheck}
      validate={combineValidators(required, positiveIntegerValidator)}
      placeholder="21"
    />
    <OptionalInput
      disabled={disabled}
      name="metrcDelayMins"
      label="Time delay from POS to Metrc (minutes)"
      checked={values.metrcDelayMinsChecked}
      validate={combineValidators(required, positiveIntegerValidator)}
      placeholder="5"
    />
    <StyledDiv>
      <FormCheckbox
        disabled={disabled}
        name="managerApproval"
        label="Require manager approval to open cash drawer"
        tooltip="Require manager approval to open cash drawer determines if a manager's pin is needed to open the cash drawer."
      />
    </StyledDiv>
    <StyledDiv>
      <FormCheckbox
        label="Print a receipt after every sale"
        name="enableReceiptPrint"
        tooltip="Turning this off would require the budtender
        to print a receipt from the transaction history page manually
        after a sale."
        disabled={disabled}
      />
    </StyledDiv>
  </div>
)

OptionalSettings.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  values: PropTypes.object,
}

const StyledSettings = styled(OptionalSettings)`
  margin-left: 40px;
`

export default StyledSettings
