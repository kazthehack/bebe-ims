//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { FormSelectField } from 'components/common/input/SelectField'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'
import Spinner from 'components/common/display/Spinner'
import Title from 'components/common/display/Title'
import { renderWhileLoading } from 'utils/hoc'
import { Form } from 'react-final-form'
import { focusOnError } from 'components/common/form/decorators'
import FixedFooterContainer from 'components/common/container/FixedFooterContainer'
import { ProductIcon } from 'components/common/display/ProductIcon'
import amountTypeCategoryMap from 'utils/amountTypeCategoryMapper'
import {
  combineValidators,
  required,
  withinRangeValidator,
  positiveNumberValidator,
  numberValidator,
  integerValidator,
  stringOfMaximumLength,
} from 'utils/validators'
import { compose } from 'recompose'
import { get } from 'lodash'
import { withNotifications } from 'components/Notifications'
import { withVenueID } from 'components/Venue'
import { withCancelConfirmation } from 'components/Modal'
import { withStoreEnableDareMode } from 'components/pages/settings/venue/withEnableDareMode'
import withUpdateReward from './withUpdateReward'
import withCreateReward from './withCreateReward'
import withRewardDetails from './withRewardDetails'

const StyledFormTextField = styled(FormTextField)`
  width: 320px;
`

const StyledFormContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const StyledFormColumn = styled.div`
  flex: 5 0 50%;
  max-width: 455px;
  &:first-of-type {
    margin-right: 64px;
  }
`

const StyledFormGroup = styled.div`
  display: flex;
  margin-top: 0px;
  margin-bottom: 32px;
  align-items: center;
  label {
    flex: 3 0 30%;
    font-size: 16px;
    color: ${colors.grayDark2};
    max-width: 135px;
    display: inline-block;
  }
`
const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 32px;
  width: 182px;
  label {
    font-size: 16px;
    color: ${colors.grayDark2};
  }
`

const rewardsTypes = [{
  name: 'Fixed amount off',
  value: 'amount-fixed',
}, {
  name: 'Fixed percent off',
  value: 'amount-percentage',
}]

const RewardSubtotal = ({
  onCancel,
  updateReward,
  createReward,
  rewardDetails,
  venueSettings,
  match,
}) => {
  const editReward = match.params.id
  const rewardDetailsData = get(rewardDetails, 'node', {})
  const initialValuesMap = {
    active: editReward ? rewardDetailsData.active : 'true',
    name: rewardDetailsData.name || '',
    customerType: 'Any customer',
    appliesTo: 'Subtotal',
    amountType: rewardDetailsData.amountType === 'FIXED' ? 'amount-fixed' : 'amount-percentage',
    pointCost: rewardDetailsData.pointCost,
    amount: rewardDetailsData.amount,
  }
  const { enableDareMode } = get(venueSettings, 'store.settings', false)
  return (
    <Form
      keepDirtyOnReinitialize
      onSubmit={(values) => {
        if (!editReward) {
          createReward({
            reward: {
              name: values.name,
              active: values.active,
              customerType: 'ANY',
              appliesTo: 'SUBTOTAL',
              amountType: amountTypeCategoryMap[values.amountType][1],
              category: amountTypeCategoryMap[values.amountType][0],
              amount: values.amount,
              pointCost: values.pointCost,
            },
          })
        } else {
          updateReward({
            rewardId: editReward,
            reward: {
              name: values.name,
              active: values.active,
              customerType: 'ANY',
              appliesTo: 'SUBTOTAL',
              amountType: amountTypeCategoryMap[values.amountType][1],
              category: amountTypeCategoryMap[values.amountType][0],
              amount: values.amount,
              pointCost: values.pointCost,
            },
          })
        }
      }}
      // validate={combineValidators(onValidate)}
      initialValues={initialValuesMap}
      decorators={[focusOnError]}
      render={({ handleSubmit, values, submitting, pristine, form }) => {
        const isPercent = amountTypeCategoryMap[values.amountType][1] === 'PERCENTAGE'
        const isCustom = amountTypeCategoryMap[values.amountType][0] === 'CUSTOM'
        const amountPlaceholder = `${isCustom ? 'Maximum' : ''} ${isPercent ? 'percent off' : 'dollar amount off'}`
        // validators
        const baseValidators = combineValidators(required)
        const percentValidators = combineValidators(
          baseValidators,
          numberValidator,
          withinRangeValidator(1, 99),
          integerValidator,
        )
        const amountValidators = combineValidators(
          baseValidators,
          positiveNumberValidator,
          numberValidator,
          integerValidator,
        )
        const coastValidators = combineValidators(
          baseValidators,
          integerValidator,
          positiveNumberValidator,
        )
        return (
          <Fragment>
            {submitting && <Spinner wrapStyle={{ position: 'absolute' }} />}
            <form onSubmit={handleSubmit}>
              <div>
                <Title> Reward details </Title>
                <StyledFormContent>
                  <StyledFormColumn>
                    <ToggleContainer>
                      <label>Active</label>
                      <FormToggle
                        name="active"
                        noStatusText
                      />
                    </ToggleContainer>
                    <StyledFormGroup>
                      <label>Name</label>
                      <StyledFormTextField
                        type="text"
                        name="name"
                        placeholder="Family and Friends"
                        validate={combineValidators(
                          required,
                          stringOfMaximumLength(255),
                        )}
                      />
                    </StyledFormGroup>
                    { !enableDareMode &&
                      <StyledFormGroup>
                        <label>Customer type</label>
                        <StyledFormTextField
                          type="text"
                          name="customerType"
                          placeholder="Any customer"
                          disabled
                        />
                      </StyledFormGroup>
                    }
                    <StyledFormGroup>
                      <label>Applies to</label>
                      <StyledFormTextField
                        type="text"
                        name="appliesTo"
                        disabled
                      />
                    </StyledFormGroup>
                    <StyledFormGroup>
                      <label>
                        Reward type
                      </label>
                      <FormSelectField
                        name="amountType"
                        options={rewardsTypes}
                        onChange={() => {
                          form.change('amount', '')
                        }}
                      />
                    </StyledFormGroup>
                  </StyledFormColumn>
                </StyledFormContent>
                <FixedFooterContainer
                  saveButtonType="submit"
                  saveDisabled={pristine || submitting}
                  showCancel
                  onCancel={() => onCancel(pristine)}
                  showSave
                />
                <StyledFormGroup>
                  <label>
                    {amountTypeCategoryMap[values.amountType][1] === 'PERCENTAGE' ? 'Percent off' : 'Amount off'}
                  </label>
                  <StyledFormTextField
                    name="amount"
                    prefix={isPercent ? undefined : '$'}
                    suffix={isPercent ? '%' : undefined}
                    placeholder={amountPlaceholder}
                    validate={isPercent ? percentValidators : amountValidators}
                    type="number"
                  />
                </StyledFormGroup>
                <StyledFormGroup>
                  <label>Cost of reward</label>
                  <StyledFormTextField
                    type="number"
                    name="pointCost"
                    placeholder="100"
                    validate={coastValidators}
                    prefix={
                      <ProductIcon type="star" />
                    }
                  />
                </StyledFormGroup>
              </div>
            </form>
          </Fragment>
          )
        }
      }
    />
  )
}

RewardSubtotal.propTypes = {
  onCancel: PropTypes.func,
  updateReward: PropTypes.func,
  createReward: PropTypes.func,
  rewardDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
}

export default compose(
  withVenueID,
  withNotifications,
  withStoreEnableDareMode,
  withRewardDetails,
  withUpdateReward(),
  withCreateReward(),
  withCancelConfirmation('/crm/rewards', { title: 'Discard record', message: 'Discard this new reward record?' }),
  renderWhileLoading(() => <Spinner wrapStyle={{ paddingTop: '100px' }} />, ['rewardDetails']),
)(RewardSubtotal)
