import { useEffect, useMemo, useState } from 'react'
import { apiBase, getJson } from 'hooks/http/httpClient'

const toISODate = (dateObj) => {
  const y = dateObj.getFullYear()
  const m = `${dateObj.getMonth() + 1}`.padStart(2, '0')
  const d = `${dateObj.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

const expandEventDays = (eventItem) => {
  const dates = []
  const start = new Date(`${eventItem.start_date}T00:00:00`)
  const end = new Date(`${eventItem.end_date}T00:00:00`)
  let cursor = new Date(start.getTime())

  while (cursor <= end) {
    dates.push(toISODate(cursor))
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  }

  return dates
}

const fetchFromConfiguredBase = async (path) => ({ data: await getJson(path), base: apiBase })

const buildEventsByDate = (events) => events.reduce((acc, eventItem) => {
  const dates = expandEventDays(eventItem)
  dates.forEach((dateIso) => {
    if (!acc[dateIso]) acc[dateIso] = []
    acc[dateIso].push(eventItem)
  })
  return acc
}, {})

export const formatEventRange = (start, end) => {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  const sameDay = start === end
  const sameMonth = startDate.getMonth() === endDate.getMonth()
  const startMonth = startDate.toLocaleString('en-US', { month: 'short' })
  const endMonth = endDate.toLocaleString('en-US', { month: 'short' })

  if (sameDay) return `${startMonth} ${startDate.getDate()}`
  if (sameMonth) return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`
  return `${startMonth} ${startDate.getDate()}-${endMonth} ${endDate.getDate()}`
}

export const useDashboardData = () => {
  const [events, setEvents] = useState([])
  const [sales, setSales] = useState({})
  const [inventorySummary, setInventorySummary] = useState({
    totalGlobalUnits: 0,
    lines: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeApiBase, setActiveApiBase] = useState(apiBase || '')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      if (!apiBase) {
        setEvents([])
        setSales({})
        setInventorySummary({ totalGlobalUnits: 0, lines: [] })
        setError('Missing REACT_APP_REST_API_ENDPOINT in app environment.')
        setLoading(false)
        return
      }

      const result = await Promise.allSettled([
        fetchFromConfiguredBase('/events'),
        fetchFromConfiguredBase('/sales/sites/site1/summary'),
        fetchFromConfiguredBase('/sales/sites/site2/summary'),
        fetchFromConfiguredBase('/sales/sites/site3/summary'),
        fetchFromConfiguredBase('/stock/inventory/global'),
      ])

      if (cancelled) return

      const [eventsRes, site1, site2, site3, inventoryRes] = result

      if (eventsRes.status === 'fulfilled') {
        setEvents(
          eventsRes.value && eventsRes.value.data && eventsRes.value.data.events
            ? eventsRes.value.data.events
            : [],
        )
        setActiveApiBase(eventsRes.value.base || apiBase)
      } else {
        setEvents([])
      }

      setSales({
        site1: site1.status === 'fulfilled' ? ((site1.value && site1.value.data) || {}) : {},
        site2: site2.status === 'fulfilled' ? ((site2.value && site2.value.data) || {}) : {},
        site3: site3.status === 'fulfilled' ? ((site3.value && site3.value.data) || {}) : {},
      })

      if (inventoryRes.status === 'fulfilled') {
        const items = (
          inventoryRes.value
          && inventoryRes.value.data
          && inventoryRes.value.data.items
          ? inventoryRes.value.data.items
          : []
        )
        const lineTotals = items.reduce((acc, item) => {
          const lineName = String(item.product_line_name || 'Unassigned').trim() || 'Unassigned'
          const qty = Number(item.master_qty_on_hand || 0)
          if (!acc[lineName]) acc[lineName] = 0
          acc[lineName] += qty
          return acc
        }, {})
        const lines = Object.entries(lineTotals)
          .map(([productLine, units]) => ({ productLine, units }))
          .sort((left, right) => left.productLine.localeCompare(right.productLine))
        const totalGlobalUnits = lines.reduce((sum, row) => sum + Number(row.units || 0), 0)
        setInventorySummary({ totalGlobalUnits, lines })
      } else {
        setInventorySummary({ totalGlobalUnits: 0, lines: [] })
      }

      const failedEndpoints = []
      if (eventsRes.status === 'rejected') failedEndpoints.push('/events')
      if (site1.status === 'rejected') failedEndpoints.push('/sales/sites/site1/summary')
      if (site2.status === 'rejected') failedEndpoints.push('/sales/sites/site2/summary')
      if (site3.status === 'rejected') failedEndpoints.push('/sales/sites/site3/summary')
      if (inventoryRes.status === 'rejected') failedEndpoints.push('/stock/inventory/global')

      if (failedEndpoints.length) {
        setError(`Unable to load: ${failedEndpoints.join(', ')} (base: ${apiBase})`)
      }

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const eventsByDate = useMemo(() => buildEventsByDate(events), [events])
  const calendarMonthLabel = useMemo(
    () => new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    [],
  )

  return {
    events,
    eventsByDate,
    sales,
    inventorySummary,
    loading,
    error,
    activeApiBase,
    calendarMonthLabel,
  }
}
