import React from 'react'
import PropTypes from 'prop-types'
import StatBox from './DashboardBox'
import { StyledTitle, StyledRow, StyledColumn } from '../DashboardPagePure'

const CustomersSection = ({ customers }) => {
  const {
    onlineMenuCustomersAcquired,
    loyaltyPointsAccumulated,
    recurringCustomers,
  } = customers

  return (
    <StyledColumn>
      <StyledTitle>Customers Over Time</StyledTitle>
      <StyledRow>
        <StatBox label="Online menu customers acquired" value={onlineMenuCustomersAcquired} />
        <StatBox label="Loyalty points accumulated" value={loyaltyPointsAccumulated} />
        <StatBox label="Recurring customers" value={recurringCustomers} />
      </StyledRow>
    </StyledColumn>
  )
}

CustomersSection.propTypes = {
  customers: PropTypes.shape({
    onlineMenuCustomersAcquired: PropTypes.number,
    loyaltyPointsAccumulated: PropTypes.number,
    recurringCustomers: PropTypes.number,
  }),
}

export default CustomersSection
