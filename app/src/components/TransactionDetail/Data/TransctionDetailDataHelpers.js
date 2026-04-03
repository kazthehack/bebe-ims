//  Copyright (c) 2019 First Foundry LLC. All rights reserved.

// This should is used for data mapping
// by default this exports the transaction detail data shape for UI comsumption

import { map } from 'lodash'

export const defaultAdjustment = {
  appliesTo: '',
  date: '',
  employeeId: '',
  employeeName: '',
  type: '',
  totalReturned: '',
  item: '',
  itemUuid: '',
}

export const defaultDiscount = {
  name: '',
  discountName: '',
  amount: 0.0000,
  value: 0.000,
  unitType: 'amount',
}

export const defaultSaleItem = {
  name: '',
  amount: 0.0000,
  quantitySold: '',
  quantityUnit: '',
  discounts: [
    defaultDiscount,
  ],
  status: 'sale',
}

export const defaultValues = {
  receiptId: '',
  saleAt: '',
  paymentType: '',
  terminalName: '',
  employee: '',
  saleType: '',
  adjustments: [
    defaultAdjustment,
  ],
  saleItems: [
    defaultSaleItem,
  ],
  subTotalDiscounts: [
    defaultDiscount,
  ],
  subTotal: 0.0000,
  tax: 0.0000,
  total: 0.0000,
  tendered: 0.0000,
}

export const mapReceiptDataToDetailedProps = ({ node = {} }) => {
  const {
    uuid,
    soldAt,
    paymentType: _paymentType,
    tendered,
    preDiscountSubtotal: subtotal,
    total,
    tax,
    terminalName,
    adjustments: _adjustments,
    items,
    employee: _employee,
    customerType,
  } = node

  const mappedAdjustments = map(_adjustments, (a) => {
    try {
      const { employee, type, amount: totalReturned, receiptItem, createdAt, appliesTo } = a
      const { id: employeeId, name: employeeName } = employee
      const { productName, uuid: itemUuid } = receiptItem

      return {
        appliesTo,
        date: createdAt,
        employeeId,
        employeeName,
        type,
        totalReturned,
        item: productName,
        itemUuid,
      }
    } catch (error) {
      return a
    }
  })

  const getStatus = (itemUuid) => {
    const adjustment = mappedAdjustments.find(a => `${a.itemUuid}` === `${itemUuid}`)
    if (adjustment) return adjustment.type
    return 'sale'
  }

  const mappedSaleItems = map(items, (item) => {
    try {
      const {
        uuid: itemUuid,
        productName,
        basePrice,
        appliedDiscounts,
        appliedRewards,
        quantitySold,
        quantityUnit,
      } = item

      const mappedAppliedDiscounts = map(appliedDiscounts, (discount) => {
        try {
          const { amount, discountRule } = discount
          const { discountName, discountAmountType } = discountRule
          return {
            name: discountName || '',
            value: amount || 0.0000,
            unitType: discountAmountType || 'amount',
          }
        } catch (error) {
          return discount
        }
      })

      const mappedAppliedRewards = map(appliedRewards, (reward) => {
        try {
          const { amount, rewardRule } = reward
          const { rewardName, rewardAmountType } = rewardRule
          return {
            name: rewardName || '',
            value: amount || 0.0000,
            unitType: rewardAmountType || 'amount',
          }
        } catch (error) {
          return reward
        }
      })

      return {
        name: productName,
        amount: basePrice || 0.0000,
        discounts: mappedAppliedDiscounts,
        rewards: mappedAppliedRewards,
        status: getStatus(itemUuid),
        quantitySold: quantitySold || '',
        quantityUnit: quantityUnit || '',
      }
    } catch (error) {
      return item
    }
  })

  return {
    receiptId: uuid || '',
    saleAt: soldAt || '',
    paymentType: _paymentType || 'CASH',
    terminalName,
    employee: _employee ? _employee.name : '',
    saleType: customerType || '',
    adjustments: mappedAdjustments,
    saleItems: mappedSaleItems,
    subTotalDiscounts: [],
    subTotal: subtotal || 0.0000,
    tax,
    total,
    tendered,
  }
}

export default defaultValues
