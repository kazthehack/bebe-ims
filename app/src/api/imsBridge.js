import { AuthApi, ObjectApi } from './client'

const DEFAULT_TENANT_ID = process.env.REACT_APP_TENANT_ID || 'tenant-admin'
const DEFAULT_STORE_ID = process.env.REACT_APP_DEFAULT_STORE_ID || 'store-admin'

const nowIso = () => new Date().toISOString()

const toEdge = node => ({ node })
const money = value => `$${Number(value || 0).toFixed(2)}`

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const defaultPermissions = [
  'READ_STORE_REPORTS',
  'READ_INVENTORY',
  'WRITE_INVENTORY',
  'READ_BASIC_SETTINGS',
  'WRITE_BASIC_SETTINGS',
  'READ_ADMIN_SETTINGS',
  'WRITE_ADMIN_SETTINGS',
]

const normalizeObjectNode = (record) => ({
  id: record.object_id,
  ...record.payload,
})

export const getStoreId = () => {
  try {
    return sessionStorage.getItem('storeId') || localStorage.getItem('storeId') || DEFAULT_STORE_ID
  } catch (err) {
    return DEFAULT_STORE_ID
  }
}

export const getTenantId = () => {
  try {
    return localStorage.getItem('tenantId') || DEFAULT_TENANT_ID
  } catch (err) {
    return DEFAULT_TENANT_ID
  }
}

export const authLogin = async (email, password) => {
  const username = `${email || ''}`.trim().toLowerCase()
  const auth = await AuthApi.login(getTenantId(), username, password)

  const authToken = {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    expires: auth.expires,
  }

  try {
    localStorage.setItem('tenantId', auth.tenant_id)
    localStorage.setItem('storeId', auth.store_id)
    localStorage.setItem('ownerId', auth.owner_id)
    sessionStorage.setItem('tenantId', auth.tenant_id)
    sessionStorage.setItem('storeId', auth.store_id)
    sessionStorage.setItem('ownerId', auth.owner_id)
    sessionStorage.setItem('currentUserEmail', username)
  } catch (err) {
    // ignore storage errors
  }

  return {
    authToken,
    tenantId: auth.tenant_id,
    storeId: auth.store_id,
    ownerId: auth.owner_id,
  }
}

export const verifyPasswordEmailToken = async ({ passwordResetToken }) => {
  return AuthApi.verifyPasswordToken(getTenantId(), passwordResetToken)
}

export const resetPassword = async ({ resetPasswordToken, newPassword }) => {
  return AuthApi.resetPassword(getTenantId(), resetPasswordToken, newPassword)
}

export const sendResetPasswordEmail = async ({ employeeEmail }) => {
  return AuthApi.sendResetPasswordEmail(getTenantId(), employeeEmail)
}

export const getStores = async () => {
  const tenantId = getTenantId()
  const records = await ObjectApi.list('store', tenantId)

  if (!records.length) {
    const fallback = {
      name: 'Default Store',
      owner: { id: 'employee-owner' },
      settings: { timezone: 'America/Los_Angeles' },
    }
    await ObjectApi.create('store', tenantId, fallback)
    const retry = await ObjectApi.list('store', tenantId)
    return retry.map(normalizeObjectNode)
  }

  return records.map(normalizeObjectNode)
}

export const getStoreSettings = async (storeId) => {
  const tenantId = getTenantId()
  const safeStoreId = storeId || getStoreId()
  const found = await ObjectApi.get('store', safeStoreId, tenantId).catch(() => null)
  if (found) {
    return {
      id: found.object_id,
      ...found.payload,
      owner: found.payload.owner || { id: 'employee-owner' },
      settings: {
        timezone: 'America/Los_Angeles',
        ...(found.payload.settings || {}),
      },
    }
  }

  return {
    id: safeStoreId,
    name: 'Default Store',
    owner: { id: 'employee-owner' },
    settings: {
      timezone: 'America/Los_Angeles',
    },
  }
}

export const getAuthenticatedEmployee = async (storeId) => {
  const email = (() => {
    try {
      return sessionStorage.getItem('currentUserEmail') || 'admin@example.com'
    } catch (err) {
      return 'admin@example.com'
    }
  })()

  return {
    viewer: {
      id: (() => {
        try {
          return localStorage.getItem('ownerId') || 'employee-current'
        } catch (err) {
          return 'employee-current'
        }
      })(),
      email,
      stores: [toEdge({ id: storeId || getStoreId(), name: 'Default Store' })],
      portalRoles: [
        {
          id: 'portal-role-admin',
          permissions: defaultPermissions,
        },
      ],
      posRoles: [
        {
          id: 'pos-role-admin',
          permissions: defaultPermissions,
        },
      ],
    },
  }
}

const listNotifications = async () => {
  const tenantId = getTenantId()
  const rows = await ObjectApi.list('notification', tenantId)
  return rows.map((row) => ({
    id: row.object_id,
    seen: !!row.payload.seen,
    dismissedAt: row.payload.dismissedAt || null,
    message: row.payload.message || 'System notification',
    level: row.payload.level || 'info',
    timestamp: row.payload.timestamp || nowIso(),
    ...row.payload,
  }))
}

export const getNotifications = async ({ pageSize = 50, pagesSkipped = 0, filter = {} } = {}) => {
  const all = await listNotifications()
  const filtered = all.filter((n) => {
    if (filter.level && n.level !== filter.level) return false
    if (filter.search && !`${n.message}`.toLowerCase().includes(String(filter.search).toLowerCase())) return false
    if (typeof filter.isDismissed === 'boolean' && filter.isDismissed && n.dismissedAt) return false
    return true
  })

  const start = pagesSkipped * pageSize
  const paged = filtered.slice(start, start + pageSize)
  return {
    edges: paged.map(toEdge),
    totalCount: filtered.length,
    totalUnseenCount: filtered.filter(n => !n.seen).length,
  }
}

export const setNotificationDismissal = async ({ notificationId, when }) => {
  const tenantId = getTenantId()
  const existing = await ObjectApi.get('notification', notificationId, tenantId).catch(() => null)
  const existingPayload = existing && existing.payload ? existing.payload : {}
  const payload = { ...existingPayload, dismissedAt: when || nowIso(), seen: true }
  await ObjectApi.update('notification', notificationId, tenantId, payload)
  return { success: true }
}

export const dismissAllNotifications = async ({ when }) => {
  const tenantId = getTenantId()
  const notes = await listNotifications()
  await Promise.all(notes.map(n => ObjectApi.update('notification', n.id, tenantId, {
    ...n,
    dismissedAt: when || nowIso(),
    seen: true,
  })))
  return { success: true }
}

export const setNotificationsSeen = async () => {
  const tenantId = getTenantId()
  const notes = await listNotifications()
  await Promise.all(notes.map(n => ObjectApi.update('notification', n.id, tenantId, {
    ...n,
    seen: true,
  })))
  return { success: true }
}

const getSaleTimestamp = payload => (
  payload.completedAt ||
  payload.createdAt ||
  payload.created_at ||
  payload.timestamp ||
  null
)

const extractLineItems = (payload) => (
  payload.lineItems ||
  payload.items ||
  payload.products ||
  []
)

const extractSaleAmount = payload => (
  toNumber(
    payload.total ||
    payload.grandTotal ||
    payload.saleTotal ||
    payload.amount ||
    payload.totalAmount ||
    0,
  )
)

const extractDiscountAmount = payload => (
  toNumber(
    payload.discountTotal ||
    payload.discounts ||
    0,
  )
)

const extractRewardAmount = payload => (
  toNumber(
    payload.rewardTotal ||
    payload.rewards ||
    0,
  )
)

const extractRefundAmount = payload => {
  const refundTotal = toNumber(payload.refundTotal || payload.refunds || 0)
  if (refundTotal > 0) return refundTotal
  return `${payload.type || ''}`.toLowerCase() === 'refund'
    ? extractSaleAmount(payload)
    : 0
}

export const getTodaysMetrics = async ({ storeID, startTime, endTime } = {}) => {
  const tenantId = getTenantId()
  const sales = await ObjectApi.list('sale', tenantId).catch(() => [])
  const startMs = startTime ? Date.parse(startTime) : NaN
  const endMs = endTime ? Date.parse(endTime) : NaN

  const filtered = sales
    .map(row => ({ id: row.object_id, ...row.payload }))
    .filter((sale) => {
      const belongsToStore = !storeID || `${sale.storeID || sale.storeId || ''}` === `${storeID}`
      if (!belongsToStore) return false

      const timestamp = getSaleTimestamp(sale)
      if (!timestamp) return true
      const timeMs = Date.parse(timestamp)
      if (Number.isNaN(timeMs)) return true
      if (!Number.isNaN(startMs) && timeMs < startMs) return false
      if (!Number.isNaN(endMs) && timeMs >= endMs) return false
      return true
    })

  const productAgg = {}
  const employeeAgg = {}

  let totalSales = 0
  let discounts = 0
  let rewards = 0
  let refunds = 0

  filtered.forEach((sale) => {
    const saleTotal = extractSaleAmount(sale)
    totalSales += saleTotal
    discounts += extractDiscountAmount(sale)
    rewards += extractRewardAmount(sale)
    refunds += extractRefundAmount(sale)

    const employeeName = sale.employeeName || sale.budtenderName || sale.cashierName || 'Unknown'
    employeeAgg[employeeName] = (employeeAgg[employeeName] || 0) + saleTotal

    extractLineItems(sale).forEach((item) => {
      const name = item.productName || item.name || 'Unnamed Product'
      const amount = toNumber(item.saleValue || item.total || item.amount || item.price || 0)
      const iconName = item.iconName || 'merch-joint'
      if (!productAgg[name]) {
        productAgg[name] = { saleValue: 0, iconName }
      }
      productAgg[name].saleValue += amount
    })
  })

  const top10ProductSales = Object.keys(productAgg)
    .map(name => ({
      productName: name,
      saleValue: money(productAgg[name].saleValue),
      iconName: productAgg[name].iconName,
    }))
    .sort((a, b) => toNumber(b.saleValue.replace('$', '')) - toNumber(a.saleValue.replace('$', '')))
    .slice(0, 10)

  const top10EmployeeSales = Object.keys(employeeAgg)
    .map(name => ({
      employeeName: name,
      total: money(employeeAgg[name]),
    }))
    .sort((a, b) => toNumber(b.total.replace('$', '')) - toNumber(a.total.replace('$', '')))
    .slice(0, 10)

  const transactions = filtered.length
  const avgSale = transactions ? totalSales / transactions : 0

  return {
    analytics: {
      summaryMetrics: {
        totalSales: money(totalSales),
        transactions,
        avgSale: money(avgSale),
        refunds: money(refunds),
        discounts: money(discounts),
        rewards: money(rewards),
      },
      top10ProductSales,
      top10EmployeeSales,
    },
  }
}

export const getDashboard = async ({ storeID } = {}) => {
  const metrics = await getTodaysMetrics({ storeID })
  const summary = metrics.analytics.summaryMetrics

  return {
    store: {
      dashboard: {
        metrc: {
          verifiedMetrcSales: 0,
          metrcFailuresHandled: 0,
          totalMetrcInteractions: 0,
        },
        todaysSales: {
          grossSales: `${summary.totalSales}`.replace('$', ''),
          netSales: `${summary.totalSales}`.replace('$', ''),
          medSales: '0.00',
          taxCollected: '0.00',
          bulkFlowerSold: 0,
          avgReceiptTotal: `${summary.avgSale}`.replace('$', ''),
          concentratesSold: 0,
          prerollsSold: 0,
          ediblesSold: 0,
          merchandiseSold: 0,
        },
        transactions: {
          totalToday: summary.transactions,
          totalYesterday: 0,
          lastWeek: summary.transactions,
          lastMonth: summary.transactions,
          totalRecToday: 0,
          totalRecYesterday: 0,
          recLastWeek: 0,
          recLastMonth: 0,
          totalMedToday: 0,
          totalMedYesterday: 0,
          medLastWeek: 0,
          medLastMonth: 0,
          transactionsByDay: [],
        },
        todaysTopBudtenders: metrics.analytics.top10EmployeeSales.slice(0, 5).map(item => ({
          budtender: item.employeeName,
          sales: item.total,
        })),
        todaysTopCategories: [],
        todaysBestSellers: {
          bestSellingProduct: (metrics.analytics.top10ProductSales[0] || {}).productName || '',
          bestCategory: '',
          bestVendor: '',
          bestStrain: '',
          bestPriceGroup: '',
        },
        customers: {
          totalNewCustomers: 0,
          totalReturningCustomers: 0,
        },
        grossSalesOverTime: {
          totalToday: `${summary.totalSales}`.replace('$', ''),
          totalYesterday: '0.00',
          lastWeek: `${summary.totalSales}`.replace('$', ''),
          lastMonth: `${summary.totalSales}`.replace('$', ''),
          totalRecToday: '0.00',
          totalRecYesterday: '0.00',
          recLastWeek: '0.00',
          recLastMonth: '0.00',
          totalMedToday: '0.00',
          totalMedYesterday: '0.00',
          medLastWeek: '0.00',
          medLastMonth: '0.00',
          grossSalesByDay: [],
        },
        todaysSalesHourly: {
          avgSalesPerHour: `${summary.avgSale}`.replace('$', ''),
          avgTransactionPerHour: summary.transactions,
          rushHour: '12:00:00',
          salesByHour: [],
        },
        todaysAdjustments: {
          avgDiscount: '0.00',
          totalDiscounts: `${summary.discounts}`.replace('$', ''),
          avgReturn: '0.00',
          totalReturns: `${summary.refunds}`.replace('$', ''),
        },
      },
    },
  }
}
