//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.
import { op as operation } from 'api/operation'

// used in employee mutations
export const commonEmployeeFields = `
  id
  name
  shortName
  email
  phone
  address
  addressExtra
  zipCode
  city
  state
  portalRoles(storeId: $storeID) {
    id
    name
  }
  posRoles(storeId: $storeID) {
    id
    name
  }
  storeEmployee(storeId: $storeID) {
    active
  }
`

// Get StoreEmployees List
export const getEmployees = operation`
  query getEmployees($storeID: ID!) {
    store(id: $storeID) {
      id,
      storeEmployees {
        active
        employee {
          id
          name
          shortName
          email
          phone
          portalRoles(storeId: $storeID) {
            id
            name
          }
          posRoles(storeId: $storeID) {
            id
            name
          }
        }
      }
    }
  }
`

// Get Employee
export const getEmployee = operation`
  query getEmployee($employeeID: ID!, $storeID: ID!) {
    node(id: $employeeID) {
      ...on Employee {
        id
        name
        shortName
        email
        phone
        address
        addressExtra
        zipCode
        city
        state
        portalRoles(storeId: $storeID) {
          id
          name
        }
        posRoles(storeId: $storeID) {
          id
          name
        }
        storeEmployee(storeId: $storeID) {
          active
        }
      }
    }
  }
`

// Get Currently Logged in Employee
// This endpoint does not require any permissions, unlike the getEmployee endpoint.
export const getLoggedInEmployee = operation`
  query getLoggedInEmployee($storeID: ID!) {
    viewer {
     ... on Employee {
      id
      name
      shortName
      email
      phone
      address
      addressExtra
      zipCode
      city
      state
      portalRoles(storeId: $storeID) {
        id
        name
        permissions
      }
      posRoles(storeId: $storeID) {
          id
          name
      }
      storeEmployee(storeId: $storeID) {
        active
      }
      organizationRole {
        id
        name
        permissions
      }
    }
  }
}
`
