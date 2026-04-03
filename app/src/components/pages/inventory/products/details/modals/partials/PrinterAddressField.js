import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { FormTextField } from 'components/common/input/TextField'
import { required } from 'utils/validators'

const StyledFormGroup = styled.div`
  display: flex;
  margin: 12px auto;
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
  width: 550px;
  label {
    flex: 3 0 30%;
    color: ${colors.grayDark2};
    max-width: 8.5rem;
    display: inline-block;
  }

  :last-of-type {
    margin-bottom: 10px;
  }
`

const Styledlabel = styled.label`
  width: 120px;
  height: 16px;
  font-size: 14px;
`

export default () => (
  <StyledFormGroup>
    <Styledlabel>Printer Address</Styledlabel>
    <FormTextField
      name="printerAddress"
      fieldContainerStyle={{ width: '258px' }}
      validate={required}
      placeholder="localhost"
    />

  </StyledFormGroup>
)
