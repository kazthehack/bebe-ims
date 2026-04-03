//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const getDiscount = operation`
  query getDiscount($discountID: ID!){
    node(id: $discountID) {
      ... on Discount{
        id
        name
        customerType
        requiresApproval
        hasSchedule
        appliesTo
        category
        amountType
        amount
        active
        archivedDate
        schedule{
          allDaySelected
          cronString
          duration
        }
        salesTypes{
          id
        }
      }
    }
  }
`

export const fetchDiscounts = operation`
  query FetchDiscounts($storeID: ID!) {
    store(id: $storeID) {
      id,
      discounts {
        edges {
          node {
            id,
            name,
            appliesTo,
            requiresApproval,
            category,
            amount,
            active,
            amountType,
            archivedDate
          }
        }
      }
    }
  }
`
