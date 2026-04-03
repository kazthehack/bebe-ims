import React, { useEffect, useMemo, useState } from 'react'
import { ObjectApi } from 'api/client'
import {
  getAuthenticatedEmployee,
  getDashboard,
  getNotifications,
  getStoreSettings,
  getTenantId,
  getTodaysMetrics,
} from 'api/imsBridge'

const toEdge = node => ({ node })
const normalizeRecord = record => ({ id: record.object_id, ...(record.payload || {}) })

const getOperationDefinition = (operation) => {
  const definitions = operation && operation.definitions ? operation.definitions : []
  return definitions.find(def => def.kind === 'OperationDefinition') || null
}

const getOperationName = (operation) => {
  const definition = getOperationDefinition(operation)
  return (definition && definition.name && definition.name.value) || 'anonymousOperation'
}

const getOperationType = (operation) => {
  const definition = getOperationDefinition(operation)
  return (definition && definition.operation) || 'query'
}

const emptyDashboard = () => ({
  store: {
    dashboard: {
      metrc: {
        verifiedMetrcSales: 0,
        metrcFailuresHandled: 0,
        totalMetrcInteractions: 0,
      },
      todaysSales: {
        grossSales: '0.00',
        netSales: '0.00',
        medSales: '0.00',
        taxCollected: '0.00',
        bulkFlowerSold: 0,
        avgReceiptTotal: '0.00',
        concentratesSold: 0,
        prerollsSold: 0,
        ediblesSold: 0,
        merchandiseSold: 0,
      },
      transactions: {
        totalToday: 0,
        totalYesterday: 0,
        lastWeek: 0,
        lastMonth: 0,
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
      todaysTopBudtenders: [],
      todaysTopCategories: [],
      todaysBestSellers: {
        bestSellingProduct: '',
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
        totalToday: '0.00',
        totalYesterday: '0.00',
        lastWeek: '0.00',
        lastMonth: '0.00',
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
        avgSalesPerHour: '0.00',
        avgTransactionPerHour: 0,
        rushHour: '00:00:00',
        salesByHour: [],
      },
      todaysAdjustments: {
        avgDiscount: '0.00',
        totalDiscounts: '0.00',
        avgReturn: '0.00',
        totalReturns: '0.00',
      },
    },
  },
})

const operationKeywordMap = [
  [/tax/i, 'tax'],
  [/compliance/i, 'compliance'],
  [/discount/i, 'discount'],
  [/hardware|terminal/i, 'hardware'],
  [/venue|store/i, 'store'],
  [/employee|users?/i, 'users'],
  [/notification|alert/i, 'notification'],
  [/salesType/i, 'sales_type'],
  [/salesReport/i, 'sales_report'],
  [/salesExport/i, 'sales_export'],
  [/inventoryReport/i, 'inventory_report'],
  [/transactionHistoryReport/i, 'transaction_history_report'],
  [/shiftReport/i, 'shift_report'],
  [/shift/i, 'shift'],
  [/brand/i, 'brand'],
  [/strain/i, 'strain'],
  [/reward/i, 'reward'],
  [/customer|loyalty/i, 'customer'],
  [/integration|thirdParty|metrc|leafly|bloom|paybotics|connectedApps/i, 'integration'],
  [/receipt/i, 'receipt'],
  [/order|package|product|priceGroup|screen/i, 'order'],
  [/permission|role/i, 'permissions'],
  [/types?/i, 'types'],
  [/units?/i, 'units'],
  [/demo/i, 'demo'],
  [/onlineMenu/i, 'online_menu'],
  [/task/i, 'task'],
]

const inferObjectType = (operationName) => {
  for (const [pattern, objectType] of operationKeywordMap) {
    if (pattern.test(operationName)) return objectType
  }
  return null
}

const inferFieldName = (operationName) => {
  const stripped = operationName
    .replace(/^(get|fetch|query|add|create|update|archive|delete|remove|set|reset|invite|generate|async)/, '')
    .replace(/URL$/, 'Url')
  if (!stripped) return 'result'
  return stripped.charAt(0).toLowerCase() + stripped.slice(1)
}

const readInput = (variables = {}) => (variables && variables.input ? variables.input : variables)

const findObjectId = (variables = {}) => {
  const input = readInput(variables)
  const candidates = [
    input.id,
    input.objectID,
    input.objectId,
    input.storeID,
    input.storeId,
    input.employeeID,
    input.employeeId,
    input.taxID,
    input.taxId,
    input.discountID,
    input.discountId,
    input.productID,
    input.productId,
    input.packageID,
    input.packageId,
    input.rewardID,
    input.rewardId,
    input.customerID,
    input.customerId,
    input.complianceID,
    input.complianceId,
    input.priceGroupID,
    input.priceGroupId,
    input.terminalID,
    input.terminalId,
    input.screenID,
    input.screenId,
    variables.id,
    variables.storeID,
    variables.storeId,
  ]
  return candidates.find(v => v !== undefined && v !== null && `${v}`.length > 0) || null
}

const isListQuery = (operationName, variables = {}) => {
  if (findObjectId(variables)) return false
  return /(List|All|Paginated|Filtered|Notifications|Receipts|Employees|Products|Packages|SalesTypes|Screens|PriceGroups|Venues|Stores|Rewards)s?$/i.test(operationName)
}

const asConnection = (rows) => ({
  edges: rows.map(toEdge),
  totalCount: rows.length,
})

const buildGraphPayload = (fieldName, data, list) => {
  if (list) {
    const conn = asConnection(data)
    return {
      [fieldName]: conn,
      store: { [fieldName]: conn },
    }
  }

  return {
    [fieldName]: data,
    store: { [fieldName]: data },
  }
}

const runGenericQuery = async (operationName, variables = {}) => {
  const tenantId = getTenantId()
  const objectType = inferObjectType(operationName)
  if (!objectType) return {}

  const fieldName = inferFieldName(operationName)
  if (isListQuery(operationName, variables)) {
    const records = await ObjectApi.list(objectType, tenantId).catch(() => [])
    return buildGraphPayload(fieldName, records.map(normalizeRecord), true)
  }

  const objectId = findObjectId(variables)
  if (!objectId) {
    const records = await ObjectApi.list(objectType, tenantId).catch(() => [])
    const first = records.length ? normalizeRecord(records[0]) : null
    return buildGraphPayload(fieldName, first, false)
  }

  const record = await ObjectApi.get(objectType, objectId, tenantId).catch(() => null)
  return buildGraphPayload(fieldName, record ? normalizeRecord(record) : null, false)
}

const runQueryByOperation = async (operationName, variables = {}) => {
  switch (operationName) {
    case 'getTodaysMetrics':
      return getTodaysMetrics(variables)
    case 'getDashboard':
      return getDashboard(variables)
    case 'fetchVenueSettings':
      return { store: await getStoreSettings(variables.storeID) }
    case 'getLoggedInEmployee':
      return await getAuthenticatedEmployee(variables.storeID)
    case 'getPortalNotifications':
    case 'getFilteredNotifications': {
      const notifications = await getNotifications(variables)
      return { store: { portalNotifications: notifications } }
    }
    case 'getTotalUnseenCount': {
      const notifications = await getNotifications(variables)
      return { store: { portalNotifications: { totalUnseenCount: notifications.totalUnseenCount || 0 } } }
    }
    default:
      return runGenericQuery(operationName, variables)
  }
}

const sanitizePayload = (input = {}) => {
  const payload = { ...input }
  delete payload.clientMutationId
  delete payload.storeID
  delete payload.storeId
  delete payload.tenantID
  delete payload.tenantId
  return payload
}

const runGenericMutation = async (operationName, variables = {}) => {
  const tenantId = getTenantId()
  const objectType = inferObjectType(operationName)
  if (!objectType) return { success: true }

  const input = readInput(variables)
  const payload = sanitizePayload(input)
  const objectId = findObjectId(variables)

  try {
    if (/archive|delete|remove/i.test(operationName)) {
      if (!objectId) return { success: true }
      const existing = await ObjectApi.get(objectType, objectId, tenantId).catch(() => null)
      const nextPayload = {
        ...((existing && existing.payload) || {}),
        ...payload,
        archivedDate: new Date().toISOString(),
        isArchived: true,
      }
      await ObjectApi.update(objectType, objectId, tenantId, nextPayload)
      return { success: true }
    }

    if (/update|set|reset|regen|sync|finish|adjust|associate/i.test(operationName) && objectId) {
      const existing = await ObjectApi.get(objectType, objectId, tenantId).catch(() => null)
      const nextPayload = {
        ...((existing && existing.payload) || {}),
        ...payload,
      }
      const updated = await ObjectApi.update(objectType, objectId, tenantId, nextPayload)
      return { success: true, object: normalizeRecord(updated) }
    }

    const created = await ObjectApi.create(objectType, tenantId, payload)
    return { success: true, object: normalizeRecord(created) }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

const runMutationByOperation = async (operationName, variables = {}) => {
  switch (operationName) {
    case 'setNotificationDismissal': {
      const tenantId = getTenantId()
      const id = findObjectId(variables)
      if (!id) return { success: true }
      const existing = await ObjectApi.get('notification', id, tenantId).catch(() => null)
      await ObjectApi.update('notification', id, tenantId, {
        ...((existing && existing.payload) || {}),
        dismissedAt: new Date().toISOString(),
        seen: true,
      })
      return { success: true }
    }
    case 'dismissAllNotifications': {
      const tenantId = getTenantId()
      const all = await ObjectApi.list('notification', tenantId).catch(() => [])
      await Promise.all(all.map(row => ObjectApi.update('notification', row.object_id, tenantId, {
        ...(row.payload || {}),
        dismissedAt: new Date().toISOString(),
        seen: true,
      })))
      return { success: true }
    }
    case 'setNotificationsSeen': {
      const tenantId = getTenantId()
      const all = await ObjectApi.list('notification', tenantId).catch(() => [])
      await Promise.all(all.map(row => ObjectApi.update('notification', row.object_id, tenantId, {
        ...(row.payload || {}),
        seen: true,
      })))
      return { success: true }
    }
    default:
      return runGenericMutation(operationName, variables)
  }
}

const buildQueryDataProp = (state, name) => {
  const fallback = name === 'dashboardData' ? emptyDashboard() : {}
  return {
    ...fallback,
    ...state.data,
    loading: state.loading,
    error: state.error,
    refetch: state.refetch,
    fetchMore: state.fetchMore,
  }
}

export const graphql = (operation, config = {}) => Wrapped => (props) => {
  const operationName = useMemo(() => getOperationName(operation), [operation])
  const operationType = useMemo(() => getOperationType(operation), [operation])
  const name = config.name || (operationType === 'mutation' ? 'mutate' : 'data')
  const shouldSkip = typeof config.skip === 'function' ? !!config.skip(props) : !!config.skip
  const options = typeof config.options === 'function' ? (config.options(props) || {}) : (config.options || {})
  const variables = options.variables || {}

  const [queryState, setQueryState] = useState({
    loading: operationType === 'query' && !shouldSkip,
    error: null,
    data: {},
  })

  const executeQuery = async (overrideVariables = variables) => {
    setQueryState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await runQueryByOperation(operationName, overrideVariables)
      setQueryState({ loading: false, error: null, data: data || {} })
      return { data }
    } catch (error) {
      setQueryState(prev => ({ ...prev, loading: false, error }))
      return { error }
    }
  }

  useEffect(() => {
    if (operationType !== 'query' || shouldSkip) return
    executeQuery(variables)
  }, [operationType, shouldSkip, operationName, JSON.stringify(variables)])

  if (operationType === 'mutation') {
    const mutate = async ({ variables: mutationVariables = {} } = {}) => (
      runMutationByOperation(operationName, mutationVariables)
    )
    const nextProps = config.props
      ? config.props({ ownProps: props, mutate })
      : { [name]: mutate }
    return <Wrapped {...props} {...nextProps} />
  }

  const queryProp = buildQueryDataProp({
    ...queryState,
    refetch: ({ variables: override } = {}) => executeQuery(override || variables),
    fetchMore: ({ variables: override } = {}) => executeQuery(override || variables),
  }, name)

  const mappedProps = config.props
    ? config.props({ ownProps: props, [name]: queryProp })
    : { [name]: queryProp }

  return <Wrapped {...props} {...mappedProps} />
}

export default {
  graphql,
}
