//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import { isEmpty, get } from 'lodash'
import PropTypes from 'prop-types'
import { SectionContainer, InputContainer, StyledFormGroup, StyledSubHeader } from './PackageStyledComponents'

const PackageSourcePure = ({ values, mandatoryFieldStyles }) => (
  <SectionContainer>
    <StyledSubHeader>Source</StyledSubHeader>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <InputContainer>
        <StyledFormGroup
          style={mandatoryFieldStyles && isEmpty(get(values, 'facilityName')) ? mandatoryFieldStyles : undefined}
          label="Facility name"
          name="facilityName"
          disabled
        />
        <StyledFormGroup
          style={mandatoryFieldStyles && isEmpty(get(values, 'facilityLicense')) ? mandatoryFieldStyles : undefined}
          label="Facility ID"
          name="facilityLicense"
          disabled
        />
      </InputContainer>
      <InputContainer>
        <StyledFormGroup label="Manifest #" name="manifestNumber" disabled />
        <StyledFormGroup label="Received date" name="dateReceived" disabled />
      </InputContainer>
    </div>
  </SectionContainer>
)

PackageSourcePure.propTypes = {
  values: PropTypes.object,
  mandatoryFieldStyles: PropTypes.object,
}

export default PackageSourcePure
