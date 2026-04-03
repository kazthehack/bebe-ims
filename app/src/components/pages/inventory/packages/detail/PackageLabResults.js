//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import colors from 'styles/colors'
import { map, capitalize, get, join, split, isEmpty, isDate } from 'lodash'
import PropTypes from 'prop-types'
import {
  withinRangeValidator,
  numberValidator,
  maxDecimalPlaces,
  combineValidators,
  futureDateValidator,
} from 'utils/validators'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { FormCheckbox } from 'components/common/input/Checkbox'
import { SectionContainer, InputContainer, StyledFormGroup, StyledSubHeader, StyledFormSelectField, StyledFormDatePicker } from './PackageStyledComponents'

const StyledDoubleFieldDiv = styled.div`
  display: flex;
  align-items: center;
  width: 456px;
  height: 40px;
`
const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  font-size: 16px;
  width: 180px;  // wasn't room for label at 120px spec
`

const StyledFormTextField = styled(FormTextField)`
  width: 155px;

`
const SpacerSpan = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`

const StyledCapitalizedField = styled(StyledFormSelectField)`
  text-transform: capitalize;
`

const StyledFormCheckbox = styled(FormCheckbox)`
  margin-left: 136px;
`

const combinedFloatValidator = combineValidators(
  numberValidator,
  withinRangeValidator(0, 100, true),
  maxDecimalPlaces(2),
)

const PackageLabResultsPure = ({
  userPermissions,
  storeStrains,
  initialValues,
  values,
  form,
  mandatoryFieldStyles,
  venueSettings,
}) => {
  const initialThc = get(initialValues, 'labResult.displayThc')
  const initialCbd = get(initialValues, 'labResult.displayCbd')
  const isThcUnderLoq = get(values, 'labResult.isThcUnderLoq')
  const isCbdUnderLoq = get(values, 'labResult.isCbdUnderLoq')
  return (
    <SectionContainer>
      <StyledSubHeader>Lab Results</StyledSubHeader>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <InputContainer>
          {isThcUnderLoq ? // two different intsances so it doesn't breaks the field's state
            <StyledFormGroup
              label="THC"
              suffix="%"
              name="labResult.displayThc"
              value="<LOQ"
              disabled
            /> :
            <StyledFormGroup
              label="THC"
              suffix="%"
              name="labResult.displayThc"
              placeholder="15"
              disabled={!get(userPermissions, 'write', false)}
              style={mandatoryFieldStyles && isEmpty(String(get(values, 'labResult.displayThc'))) ? mandatoryFieldStyles : null}
            />
          }
          <StyledFormCheckbox
            name="labResult.isThcUnderLoq"
            label="THC is <LOQ"
            labelStyle={{ color: colors.grayDark2 }}
            onChange={(e) => {
              if (e.target.value === 'false') {
                form.change('labResult.displayThc', null)
              } else {
                form.change('labResult.displayThc', initialThc)
              }
            }}
          />
          {isCbdUnderLoq ? // two different intsances so it doesn't breaks the field's state
            <StyledFormGroup
              label="CBD"
              suffix="%"
              name="labResult.displayCbd"
              value="<LOQ"
              disabled
            /> :
            <StyledFormGroup
              label="CBD"
              suffix="%"
              name="labResult.displayCbd"
              placeholder="15"
              disabled={!get(userPermissions, 'write', false)}
              style={mandatoryFieldStyles && isEmpty(String(get(values, 'labResult.displayCbd'))) ? mandatoryFieldStyles : null}
            />
          }
          <StyledFormCheckbox
            name="labResult.isCbdUnderLoq"
            label="CBD is <LOQ"
            labelStyle={{ color: colors.grayDark2 }}
            onChange={(e) => {
              if (e.target.value === 'false') {
                form.change('labResult.displayCbd', null)
              } else {
                form.change('labResult.displayCbd', initialCbd)
              }
            }}

          />
          <StyledCapitalizedField
            comboBox
            label="Strain"
            name="strainName"
            placeholder="Firefoot"
            disabled={!get(userPermissions, 'write', false)}
            options={storeStrains.map(strain => ({
                      value: join(map(split(get(strain, 'name'), ' '), capitalize), ' '),
                    }))}
          />
          <StyledDoubleFieldDiv>
            <StyledLabel>Genetics</StyledLabel>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <StyledFormTextField
                name="labResult.displayIndica"
                placeholder="50"
                validate={combinedFloatValidator}
                suffix="%"
                disabled={!get(userPermissions, 'write', false)}
                subFieldLabel="Indica"
                errorStyle={{ fontSize: '10px', marginLeft: '0' }}
              />
              <SpacerSpan />
              <StyledFormTextField
                name="labResult.displaySativa"
                placeholder="50"
                validate={combinedFloatValidator}
                suffix="%"
                disabled={!get(userPermissions, 'write', false)}
                subFieldLabel="Sativa"
                errorStyle={{ fontSize: '10px', marginLeft: '0' }}
              />
            </div>
          </StyledDoubleFieldDiv>
        </InputContainer>
        <InputContainer>
          <StyledFormGroup label="Testing status" name="labResult.testStatus" disabled />
          <StyledFormDatePicker
            label="Testing date"
            name="labResult.testDate"
            disabled={!get(userPermissions, 'write', false)}
            suffix={<ProductIcon type="calendar" />}
            isMandatory={isEmpty(values, 'labResult.testDate') || !isDate(get(values, 'labResult.testDate'))}
            validate={futureDateValidator(get(venueSettings, 'store.timezone'))}
            errorText
          />
          <StyledFormGroup
            label="Testing lab"
            name="labResult.testLabName"
            placeholder="Legit Labs"
            disabled={!get(userPermissions, 'write', false)}
            style={mandatoryFieldStyles && isEmpty(get(values, 'labResult.testLabName')) ? mandatoryFieldStyles : null}
          />
          <StyledFormGroup label="Remediation" name="labResult.remediationRequired" disabled />
        </InputContainer>
      </div>
    </SectionContainer>
  )
}

PackageLabResultsPure.propTypes = {
  userPermissions: UserPermissionsPropType,
  values: PropTypes.object,
  initialValues: PropTypes.object,
  form: PropTypes.object,
  storeStrains: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  mandatoryFieldStyles: PropTypes.object,
  venueSettings: PropTypes.object,
}

export default PackageLabResultsPure
