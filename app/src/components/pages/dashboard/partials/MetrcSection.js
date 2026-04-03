import React from 'react'
import PropTypes from 'prop-types'
import StatBox from './DashboardBox'
import { StyledTitle, StyledRow, StyledColumn } from '../DashboardPagePure'

const MetrcSection = ({ metrc }) => {
  const { verifiedMetrcSales, metrcFailuresHandled, totalMetrcInteractions } = metrc
  return (
    <StyledColumn style={{ marginRight: -16 }}>
      <StyledTitle>METRC OVER TIME</StyledTitle>
      <StyledRow>
        <StatBox label="Verified Metrc sales" value={verifiedMetrcSales} />
        <StatBox label="Metrc failures handled" value={metrcFailuresHandled} />
        <StatBox label="Total Metrc interactions" value={totalMetrcInteractions} />
      </StyledRow>
    </StyledColumn>
  )
}

MetrcSection.propTypes = {
  metrc: PropTypes.shape({
    verifiedMetrcSales: PropTypes.number,
    metrcFailuresHandled: PropTypes.number,
    totalMetrcInteractions: PropTypes.number,
  }),
}

export default MetrcSection
