import { getTenantId } from './imsBridge'
import { getJson, postJson, putJson, tenantQuery } from '../hooks/http/httpClient'

const usersPath = () => `/user-management/users?${tenantQuery(getTenantId())}`
const userPath = userId => `/user-management/users/${encodeURIComponent(userId)}?${tenantQuery(getTenantId())}`
const employeesPath = () => `/employee?${tenantQuery(getTenantId())}`
const employeePath = employeeId => `/employee/${encodeURIComponent(employeeId)}?${tenantQuery(getTenantId())}`
const userActionPath = (userId, action) => (
  `/user-management/users/${encodeURIComponent(userId)}/${action}?${tenantQuery(getTenantId())}`
)

export const UserManagementApi = {
  listUsers: () => getJson(usersPath()),
  listEmployees: () => getJson(employeesPath()),
  getEmployee: employeeId => getJson(employeePath(employeeId)),
  createUser: payload => postJson(usersPath(), payload),
  updateUser: (userId, payload) => putJson(userPath(userId), payload),
  updateEmployee: (employeeId, payload) => putJson(employeePath(employeeId), {
    tenant_id: getTenantId(),
    payload,
  }),
  resetPassword: (userId, payload) => postJson(
    userActionPath(userId, 'reset-password'),
    payload,
  ),
  forcePasswordChange: (userId, forcePasswordChange = true) => postJson(
    userActionPath(userId, 'force-password-change'),
    { force_password_change: forcePasswordChange },
  ),
}
