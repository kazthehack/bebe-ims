import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import StatBox from './DashboardBox'
import { StyledTitle, StyledRow, StyledColumn } from '../DashboardPagePure'

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
`

const ComplianceSection = ({
  compliance,
  setBetaDashboard,
  allowDashboardSelection,
}) => {
  const {
    posComplianceErrorsStopped,
    posComplianceErrorsPotentialCost,
    packageOversellingStopped,
    autoFinishedPackages,
  } = compliance

  return (
    <StyledColumn>
      <StyledTitle>COMPLIANCE</StyledTitle>
      <StyledRow>
        <StatBox label="POS compliance\nerror's stopped" value={posComplianceErrorsStopped} />
        <StatBox label="POS compliance error's potential cost" value={posComplianceErrorsPotentialCost} prefix="$" styledDecimal />
        <StatBox label="Package overselling stopped" value={packageOversellingStopped} />
        <StatBox label="Auto-finished packages" value={autoFinishedPackages} />

        {allowDashboardSelection && (
          <StyledButton onClick={setBetaDashboard}>
            switch to standard dashboard
          </StyledButton>
        )}
      </StyledRow>
    </StyledColumn>
  )
}

ComplianceSection.propTypes = {
  compliance: PropTypes.shape({
    posComplianceErrorsStopped: PropTypes.number,
    posComplianceErrorsPotentialCost: PropTypes.string,
    packageOversellingStopped: PropTypes.number,
    autoFinishedPackages: PropTypes.number,
  }),
  setBetaDashboard: PropTypes.func,
  allowDashboardSelection: PropTypes.bool,
}

export default ComplianceSection
