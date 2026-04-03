import React from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Button from 'components/common/input/Button'
import MetrcSection from './partials/MetrcSection'
import CustomersSection from './partials/CustomersSection'
import TransactionsSection from './partials/TransactionsSection'
import TodaysSalesSection from './partials/TodaysSalesSection'
import TodayTopSection from './partials/TodayTopSection'

export const StyledTitle = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  color: #5e5e5e;
  font: 500 21px 'Roboto';
  text-transform: uppercase;
  letter-spacing: 2px;
`

export const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: no-wrap;
  height: fit-content;
`

export const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-right: 30px;
`

export const StyledDashboardContainer = styled.div`
  margin-top: 55px;
`

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
`

const StyledDashboardText = styled.div`
  color #1875f0;
  font: italic 22px 'Roboto';
  padding-bottom: 20px;
`

const DashboardPage = ({ dashboardData, setBetaDashboard, venueSettings }) => {
  const { allowDashboardSelection } = get(venueSettings, 'store.settings')
  const dashboard = get(dashboardData, 'store.dashboard')
  const {
    metrc,
    todaysSales,
    transactions,
    todaysTopBudtenders,
    todaysTopCategories,
    todaysBestSellers,
    customers,
    grossSalesOverTime,
    todaysSalesHourly,
    todaysAdjustments,
  } = dashboard

  return (
    <StyledDashboardContainer>
      {allowDashboardSelection && (
        <StyledButton onClick={setBetaDashboard}>
          switch to standard dashboard
        </StyledButton>
      )}
      <StyledRow>
        <StyledDashboardText>
          You are currently using our new experimental dashboard!
        </StyledDashboardText>
      </StyledRow>
      <StyledRow>
        <MetrcSection metrc={metrc} />
        <CustomersSection customers={customers} />
      </StyledRow>
      <StyledRow>
        <TransactionsSection
          transactions={transactions}
          grossSalesOverTime={grossSalesOverTime}
          todaysSalesHourly={todaysSalesHourly}
        />
        <TodaysSalesSection
          todaysSales={todaysSales}
          todaysAdjustments={todaysAdjustments}
          todaysBestSellers={todaysBestSellers}
        />
      </StyledRow>
      <StyledRow>
        <TodayTopSection
          todaysTopBudtenders={todaysTopBudtenders}
          todaysTopCategories={todaysTopCategories}
        />
      </StyledRow>
    </StyledDashboardContainer>
  )
}

DashboardPage.propTypes = {
  dashboardData: PropTypes.object,
  setBetaDashboard: PropTypes.func,
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        allowDashboardSelection: PropTypes.bool,
      }),
    }),
  }),
}

export default DashboardPage
