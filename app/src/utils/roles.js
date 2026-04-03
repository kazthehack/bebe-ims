//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { get } from 'lodash'


// TODO: these id's appear to not be stable on the back-end -- need to figure out if we still care
const PORTAL_ROLE_RANK = {
  U3RvcmVQb3J0YWxSb2xlOjE3: 1,
  U3RvcmVQb3J0YWxSb2xlOjE5: 2,
  U3RvcmVQb3J0YWxSb2xlOjE4: 3,
}

// this is intended to generalize the current roles, so our code could call them by name,
// even if the end user can later modify those names, seems nicer than using id's
// TODO: these id's appear to not be stable on the back-end -- need to figure out if we still care
export const PORTAL_ROLE_TO_ID = {
  Admin: 'U3RvcmVQb3J0YWxSb2xlOjE3',
  Supervisor: 'U3RvcmVQb3J0YWxSb2xlOjE5',
  'Associate Supervisor': 'U3RvcmVQb3J0YWxSb2xlOjE4',
}

/** Test if an employee has the specified role.
 * An Employee can only have 1 portal role
 * @function employeeHasRole
 * @param {Object} employee - GQL Employee Object to be tested for a role, must have roles[].
 * @param {string} role - The role to test for.
 * @return {boolean} true if employee has role, false if employee does not
 */
export const employeeHasRole = (employee, role) => (
  get(employee, 'portalRoles', []).find(element => (element.id === get(PORTAL_ROLE_TO_ID, role))) !== undefined
)

/** Test if employee1 out ranks employee2
 * @function employee1OutranksEmployee2
 * @param {Object} employee1 - GQL Employee Object which will be the employee left of the >
 * @param {Object} employee2 - GQL Employee Object which will ne the employee right of the >
 * @return {boolean} true if employee1 is ranked higher than employee2
 */
export const employee1OutranksEmployee2 = (employee1, employee2) => {
  const emp1Role = get(employee1, 'roles[0].name')
  const emp2Role = get(employee2, 'roles[0].name')
  return get(PORTAL_ROLE_RANK, emp1Role, 0) < get(PORTAL_ROLE_RANK, emp2Role, 0)
}
