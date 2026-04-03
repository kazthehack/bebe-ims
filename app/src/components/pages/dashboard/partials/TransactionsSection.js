import React from 'react'
import moment from 'moment-timezone'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from 'styles/colors'
import StatBox from './DashboardBox'
import TransactionsGraph from './TransactionsGraph'
import GrossSalesGraph from './GrossSalesGraph'
import TodaysSalesHourlyGraph from './TodaysSalesHourlyGraph'
import { StyledTitle, StyledRow, StyledColumn } from '../DashboardPagePure'

const StyledSection = styled.div`
  background: ${colors.white}
  width: 824px;
  height: auto;
  box-sizing: border-box;
  margin-bottom: 20px;
`

const TransactionsSection = ({ transactions, grossSalesOverTime, todaysSalesHourly }) => {
  const {
    totalToday,
    totalYesterday,
    lastWeek,
    lastMonth,
    totalRecToday,
    totalRecYesterday,
    recLastWeek,
    recLastMonth,
    totalMedToday,
    totalMedYesterday,
    medLastWeek,
    medLastMonth,
    transactionsByDay,
  } = transactions

  const {
    totalToday: totalTodayGrossSales,
    totalYesterday: totalYesterdayGrossSales,
    lastWeek: lastWeekGrossSales,
    lastMonth: lastMonthGrossSales,
    totalRecToday: totalRecTodayGrossSales,
    totalRecYesterday: totalRecYesterdayGrossSales,
    recLastWeek: recLastWeekGrossSales,
    recLastMonth: recLastMonthGrossSales,
    totalMedToday: totalMedTodayGrossSales,
    totalMedYesterday: totalMedYesterdayGrossSales,
    medLastWeek: medLastWeekGrossSales,
    medLastMonth: medLastMonthGrossSales,
    grossSalesByDay: grossSalesByDayGrossSales,
  } = grossSalesOverTime

  const {
    avgSalesPerHour,
    avgTransactionPerHour,
    rushHour,
    salesByHour,
  } = todaysSalesHourly

  const momentRushHour = moment(rushHour, 'HH:mm:ss')
  let formattedRushHour = ''
  let formattedRushHourSuffix = ''
  if (momentRushHour.isValid()) {
    formattedRushHour = momentRushHour.format('h')
    formattedRushHourSuffix = momentRushHour.format('A')
  }
  return (
    <StyledColumn>
      <StyledTitle>Transactions Over Time</StyledTitle>
      <StyledSection>
        <StyledRow>
          <StatBox label="Total today" value={totalToday} borderless stacked />
          <StatBox label="Total yesterday" value={totalYesterday} borderless stacked />
          <StatBox label="Last 7 days" value={lastWeek} borderless stacked />
          <StatBox label="Last 30 days" value={lastMonth} borderless stacked />
        </StyledRow>
        <StyledRow>
          <StatBox label="Total rec today" value={totalRecToday} borderless stacked />
          <StatBox label="Total rec yesterday" value={totalRecYesterday} borderless stacked />
          <StatBox label="Rec last 7 days" value={recLastWeek} borderless stacked />
          <StatBox label="Rec last 30 days" value={recLastMonth} borderless stacked />
        </StyledRow>
        <StyledRow>
          <StatBox label="Total med today" value={totalMedToday} borderless stacked />
          <StatBox label="Total med yesterday" value={totalMedYesterday} borderless stacked />
          <StatBox label="Med last 7 days" value={medLastWeek} borderless stacked />
          <StatBox label="Med last 30 days" value={medLastMonth} borderless stacked />
        </StyledRow>
        <TransactionsGraph transactionsByDay={transactionsByDay} />
      </StyledSection>

      <StyledTitle>Gross sales over time</StyledTitle>
      <StyledSection>
        <StyledRow>
          <StatBox label="Total today" value={totalTodayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Total yesterday" value={totalYesterdayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Last 7 days" value={lastWeekGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Last 30 days" value={lastMonthGrossSales} prefix="$" styledDecimal borderless stacked />
        </StyledRow>
        <StyledRow>
          <StatBox label="Total rec today" value={totalRecTodayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Total rec yesterday" value={totalRecYesterdayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Rec last 7 days" value={recLastWeekGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Rec last 30 days" value={recLastMonthGrossSales} prefix="$" styledDecimal borderless stacked />
        </StyledRow>
        <StyledRow>
          <StatBox label="Total med today" value={totalMedTodayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Total med yesterday" value={totalMedYesterdayGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Med last 7 days" value={medLastWeekGrossSales} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Med last 30 days" value={medLastMonthGrossSales} prefix="$" styledDecimal borderless stacked />
        </StyledRow>
        <StyledRow>
          <GrossSalesGraph grossSalesByDay={grossSalesByDayGrossSales} />
        </StyledRow>
      </StyledSection>

      <StyledTitle>Today&apos;s sales hourly</StyledTitle>
      <StyledSection>
        <StyledRow>
          <StatBox label="Avg. sale per hour" value={avgSalesPerHour} prefix="$" styledDecimal borderless stacked />
          <StatBox label="Avg. transactions per hour" value={avgTransactionPerHour} borderless stacked />
          <StatBox label="Rush hour" value={formattedRushHour} suffix={formattedRushHourSuffix} smallSuffix borderless stacked />
        </StyledRow>
        <StyledRow>
          <TodaysSalesHourlyGraph salesByHour={salesByHour} />
        </StyledRow>
      </StyledSection>
    </StyledColumn>
  )
}

TransactionsSection.propTypes = {
  transactions: PropTypes.shape({
    totalToday: PropTypes.number,
    totalYesterday: PropTypes.number,
    lastWeek: PropTypes.number,
    lastMonth: PropTypes.number,
    totalRecToday: PropTypes.number,
    totalRecYesterday: PropTypes.number,
    recLastWeek: PropTypes.number,
    recLastMonth: PropTypes.number,
    totalMedToday: PropTypes.number,
    totalMedYesterday: PropTypes.number,
    medLastWeek: PropTypes.number,
    medLastMonth: PropTypes.number,
    transactionsByDay: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      rec: PropTypes.number,
      med: PropTypes.number,
      total: PropTypes.number,
    })),
  }),
  grossSalesOverTime: PropTypes.shape({
    totalToday: PropTypes.string,
    totalYesterday: PropTypes.string,
    lastWeek: PropTypes.string,
    lastMonth: PropTypes.string,
    totalRecToday: PropTypes.string,
    totalRecYesterday: PropTypes.string,
    recLastWeek: PropTypes.string,
    recLastMonth: PropTypes.string,
    totalMedToday: PropTypes.string,
    totalMedYesterday: PropTypes.string,
    medLastWeek: PropTypes.string,
    medLastMonth: PropTypes.string,
    grossSalesByDay: PropTypes.arrayOf(PropTypes.object),
  }),
  todaysSalesHourly: PropTypes.shape({
    avgSalesPerHour: PropTypes.string,
    avgTransactionPerHour: PropTypes.number,
    rushHour: PropTypes.string,
    salesByHour: PropTypes.arrayOf(PropTypes.object),
  }),
}

export default TransactionsSection
