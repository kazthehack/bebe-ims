//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import { FormDatePicker } from 'components/common/input/DatePicker'
import { FormSelectField } from 'components/common/input/SelectField'
import colors from 'styles/colors'
import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import { TooltipWithIcon } from 'components/common/display/Tooltip'

// containers
export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

export const StyledSubHeader = styled(({ ...props }) => (
  <Subheader
    textSizeOption={2}
    color={colors.blueishGray}
    {...props}
  />
))`
  margin-bottom: 0px;
`

export const InputContainer = styled.div`
  & > * {
    margin-top: 17px;
  }
`

// common formGroup components
const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  width: 136px;
`

const StyledFormGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 456px;
  height: 40px;
`
const StyledSmallFormGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 296px;
  height: 40px;
`

const StyledInputWrapper = styled.div`
  width: 320px;
`
const StyledSmallInputWrapper = styled.div`
  width: 160px;
`

// Styled FormGroups
export const StyledFormGroup = styled(({ label, tooltip, ...props }) => (
  <StyledFormGroupWrapper className="FormGroupWrapper">
    <StyledLabel>{label}{tooltip && <TooltipWithIcon text={tooltip} />}</StyledLabel>
    <StyledInputWrapper>
      <FormTextField {...props} />
    </StyledInputWrapper>
  </StyledFormGroupWrapper>
))`
`

StyledFormGroup.propTypes = {
  label: PropTypes.string,
}

export const SmallStyledFormGroup = styled(({ label, ...props }) => (
  <StyledSmallFormGroupWrapper>
    <StyledLabel>{label}</StyledLabel>
    <StyledSmallInputWrapper>
      <FormTextField {...props} type="text" />
    </StyledSmallInputWrapper>
  </StyledSmallFormGroupWrapper>
))`
`

SmallStyledFormGroup.propTypes = {
  label: PropTypes.string,
}

export const StyledFormDatePicker = styled(({ label, ...props }) => (
  <StyledFormGroupWrapper>
    <StyledLabel>{label}</StyledLabel>
    <StyledInputWrapper>
      <FormDatePicker {...props} />
    </StyledInputWrapper>
  </StyledFormGroupWrapper>
))`
`

StyledFormDatePicker.propTypes = {
  label: PropTypes.string,
}

export const StyledFormSelectField = styled(({ label, tooltip, ...props }) => (
  <StyledFormGroupWrapper>
    <StyledLabel>{label}{tooltip && <TooltipWithIcon text={tooltip} />}</StyledLabel>
    <StyledInputWrapper>
      <FormSelectField
        style={{ width: 320 }}
        {...props}
      />
    </StyledInputWrapper>
  </StyledFormGroupWrapper>
))`
`
