import { useCallback, useEffect, useState } from 'react'
import { apiBase, deleteJson, getBlob, getJson, postJson, putJson, tenantQuery } from 'hooks/http/httpClient'

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

  const createReceipt = useCallback(async (payload) => {
    await postJson(`/receipts?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const getReceipt = useCallback(async (receiptId) => (
    getJson(`/receipts/${encodeURIComponent(receiptId)}?${tenantQuery(tenantId)}`)
  ), [tenantId])

  const resolveVariantByQr = useCallback(async (qrCode) => (
    getJson(`/products/variants/resolve/${encodeURIComponent(String(qrCode || '').trim())}?${tenantQuery(tenantId)}`)
  ), [tenantId])

  return {
    receipts,
    loading,
    error,
    createReceipt,
    getReceipt,
    resolveVariantByQr,
    reload: load,
  }
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
    const created = await postJson(`/sessions/web-pos?${tenantQuery(tenantId)}`, payload)
    await load()
    return created
  }

  const closeSession = async (sessionId, payload = {}) => {
    const closed = await postJson(`/sessions/web-pos/${encodeURIComponent(sessionId)}/close?${tenantQuery(tenantId)}`, payload)
    await load()
    return closed
  }

  return {
    sessions,
    loading,
    error,
    createSession,
    closeSession,
    reload: load,
  }
}

export const useSitesResource = (tenantId = 'tenant-admin') => {
  const [sites, setSites] = useState([])
  const [siteEventsById, setSiteEventsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const sortSites = (items) => (items || []).slice().sort((left, right) => {
    const leftName = String((left && left.name) || '').trim().toLowerCase()
    const rightName = String((right && right.name) || '').trim().toLowerCase()
    if (leftName !== rightName) return leftName.localeCompare(rightName)
    const leftCode = String((left && left.code) || '').trim().toLowerCase()
    const rightCode = String((right && right.code) || '').trim().toLowerCase()
    if (leftCode !== rightCode) return leftCode.localeCompare(rightCode)
    return String((left && left.id) || '').localeCompare(String((right && right.id) || ''), undefined, { sensitivity: 'base' })
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/sites?${tenantQuery(tenantId)}`)
      setSites(sortSites(data.sites || []))
    } catch (err) {
      setError(err.message || 'Failed to load sites.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createSite = useCallback(async (payload) => {
    await postJson(`/sites?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const updateSite = useCallback(async (siteId, payload) => {
    await putJson(`/sites/${encodeURIComponent(siteId)}?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const loadSiteEvents = useCallback(async (siteId) => {
    const data = await getJson(`/sites/${encodeURIComponent(siteId)}/events?${tenantQuery(tenantId)}`)
    const events = data.events || []
    setSiteEventsById((prev) => ({ ...prev, [siteId]: events }))
    return events
  }, [tenantId])

  const assignEventToSite = useCallback(async ({ siteId, eventId, makeActive = true }) => {
    await postJson(`/sites/${encodeURIComponent(siteId)}/events/assign?${tenantQuery(tenantId)}`, {
      event_id: eventId,
      make_active: Boolean(makeActive),
    })
    await load()
    await loadSiteEvents(siteId)
  }, [tenantId, load, loadSiteEvents])

  const returnAllInventoryToGlobal = useCallback(async (siteId) => {
    const result = await postJson(`/sites/${encodeURIComponent(siteId)}/inventory/return-all?${tenantQuery(tenantId)}`, {})
    await load()
    return result
  }, [tenantId, load])

  const closeSiteEvent = useCallback(async (siteId, eventId) => {
    const result = await postJson(`/sites/${encodeURIComponent(siteId)}/events/${encodeURIComponent(eventId)}/close?${tenantQuery(tenantId)}`, {})
    await load()
    await loadSiteEvents(siteId)
    return result
  }, [tenantId, load, loadSiteEvents])

  return {
    apiBase,
    sites,
    siteEventsById,
    loading,
    error,
    createSite,
    updateSite,
    loadSiteEvents,
    assignEventToSite,
    returnAllInventoryToGlobal,
    closeSiteEvent,
    reload: load,
  }
}

export const useEventsResource = (tenantId = 'tenant-admin') => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/events?${tenantQuery(tenantId)}`)
      setEvents(data.events || [])
    } catch (err) {
      setError(err.message || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createEvent = async (payload) => {
    await postJson(`/events?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  const updateEvent = async (eventId, payload) => {
    await putJson(`/events/${encodeURIComponent(eventId)}?${tenantQuery(tenantId)}`, payload)
    await load()
  }

  const deleteEvent = async (eventId) => {
    await deleteJson(`/events/${encodeURIComponent(eventId)}?${tenantQuery(tenantId)}`)
    await load()
  }

  return {
    apiBase,
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    reload: load,
  }
}

export const useInventoryResource = (tenantId = 'tenant-admin') => {
  const [globalItems, setGlobalItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadGlobal = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJson(`/stock/inventory/global?${tenantQuery(tenantId)}`)
      setGlobalItems(data.items || [])
    } catch (err) {
      setError(err.message || 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    loadGlobal()
  }, [loadGlobal])

  const loadSite = useCallback(async (siteId) => {
    return getJson(`/stock/inventory/sites/${encodeURIComponent(siteId)}?${tenantQuery(tenantId)}`)
  }, [tenantId])

  const loadVariantDetail = useCallback(async (variantId) => {
    return getJson(`/stock/inventory/variants/${encodeURIComponent(variantId)}?${tenantQuery(tenantId)}`)
  }, [tenantId])

  const loadInventoryDetail = useCallback(async (inventoryId) => {
    return getJson(`/stock/inventory/items/${encodeURIComponent(inventoryId)}?${tenantQuery(tenantId)}`)
  }, [tenantId])

  const loadInventoryAdjustments = useCallback(async (productVariantId) => {
    const query = tenantQuery(tenantId)
    const [stockData, adjustmentData] = await Promise.all([
      getJson(`/stock/products?${query}`),
      getJson(`/stock/adjustments?${query}`),
    ])
    const stockIds = new Set(
      (stockData.items || [])
        .filter((item) => item.product_variant_id === productVariantId)
        .map((item) => item.id),
    )
    return (adjustmentData.adjustments || [])
      .filter((item) => String(item.target_type || '').toLowerCase() === 'product_stock')
      .filter((item) => stockIds.has(item.target_id))
      .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))
  }, [tenantId])

  const dispatchToSite = async ({ product_variant_id, site_id, qty }) => {
    const result = await postJson(`/stock/inventory/dispatch?${tenantQuery(tenantId)}`, {
      product_variant_id,
      site_id,
      qty,
    })
    await loadGlobal()
    return result
  }

  const receiveToMain = async ({ product_variant_id, qty }) => {
    const result = await postJson(`/stock/inventory/receive?${tenantQuery(tenantId)}`, {
      product_variant_id,
      qty,
    })
    await loadGlobal()
    return result
  }

  const transferInventory = async ({
    product_variant_id,
    source_site_id,
    destination_site_id,
    qty,
  }) => {
    const result = await postJson(`/stock/inventory/transfer?${tenantQuery(tenantId)}`, {
      product_variant_id,
      source_site_id,
      destination_site_id,
      qty,
    })
    await loadGlobal()
    return result
  }

  const adjustGlobalInventory = async ({
    product_variant_id,
    qty_delta,
    notes,
  }) => {
    const result = await postJson(`/stock/inventory/global-adjust?${tenantQuery(tenantId)}`, {
      product_variant_id,
      qty_delta,
      notes,
    })
    await loadGlobal()
    return result
  }

  const exportInventoryWorkbook = async () => {
    const { blob, headers } = await getBlob(`/stock/inventory/export?${tenantQuery(tenantId)}`)
    const contentDisposition = headers.get('content-disposition') || ''
    const match = contentDisposition.match(/filename="?([^";]+)"?/i)
    const fileName = (match && match[1]) || `bebe_inventory_export_${Date.now()}.xlsm`
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(objectUrl)
  }

  return {
    apiBase,
    globalItems,
    loading,
    error,
    loadSite,
    loadVariantDetail,
    loadInventoryDetail,
    loadInventoryAdjustments,
    dispatchToSite,
    receiveToMain,
    transferInventory,
    adjustGlobalInventory,
    exportInventoryWorkbook,
    reload: loadGlobal,
  }
}

export const usePartnersResource = (tenantId = 'tenant-admin') => {
  const [partnerships, setPartnerships] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = tenantQuery(tenantId)
      const [partnershipData, requestData] = await Promise.all([
        getJson(`/partners/partnerships?${query}`),
        getJson(`/partners/requests?${query}`),
      ])
      setPartnerships(partnershipData.partnerships || [])
      setRequests(requestData.requests || [])
    } catch (err) {
      setError(err.message || 'Failed to load partners resources.')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    load()
  }, [load])

  const createPartnership = useCallback(async (payload) => {
    await postJson(`/partners/partnerships?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const updatePartnership = useCallback(async (partnershipId, payload) => {
    await putJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const deletePartnership = useCallback(async (partnershipId) => {
    await deleteJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}?${tenantQuery(tenantId)}`)
    await load()
  }, [tenantId, load])

  const createRequest = useCallback(async (payload) => {
    await postJson(`/partners/requests?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const updateRequest = useCallback(async (requestId, payload) => {
    await putJson(`/partners/requests/${encodeURIComponent(requestId)}?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  const deleteRequest = useCallback(async (requestId) => {
    await deleteJson(`/partners/requests/${encodeURIComponent(requestId)}?${tenantQuery(tenantId)}`)
    await load()
  }, [tenantId, load])

  const getPartnership = useCallback(async (partnershipId) => (
    getJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}?${tenantQuery(tenantId)}`)
  ), [tenantId])

  const getRequest = useCallback(async (requestId) => (
    getJson(`/partners/requests/${encodeURIComponent(requestId)}?${tenantQuery(tenantId)}`)
  ), [tenantId])

  const getPartnershipRemittances = useCallback(async (partnershipId) => (
    getJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}/remittances?${tenantQuery(tenantId)}`)
  ), [tenantId])

  const getPartnershipRequests = useCallback(async (partnershipId) => (
    getJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}/requests?${tenantQuery(tenantId)}`)
  ), [tenantId])

  const createRemittance = useCallback(async (partnershipId, payload) => {
    await postJson(`/partners/partnerships/${encodeURIComponent(partnershipId)}/remittances?${tenantQuery(tenantId)}`, payload)
    await load()
  }, [tenantId, load])

  return {
    apiBase,
    partnerships,
    requests,
    loading,
    error,
    createPartnership,
    updatePartnership,
    deletePartnership,
    createRequest,
    updateRequest,
    deleteRequest,
    getPartnership,
    getRequest,
    getPartnershipRemittances,
    getPartnershipRequests,
    createRemittance,
    reload: load,
  }
}
