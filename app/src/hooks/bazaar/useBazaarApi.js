import { useCallback, useEffect, useState } from 'react'
import { apiBase, getJson, postJson, tenantQuery } from 'hooks/http/httpClient'

export const useStockResource = (tenantId = 'tenant-admin') => {
  const [productStock, setProductStock] = useState([])
  const [supplies, setSupplies] = useState([])
  const [filaments, setFilaments] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = tenantQuery(tenantId)
      const [stockData, suppliesData, filamentsData, adjustmentsData] = await Promise.all([
        getJson(`/stock/products?${query}`),
        getJson(`/stock/supplies?${query}`),
        getJson(`/stock/filaments?${query}`),
        getJson(`/stock/adjustments?${query}`),
      ])
      setProductStock(stockData.items || [])
      setSupplies(suppliesData.supplies || [])
      setFilaments(filamentsData.filaments || [])
      setAdjustments(adjustmentsData.adjustments || [])
    } catch (err) {
      setError(err.message || 'Failed to load stock resources.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createProductStock = async (payload) => {
    await postJson(`/stock/products?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  const createSupply = async (payload) => {
    await postJson(`/stock/supplies?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  const createFilament = async (payload) => {
    await postJson(`/stock/filaments?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  const createAdjustment = async (payload) => {
    await postJson(`/stock/adjustments?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  return {
    apiBase,
    loading,
    error,
    productStock,
    supplies,
    filaments,
    adjustments,
    createProductStock,
    createSupply,
    createFilament,
    createAdjustment,
    reload: load,
  }
}

export const useReceiptsResource = (tenantId = 'tenant-admin') => {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/receipts?${tenantQuery(tenantId)}`)
      setReceipts(data.receipts || [])
    } catch (err) {
      setError(err.message || 'Failed to load receipts.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createReceipt = async (payload) => {
    await postJson(`/receipts?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  return { receipts, loading, error, createReceipt, reload: load }
}

export const useSessionsResource = (tenantId = 'tenant-admin') => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/sessions/web-pos?${tenantQuery(tenantId)}`)
      setSessions(data.sessions || [])
    } catch (err) {
      setError(err.message || 'Failed to load sessions.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createSession = async (payload) => {
    await postJson(`/sessions/web-pos?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  return { sessions, loading, error, createSession, reload: load }
}
