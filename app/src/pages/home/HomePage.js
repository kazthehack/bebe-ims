import React from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import DashboardView from 'components/dashboard/DashboardView'
import { useDashboardData } from 'hooks/dashboard/useDashboardData'

const StyledContainer = styled.div`
  display: flex;
`

const StyledNote = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #5e5e5e;
  display: flex;
  align-items: center;
`

const HomePage = () => {
  const {
    events,
    eventsByDate,
    notifications,
    sales,
    loading,
    error,
    activeApiBase,
    calendarMonthLabel,
  } = useDashboardData()

  return (
    <PageContent
      title={(
        <StyledContainer>
          Dashboard
          <StyledNote>{`Mock Placeholder (backend-wired: ${activeApiBase || 'no api base'})`}</StyledNote>
        </StyledContainer>
      )}
    >
      <DashboardView
        calendarMonthLabel={calendarMonthLabel}
        events={events}
        eventsByDate={eventsByDate}
        notifications={notifications}
        sales={sales}
        loading={loading}
        error={error}
      />
    </PageContent>
  )
}

export default HomePage
