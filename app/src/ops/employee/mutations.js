import { op as operation } from 'api/operation'
import { commonEmployeeFields } from './queries'
/* eslint-disable graphql/template-strings */


export const updateEmployee = operation`
  mutation updateEmployee($input: UpdateEmployeeInput!, $storeID: ID!) {
    updateEmployee(input: $input) {
      employee {
        ${commonEmployeeFields}
        posRoleEmployee(storeId: $storeID) {
          pinCode
        }
      }
    }
  }
`

export const addEmployee = operation`
  mutation addEmployee($input: AddEmployeeInput!, $storeID: ID!) {
    addEmployee(input: $input) {
      employee {
        ${commonEmployeeFields}
        posRoleEmployee(storeId: $storeID) {
          pinCode
        }
      }
    }
  }
`

export const removeStoreEmployee = operation`
  mutation removeStoreEmployee($input: RemoveStoreEmployeeInput!) {
    removeStoreEmployee(input: $input) {
      employee {
        ${commonEmployeeFields}
      }
    }
  }
`

export const generateNewEmployeePin = operation`
  mutation GenerateNewPin($input: GenerateNewPinInput!) {
    generateNewPin(input: $input) {
      pinCode
    }
  }
`

export const changePassword = operation`
  mutation AuthenticatedResetPassword($input: AuthenticatedResetPasswordInput!) {
    authenticatedResetPassword(input: $input) {
      ok
    }
  }
`

export const setEmployeePin = operation`
  mutation SetEmployeePin($input: SetEmployeePinInput!) {
    setEmployeePin(input: $input) {
      employee {
        id
      }
    }
  }
`

export const resetEmployeePin = operation`
  mutation ResetEmployeePin($input: ResetEmployeePinInput!, $storeId: ID!) {
    resetEmployeePin(input: $input) {
      employee {
        id
        posRoleEmployee (storeId: $storeId) {
          pinCode
        }
      }
    }
  }
`

export const inviteDemoUsers = operation`
  mutation InviteDemoUsers($input: InviteDemoUsersInput!) {
    inviteDemoUsers(input: $input) {
      storeId
      createdEmployees
      existingEmployees
      failedEmployees
    }
  }
`
