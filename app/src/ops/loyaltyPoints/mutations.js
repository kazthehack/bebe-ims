//  Copyright (c) 2020 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const updateCustomer = operation`
  mutation updateLoyaltyMember($input: UpdateLoyaltyMemberInput!) {
    updateLoyaltyMember(input: $input) {
      loyaltyMember {
        email
      }
    }
  }
`

export const updateReward = operation`
  mutation updateReward($input: UpdateRewardInput!) {
    updateReward(input: $input) {
      reward {
        name
        customerType
        appliesTo
        category
        amountType
        amount
        active
        pointCost
        archivedDate
        id
      }
    }
  }
`

export const adjustLoyaltyPoints = operation`
  mutation adjustLoyaltyPoints($input: AdjustLoyaltyPointsInput!) {
    adjustLoyaltyPoints(input: $input) {
      loyaltyPointAdjustment {
        points
        reason

      }
    }
  }
`

export const createReward = operation`
  mutation createReward($input: CreateRewardInput!) {
    createReward(input: $input) {
      reward {
        name
        customerType
        appliesTo
        category
        amountType
        amount
        active
        pointCost
        archivedDate
        id
      }
    }
  }
`

