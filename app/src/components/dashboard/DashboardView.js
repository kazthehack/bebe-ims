import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import styled from 'styled-components'

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

const CalendarHeader = styled.div`
  color: #1f2f45;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
`

const CalendarWrapper = styled.div`
  .react-datepicker {
    width: 100%;
    border: 1px solid #dde4ee;
    border-radius: 10px;
    font-family: inherit;
  }

  .react-datepicker__month-container {
    width: 100%;
    float: none;
  }

  .react-datepicker__header {
    background: #f8faff;
    border-bottom: 1px solid #dde4ee;
    padding-top: 10px;
  }

  .react-datepicker__current-month {
    color: #1f2f45;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    margin: 0;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: auto;
    margin: 0;
    min-height: 74px;
    border: 1px solid #eef2f7;
    border-radius: 0;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    padding: 0;
    line-height: normal;
  }

  .react-datepicker__day-name {
    min-height: auto;
    border: none;
    color: #5e5e5e;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 0;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: #eaf2fe;
    color: inherit;
  }

  .dashboard-day--today .dashboard-day-content {
    background: #1875f0;
  }

  .dashboard-day--outside .dashboard-day-content {
    background: #f7f9fc;
  }
`

const DayContent = styled.div`
  width: 100%;
  min-height: 74px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  color: #1f2f45;
`

const DayNumber = styled.div`
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 3px;
`

const DayEvent = styled.div`
  font-size: 9px;
  line-height: 1.2;
  padding: 1px 4px;
  border-radius: 6px;
  margin-bottom: 2px;
  background: #eaf2fe;
  color: #1f2f45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DayMore = styled.div`
  font-size: 9px;
  line-height: 1.2;
  padding: 1px 4px;
  border-radius: 6px;
  margin-bottom: 2px;
  background: #dfe8f6;
  color: #1f2f45;
  font-weight: 700;
`

const CalendarMeta = styled.div`
  margin-top: 8px;
  color: #5e5e5e;
  font-size: 12px;
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

const SiteBreakdown = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 4px;
`

const SiteBreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: #4d4d4d;
  font-size: 12px;
`

const formatMoney = (value, currency = 'PHP') => {
  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: currency || 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0))
  } catch (error) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0))
  }
}

const toISODate = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = `${dateObj.getMonth() + 1}`.padStart(2, '0')
  const day = `${dateObj.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const EmptyItem = ({ children }) => (
  <PlaceholderItem>{children}</PlaceholderItem>
)

const InventoryStatWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 14px;
`

const InventoryStatCard = styled.div`
  min-width: 220px;
  border: 1px solid #dbe5f2;
  border-radius: 10px;
  background: #f8faff;
  text-align: center;
  padding: 12px 16px;
`

const InventoryStatValue = styled.div`
  color: #1875f0;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
`

const InventoryStatLabel = styled.div`
  color: #5e5e5e;
  font-size: 12px;
  text-transform: uppercase;
  margin-top: 6px;
`

const InventoryTable = styled.div`
  display: grid;
  gap: 6px;
`

const InventoryHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  padding: 0 10px;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
`

const InventoryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  min-height: 46px;
  align-items: center;
`

const InventoryCell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const DashboardView = ({
  calendarMonthLabel,
  events,
  eventsByDate,
  sales,
  inventorySummary,
  loading,
  error,
}) => {
  const currentMonth = new Date()
  const MAX_EVENTS_PER_DAY = 3

  return (
    <>
      <DashboardGrid>
        <Panel>
          <PanelTitle>Calendar of Events</PanelTitle>
          <CalendarHeader>{calendarMonthLabel}</CalendarHeader>
          <CalendarWrapper>
            <DatePicker
              inline
              selected={currentMonth}
              openToDate={currentMonth}
              showPopperArrow={false}
              fixedHeight
              renderDayContents={(dayOfMonth, date) => {
                const dateIso = toISODate(date)
                const dayEvents = eventsByDate[dateIso] || []
                const visibleEvents = dayEvents.slice(0, MAX_EVENTS_PER_DAY)
                const hiddenCount = Math.max(0, dayEvents.length - visibleEvents.length)
                return (
                  <DayContent className="dashboard-day-content">
                    <DayNumber>{dayOfMonth}</DayNumber>
                    {visibleEvents.map(item => (
                      <DayEvent key={`${dateIso}-${item.id}`}>{item.title}</DayEvent>
                    ))}
                    {hiddenCount > 0 && <DayMore>{`+${hiddenCount} more`}</DayMore>}
                  </DayContent>
                )
              }}
              dayClassName={(date) => {
                const classNames = []
                if (date.getMonth() !== currentMonth.getMonth()) classNames.push('dashboard-day--outside')
                if (toISODate(date) === toISODate(new Date())) classNames.push('dashboard-day--today')
                return classNames.join(' ')
              }}
            />
          </CalendarWrapper>
          <CalendarMeta>
            {loading && 'Loading events...'}
            {!loading && events.length === 0 && 'No events available for this month.'}
          </CalendarMeta>
        </Panel>

        <Panel>
          <PanelTitle>Inventory Sneak Peek</PanelTitle>
          <InventoryStatWrap>
            <InventoryStatCard>
              <InventoryStatValue>{Number(inventorySummary.totalGlobalUnits || 0).toFixed(0)}</InventoryStatValue>
              <InventoryStatLabel>Global Units</InventoryStatLabel>
            </InventoryStatCard>
          </InventoryStatWrap>
          <InventoryTable>
            <InventoryHeader>
              <div>Per Product Line</div>
              <div>Units</div>
            </InventoryHeader>
            {loading && <EmptyItem>Loading inventory...</EmptyItem>}
            {!loading && (inventorySummary.lines || []).map((row) => (
              <InventoryRow key={row.productLine}>
                <InventoryCell>{row.productLine}</InventoryCell>
                <InventoryCell>{Number(row.units || 0).toFixed(0)}</InventoryCell>
              </InventoryRow>
            ))}
            {!loading && !(inventorySummary.lines || []).length && (
              <EmptyItem>No inventory records available.</EmptyItem>
            )}
          </InventoryTable>
        </Panel>
      </DashboardGrid>

      <SalesPanel>
        <SalesTitle>Sales</SalesTitle>
        <SiteGrid>
          {['site1', 'site2', 'site3'].map((siteKey, index) => {
            const siteData = sales[siteKey] || {}
            const currency = siteData.currency || 'PHP'
            return (
              <SiteCard key={siteKey}>
                <SiteName>{siteData.site || `Site ${index + 1}`}</SiteName>
                <SiteMetric>{formatMoney(siteData.gross, currency)}</SiteMetric>
                <SiteSub>Gross</SiteSub>
                <SiteBreakdown>
                  <SiteBreakdownItem>
                    <span>Rent</span>
                    <span>{formatMoney(siteData.rent, currency)}</span>
                  </SiteBreakdownItem>
                  <SiteBreakdownItem>
                    <span>Operations</span>
                    <span>{formatMoney(siteData.operations, currency)}</span>
                  </SiteBreakdownItem>
                </SiteBreakdown>
              </SiteCard>
            )
          })}
        </SiteGrid>
        {error && <SiteSub style={{ marginTop: '12px' }}>{error}</SiteSub>}
      </SalesPanel>
    </>
  )
}

EmptyItem.propTypes = {
  children: PropTypes.node,
}

DashboardView.propTypes = {
  calendarMonthLabel: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
  })).isRequired,
  eventsByDate: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    })),
  ).isRequired,
  inventorySummary: PropTypes.shape({
    totalGlobalUnits: PropTypes.number,
    lines: PropTypes.arrayOf(PropTypes.shape({
      productLine: PropTypes.string,
      units: PropTypes.number,
    })),
  }).isRequired,
  sales: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
}

export default DashboardView
