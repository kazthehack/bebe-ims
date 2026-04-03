import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ALERTS_POLL_INTERVAL } from 'constants/Settings'
import { getNotifications } from 'api/imsBridge'

const withTotalUnseenCount = C => (props) => {
  const { selectedVenueId } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalUnseenCount, setTotalUnseenCount] = useState(0)
  const pollRef = useRef(null)

  const load = useCallback(async () => {
    if (!selectedVenueId) return
    setLoading(true)
    setError(null)
    try {
      const result = await getNotifications({ pageSize: 500, pagesSkipped: 0, filter: { isDismissed: true } })
      setTotalUnseenCount(result.totalUnseenCount)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [selectedVenueId])

  useEffect(() => {
    load()
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [load])

  const totalUnseenCountData = useMemo(() => ({
    loading,
    error,
    store: {
      portalNotifications: {
        totalUnseenCount,
      },
    },
    refetch: load,
    startPolling: (interval = ALERTS_POLL_INTERVAL) => {
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(() => {
        load()
      }, interval)
    },
    stopPolling: () => {
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
    },
  }), [loading, error, totalUnseenCount, load])

  return <C {...props} totalUnseenCount={totalUnseenCount} totalUnseenCountData={totalUnseenCountData} />
}

export default withTotalUnseenCount
