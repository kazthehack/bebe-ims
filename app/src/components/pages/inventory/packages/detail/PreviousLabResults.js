//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import React, { useState } from 'react'
import styled from 'styled-components'
import { FormTextField } from 'components/common/input/TextField'
import { UserPermissionsPropType } from 'components/common/display/withAuthenticatedEmployee'
import colors from 'styles/colors'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import {
  required,
} from 'utils/validators'
import Button from 'components/common/input/Button'
import { ProductIcon } from 'components/common/display/ProductIcon'
import { v4 } from 'uuid'
import { FormDatePicker } from 'components/common/input/DatePicker'
import { SectionContainer, StyledSubHeader } from './PackageStyledComponents'

const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  font-size: 16px;
  width: 136px;
  vertical-align: middle;
  line-height: 40px;
`

const StyledField = styled(FormTextField)`
  width: 17rem;
  margin-right: 24px;
  margin-left: 1.4rem;
`

const RowDiv = styled.div`
  display: inline-flex;
  margin-bottom: 8px;
`

const LinkStyling = styled.div`
  display: block;
  padding: 0.8rem 1.6rem 0.8rem 0px;
  margin-top: 1.45rem;
  color: ${colors.blue};
  text-decoration: underline;
  font-family: "Roboto Condensed", sans-serif;
  cursor: pointer;
  font-size: 16px;
`

const StyledDateDiv = styled.div`
  margin-right: 24px;
`

const LabRow = ({ row, values, form, renders, setRenders, disabled }) => (
  <RowDiv>
    <StyledLabel>Testing date</StyledLabel>
    <StyledDateDiv>
      <FormDatePicker
        suffix={<ProductIcon type="calendar" />}
        name={`labResult.resultHistory[${row}].previousTestDate`}
        validate={required}
        disabled={disabled}
      />
    </StyledDateDiv>
    <StyledLabel>Testing lab</StyledLabel>
    <StyledField
      name={`labResult.resultHistory[${row}].previousTestLabName`}
      placeholder="Lab name"
      validate={required}
      disabled={disabled}
    />
    <Button
      onClick={() => {
        values.labResult.resultHistory.splice(row, 1)
        form.change('altPristine', false)
        setRenders(renders + 1)
      }}
      disabled={disabled}
      style={{ height: '40px', marginLeft: '2rem' }}
    >
      Delete
    </Button>
  </RowDiv>
)

LabRow.propTypes = {
  row: PropTypes.number,
  values: PropTypes.object,
  form: PropTypes.object,
  renders: PropTypes.number,
  setRenders: PropTypes.func,
  disabled: PropTypes.bool,
}

const PreviousLabResults = ({ userPermissions, values, form }) => {
  const rows = get(values, 'labResult.resultHistory')
  const [renders, setRenders] = useState(1) // force component update by updating state
  return (
    <SectionContainer>
      <div style={{ display: 'inline-flex' }}>
        <StyledSubHeader style={{ marginBottom: '12px' }}>Previous Lab Results</StyledSubHeader>
        <LinkStyling
          onClick={() => {
            rows.push({ previousTestLabName: '', previousTestDate: new Date(), id: v4() })
            form.change('altPristine', false)
            setRenders(renders + 1)
          }}
          disabled={!get(userPermissions, 'write', false)}
        >
          Add Past Result
        </LinkStyling>
      </div>
      {rows && rows.map((r, i) => (
        <LabRow
          row={i}
          key={r.id}
          values={values}
          renders={renders}
          setRenders={setRenders}
          form={form}
          disabled={!get(userPermissions, 'write', false)}
        />
      ))}
    </SectionContainer>
  )
}

PreviousLabResults.propTypes = {
  userPermissions: UserPermissionsPropType,
  values: PropTypes.object,
  form: PropTypes.object,
}

export default PreviousLabResults
