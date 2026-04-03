import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PageContent from 'components/pages/PageContent'
import { RestClient } from 'api/client'

const StyledContainer = styled.div`
  display: flex;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #dde4ee;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(20, 38, 63, 0.08);
  padding: 18px;
`

const PanelTitle = styled.div`
  color: #1f2f45;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`

const PlaceholderList = styled.div`
  display: grid;
  gap: 10px;
`

const PlaceholderItem = styled.div`
  background: #f4f7fb;
  border-radius: 8px;
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #4d4d4d;
  font-size: 13px;
`

const SalesPanel = styled(Panel)`
  margin-top: 6px;
`

const SalesTitle = styled.div`
  color: #1f2f45;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 14px;
`

const SiteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const SiteCard = styled.div`
  background: #f8faff;
  border: 1px solid #dbe5f2;
  border-radius: 10px;
  padding: 14px;
`

const SiteName = styled.div`
  color: #1f2f45;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
`

const SiteMetric = styled.div`
  color: #1875f0;
  font-size: 24px;
  font-weight: 700;
`

const SiteSub = styled.div`
  color: #5e5e5e;
  font-size: 12px;
  margin-top: 4px;
`

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`

const EmptyItem = ({ children }) => (
  <PlaceholderItem>{children}</PlaceholderItem>
)

const MockDashboard = ({ events, notifications, sales, loading, error }) => (
  <>
    <DashboardGrid>
      <Panel>
        <PanelTitle>Calendar of Events</PanelTitle>
        <PlaceholderList>
          {loading && <EmptyItem>Loading events...</EmptyItem>}
          {!loading && events.length === 0 && <EmptyItem>No events available.</EmptyItem>}
          {!loading && events.map((item) => (
            <PlaceholderItem key={item.id}>{`${item.title} - ${item.time}`}</PlaceholderItem>
          ))}
        </PlaceholderList>
      </Panel>
      <Panel>
        <PanelTitle>Important System Notifications</PanelTitle>
        <PlaceholderList>
          {loading && <EmptyItem>Loading notifications...</EmptyItem>}
          {!loading && notifications.length === 0 && <EmptyItem>No notifications available.</EmptyItem>}
          {!loading && notifications.map((item) => (
            <PlaceholderItem key={item.id}>{item.message}</PlaceholderItem>
          ))}
        </PlaceholderList>
      </Panel>
    </DashboardGrid>

    <SalesPanel>
      <SalesTitle>Sales</SalesTitle>
      <SiteGrid>
        {['site1', 'site2', 'site3'].map((siteKey, index) => {
          const siteData = sales[siteKey] || {}
          return (
            <SiteCard key={siteKey}>
              <SiteName>{siteData.site || `Site ${index + 1}`}</SiteName>
              <SiteMetric>{formatMoney(siteData.total_sales)}</SiteMetric>
              <SiteSub>{`${siteData.transactions || 0} transactions`}</SiteSub>
            </SiteCard>
          )
        })}
      </SiteGrid>
      {error && <SiteSub style={{ marginTop: '12px' }}>{error}</SiteSub>}
    </SalesPanel>
  </>
)

const StyledNote = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #5e5e5e;
  display: flex;
  align-items: center;
`

const HomePage = () => {
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [sales, setSales] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [eventsRes, notificationsRes, site1, site2, site3] = await Promise.all([
          RestClient.get('/events'),
          RestClient.get('/notifications'),
          RestClient.get('/sales/site1'),
          RestClient.get('/sales/site2'),
          RestClient.get('/sales/site3'),
        ])

        if (cancelled) return

        setEvents(eventsRes && eventsRes.events ? eventsRes.events : [])
        setNotifications(notificationsRes && notificationsRes.notifications ? notificationsRes.notifications : [])
        setSales({
          site1: site1 || {},
          site2: site2 || {},
          site3: site3 || {},
        })
      } catch (err) {
        if (cancelled) return
        setError('Unable to load mock dashboard data from backend.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageContent
      title={
        <StyledContainer>
          Dashboard
          <StyledNote>Mock Placeholder (backend-wired)</StyledNote>
        </StyledContainer>
      }
    >
      <MockDashboard
        events={events}
        notifications={notifications}
        sales={sales}
        loading={loading}
        error={error}
      />
    </PageContent>
  )
}

export default HomePage
