//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { getLoggedInEmployee } from 'ops'


export const getLoggedInEmployeeMockedResponse = {
  request: {
    query: getLoggedInEmployee,
    variables: {
      storeID: '1',
    },
  },
  result: {
    data: {
      viewer: {
        id: '1',
        name: 'John',
        shortName: 'Smith',
        email: 'ex@example.com',
        phone: '666-488-5812x0188',
        address: null,
        addressExtra: null,
        zipCode: '92429',
        city: 'Lesliebury',
        state: 'OR',
        portalRoles: [
          {
            id: '1',
            name: 'Admin',
            permissions: [
              'READ_STORE_REPORTS',
              'READ_INVENTORY',
              'WRITE_INVENTORY',
              'READ_EMPLOYEE',
              'WRITE_EMPLOYEE',
              'READ_BASIC_SETTINGS',
              'WRITE_BASIC_SETTINGS',
              'READ_ADMIN_SETTINGS',
              'WRITE_ADMIN_SETTINGS',
              'WRITE_DEVICE',
              'ADD_RECEIPT',
              'READ_RECEIPT',
              'ADD_SHIFT',
              'READ_SHIFT',
            ],
            __typename: 'StorePortalRole',
          },
        ],
        posRoles: [
          {
            id: '2',
            name: 'Commercial art gallery manager',
            __typename: 'StorePOSRole',
          },
        ],
        storeEmployee: {
          active: true,
          __typename: 'StoreEmployee',
        },
        organizationRole: {
          id: '1',
          name: 'Organization Admin',
          permissions: [
            'WRITE_EMPLOYEE',
            'READ_EMPLOYEE',
          ],
          __typename: 'OrganizationRole',
        },
        __typename: 'Employee',
      },
    },
  },
}

export const placeholder = {}
