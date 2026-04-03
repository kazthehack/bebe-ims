//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { op as operation } from 'api/operation'

export const updateDiscount = operation`
  mutation updateDiscount($input: UpdateDiscountInput!) {
    updateDiscount(input: $input) {
      discount{
        id
        active
        name
        amount
        amountType
        appliesTo
        customerType
        requiresApproval
        hasSchedule
        category
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

export const addDiscount = operation`
  mutation AddDiscount($input: AddDiscountInput!) {
    addDiscount(input: $input) {
      discount{
        id
        active
        name
        amount
        amountType
        appliesTo
        customerType
        requiresApproval
        hasSchedule
        category
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

export const deleteDiscount = operation`
  mutation deleteDiscount ($input: DeleteDiscountInput!) {
    deleteDiscount(input: $input) {
      deletedDiscountId
    }
  }
`

export const archiveDiscount = operation`
  mutation archiveDiscount ($input: ArchiveDiscountInput!) {
    archiveDiscount(input: $input) {
      archivedDiscountId
      archivedDate
    }
  }
`
