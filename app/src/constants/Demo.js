//  Copyright (c) 2021 First Foundry Inc. All rights reserved.
import { map, capitalize } from 'lodash'

export const DemoStoreStatus = {
  failure: 'FAILURE',
  pending: 'PENDING',
  received: 'RECEIVED',
  retry: 'RETRY',
  revoked: 'REVOKED',
  started: 'STARTED',
  success: 'SUCCESS',
}

export const DemoCustomerTypes = {
  manager: 'manager',
  budtender: 'budtender',
  other: 'other',
}

export const DemoCustomerTypeOptions = map(
  DemoCustomerTypes,
  key => ({ name: capitalize(key), value: key }),
)

export default DemoCustomerTypes
