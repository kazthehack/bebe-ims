import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getNotifications } from 'api/imsBridge'

const withAlerts = C => (props) => {
  const { selectedVenueId, tablePage, tableFilter, tableSearchTerm } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const load = useCallback(async (override = {}) => {
    if (!selectedVenueId) return
    setLoading(true)
    setError(null)
    try {
      const pagesSkipped = override.pagesSkipped !== undefined
        ? override.pagesSkipped
        : (tablePage !== undefined ? tablePage : 0)
      const result = await getNotifications({
        pageSize: override.pageSize || 50,
        pagesSkipped,
        filter: {
          isDismissed: true,
          level: tableFilter || undefined,
          search: tableSearchTerm || undefined,
        },
      })

      setNotifications(result.edges.map(e => e.node))
      setTotalCount(result.totalCount)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [selectedVenueId, tablePage, tableFilter, tableSearchTerm])

  useEffect(() => {
    load()
  }, [load])

  const storeAlertsData = useMemo(() => ({
    loading,
    error,
    store: {
      portalNotifications: {
        edges: notifications.map(node => ({ node })),
        totalCount,
      },
    },
    refetch: (params = {}) => load(params),
    fetchMore: async ({ variables } = {}) => {
      const safeVariables = variables || {}
      const result = await getNotifications({
        pageSize: safeVariables.pageSize || 50,
        pagesSkipped: safeVariables.pagesSkipped || 0,
        filter: {
          isDismissed: true,
          level: tableFilter || undefined,
          search: tableSearchTerm || undefined,
        },
      })
      const more = result.edges.map(e => e.node)
      setNotifications(prev => [...prev, ...more])
      setTotalCount(result.totalCount)
      return {
        store: {
          portalNotifications: {
            edges: result.edges,
            totalCount: result.totalCount,
          },
        },
      }
    },
  }), [loading, error, notifications, totalCount, load, tableFilter, tableSearchTerm])

  return (
    <C
      {...props}
      storeAlerts={notifications}
      totalNumAlerts={totalCount}
      storeAlertsData={storeAlertsData}
    />
  )
}

export default withAlerts
