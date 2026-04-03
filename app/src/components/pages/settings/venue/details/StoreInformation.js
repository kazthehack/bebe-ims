//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/29/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import us from 'us'
import colors from 'styles/colors'
import { FormTextField } from 'components/common/input/TextField'
import { required, combineValidators, zipCodeValidator, phoneNumberValidator, sanitizedStringValidator } from 'utils/validators'
import { FormSelectField } from 'components/common/input/SelectField'
import SectionHeader from './SectionHeader'
import LabeledTextField from './LabeledTextField'
import StoreLogoUploader from './StoreLogoUploader'

const states = [{
  name: 'Oregon',
  value: 'OR',
}]

const TextInput = styled(LabeledTextField)`
  margin-bottom: ${({ margin }) => (margin || '24')}px;
`

const StyledTextField = styled(FormTextField)`
  width: 320px;
`

const StyledStateFormGroup = ({ children, className, label, style, ...props }) => (
  <div className={className}>
    <StyledLabel>{label}</StyledLabel>
    <div style={style}>
      {children || <StyledTextField {...props} type="text" style={{ width: '10%' }} />}
    </div>
  </div>
)
const StyledFormGroup = styled(StyledStateFormGroup)`
  display: flex;
  align-items: ${({ centeredVeritically }) => (centeredVeritically ? 'center' : 'flex-start')};
  margin-bottom: 24px;
`
const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  flex: 2.5 0 25%;
  font-size: 16px;
  max-width: 117px;
`

const StyledSelectField = styled(FormSelectField)`
  width: 320px;
`

// TODO combine error message of the address fields

// eslint-disable-next-line react/prop-types
const StoreInformation = ({ disabled, storeId, logoUrl }) => (
  <div>
    <SectionHeader>Store Information</SectionHeader>
    <div>
      <TextInput
        label="Venue name"
        name="name"
        validate={combineValidators(required, sanitizedStringValidator)}
        readOnly={disabled}
        placeholder="My Store"
        disabled={disabled}
      />
      <TextInput
        label="Address"
        name="address"
        validate={sanitizedStringValidator}
        margin={8}
        readOnly={disabled}
        placeholder="1234 Main St."
        disabled={disabled}
        labelStyle={{ marginBottom: '15px' }}
        fieldContainerStyle={{ height: '50px' }}
      />
      <TextInput
        label=""
        name="addressExtra"
        validate={sanitizedStringValidator}
        readOnly={disabled}
        placeholder="Suite #420"
        disabled={disabled}
      />
      <TextInput
        label="City"
        name="city"
        validate={sanitizedStringValidator}
        readOnly={disabled}
        placeholder="Central City"
        disabled={disabled}
      />
      <StyledFormGroup label="State" style={{ width: '100%' }}>
        <StyledSelectField
          options={states}
          name="state"
          disabled={disabled}
        />
      </StyledFormGroup>
      <TextInput
        label="Zip code"
        name="zipCode"
        validate={zipCodeValidator}
        readOnly={disabled}
        placeholder="12345-6789"
        disabled={disabled}
      />
      <TextInput
        label="Phone number"
        name="phone"
        validate={phoneNumberValidator}
        readOnly={disabled}
        placeholder="(000) 000-0000"
        disabled={disabled}
      />
      <TextInput
        label="Website"
        name="website"
        validate={sanitizedStringValidator}
        readOnly={disabled}
        placeholder="http://www.mystore.com"
        disabled={disabled}
      />
      <TextInput
        label="Owner"
        name="owner"
        placeholder="Jane Doe"
        disabled
      />
      <StyledFormGroup label="Store Logo">
        <div name="logoUrl">
          <StoreLogoUploader disabled={disabled} storeId={storeId} existingLogoUrl={logoUrl} />
        </div>
      </StyledFormGroup>
      <TextInput
        label="Receipt Tagline"
        name="receiptTagline"
        placeholder="Enter Tagline"
        validate={sanitizedStringValidator}
        readOnly={disabled}
        disabled={disabled}
      />
    </div>
  </div>
)

StoreInformation.propTypes = {
  disabled: PropTypes.bool,
}
StyledStateFormGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
}
export default StoreInformation
