import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { FormSelectField } from 'components/common/input/SelectField'
import { TooltipWithIcon } from 'components/common/display/Tooltip'
import SectionHeader from './SectionHeader'

const timezoneData = [
  { name: 'Pacific/Pago_Pago: Samoa Standard Time',
    value: 'Pacific/Pago_Pago' },
  { name: 'America/Adak: Hawaii-Aleutian Standard Time (HAST)',
    value: 'America/Adak' },
  { name: 'America/Anchorage: Alaska Standard Time (AKST)',
    value: 'America/Anchorage' },
  { name: 'America/Los_Angeles: Pacific Standard Time (PST)',
    value: 'America/Los_Angeles' },
  { name: 'America/Denver: Mountain Standard Time (MST)',
    value: 'America/Denver' },
  { name: 'America/Chicago: Central Standard Time (CST)',
    value: 'America/Chicago' },
  { name: 'America/New_York: Eastern Standard Time (EST)',
    value: 'America/New_York' },
  { name: 'America/Port_of_Spain: Atlantic Standard Time (AST)',
    value: 'America/Port_of_Spain' },
  { name: 'Pacific/Guam: Chamorro Standard Time',
    value: 'Pacific/Guam' },
  { name: 'Pacific/Wake: Wake Island Time Zone',
    value: 'Pacific/Wake' },
]
const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hour => ({ name: `${hour}:00`, value: hour.toString() }))
const amPm = [
  { name: 'AM', value: 'AM' },
  { name: 'PM', value: 'PM' },
]
const SpaceBetween = styled.div`
  max-width: 100%;
  display: inline-flex;
  justify-content: space-between;
`
const GapStyle = styled.div`
  width: 25px;
`
const StyledFormSelectField = styled(FormSelectField)`
  width: 100%;
`
const StyledLabel = styled.label`
  color: ${colors.grayDark2};
  width: 150px;
`
const StyledFormGroup = styled(({ children, className, label }) => (
  <div className={className}>
    <StyledLabel>{label}</StyledLabel>
    <div style={{ width: '100%' }}>
      {children}
    </div>
  </div>
))`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`
const SmallGroupForm = ({ children, className, label }) => (
  <div className={className}>
    <StyledLabel>{label}</StyledLabel>
    <div style={{ width: '100%' }}>
      {children}
    </div>
  </div>
)

const StyledSmallFormGroup = styled(SmallGroupForm)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const ReportingIntegrations = ({ disabled }) => (
  <div>
    <SectionHeader>
      Reporting Integration
      <TooltipWithIcon
        text="Reporting integration defines when the home page report is reset."
        style={{ fontSize: '18px', verticalAlign: 'middle' }}
      />
    </SectionHeader>
    <StyledFormGroup label="Time zone">
      <StyledFormSelectField disabled={disabled} name="timezone" options={timezoneData} />
    </StyledFormGroup>
    <StyledSmallFormGroup label="Run reports at" >
      <SpaceBetween>
        <StyledFormSelectField name="hour" options={hours} disabled={disabled} style={{ width: 184 }} />
        <GapStyle />
        <StyledFormSelectField name="amPm" options={amPm} disabled={disabled} style={{ width: 111 }} />
      </SpaceBetween>
    </StyledSmallFormGroup>
  </div>
)

ReportingIntegrations.propTypes = {
  disabled: PropTypes.bool,
}

SmallGroupForm.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}

export default ReportingIntegrations
