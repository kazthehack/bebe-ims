//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import { FormToggle } from 'components/common/input/Toggle'
import {
  combineValidators,
  greaterThanOrEqualTo0,
  maxDecimalPlaces,
  numberValidator,
} from 'utils/validators'
import { packageCost } from 'constants/TooltipMessages'
import { SectionContainer, InputContainer, StyledFormGroup } from './PackageStyledComponents'
import AdjustQuantityModal from '../modals/AdjustQuantityModal'
import FinishPackageModal from '../modals/FinishPackageModal'

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 14px;
  width: 182px;
`

const RemediationWarningBar = styled.div`
  height: 53px;
  border-radius: 4px;
  border: solid 2px ${colors.red};
  background-color: ${colors.white};
  text-align: center;
  line-height: 53px;
  border: 2px solid ${colors.red};
  color: ${colors.red};
  letter-spacing: 1.4px;
  font-weight: 500;
  font-size: 18px;
`

const SubsectionBtnContainer = styled.div`
  text-align: right;
  button {
    margin-left: 17px;
    height: 41px;
    width: 208px;
  }
  display: flex;
  justify-content: space-between;
`

const LabelDiv = styled.div`
  color: ${colors.grayDark2};
  width: 136px;
`

const PackageInventoryDataPure = ({
  isOnHold,
  values,
  userPermissions,
  onSubmitAdjustPackage,
  reasons,
  initialValues,
  metrcReadOnly,
}) => {
  const disableModalButtons = (values.finishedDate !== 'Still Active' && values.finishedDate !== 'Package Finish in Progress')
  return (
    <SectionContainer>
      <ToggleContainer>
        <LabelDiv>Active</LabelDiv>
        <FormToggle
          name="active"
          checkedStatusText=""
          uncheckedStatusText=""
          disabled={disableModalButtons}
        />
      </ToggleContainer>
      { isOnHold &&
        <RemediationWarningBar>
          ON HOLD - THIS PACKAGE MAY REQUIRE REMEDIATION
        </RemediationWarningBar>
      }
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputContainer>
          <StyledFormGroup
            label="Original quantity"
            suffix={values.unit === 'EACH' ? 'ea' : 'g'}
            name="initialQuantity"
            value={values.initialQuantity ? Number(values.initialQuantity).toFixed(4) : ''}
            disabled
          />
          <StyledFormGroup
            label="Current quantity"
            suffix={values.unit === 'EACH' ? 'ea' : 'g'}
            name="quantity"
            value={values.quantity ? Number(values.quantity).toFixed(4) : ''}
            disabled
          />
          <StyledFormGroup label="METRC UoM" name="providerUnit" disabled />
        </InputContainer>
        <InputContainer>
          <StyledFormGroup
            validate={
              combineValidators(
                numberValidator,
                greaterThanOrEqualTo0,
                maxDecimalPlaces(2),
              )
            }
            placeholder="5000"
            label="Package cost"
            prefix="$"
            name="pricePaid"
            tooltip={packageCost}
            disabled={!userPermissions.write}
          />
          <StyledFormGroup label="Finished date" name="finishedDate" placeholder="" disabled />
          {userPermissions.write &&
          <SubsectionBtnContainer>
            <AdjustQuantityModal
              parentValues={values}
              onSubmitAdjustPackage={onSubmitAdjustPackage}
              reasons={reasons}
              initialValues={initialValues.adjustQuantityModal}
              disabled={disableModalButtons}
              metrcReadOnly={metrcReadOnly}
            />
            <FinishPackageModal
              quantity={values.quantity}
              packageId={values.id}
              disabled={disableModalButtons}
              metrcReadOnly={metrcReadOnly}
            />
          </SubsectionBtnContainer>
          }
        </InputContainer>
      </div>
    </SectionContainer>
  )
}

PackageInventoryDataPure.propTypes = {
  isOnHold: PropTypes.bool,
  values: PropTypes.object.isRequired,
  onSubmitAdjustPackage: PropTypes.func.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.string),
  userPermissions: UserPermissionsPropType,
  initialValues: PropTypes.object,
  metrcReadOnly: PropTypes.bool,
}

export default PackageInventoryDataPure
