import { op as operation } from 'api/operation'

export const getReceipts = operation`
  query getReceipts($storeID: ID!, $startDt: DateTime, $endDt: DateTime, $uuId: String) {
    store(id: $storeID) {
      id
      transactionHistory(startDt: $startDt, endDt: $endDt) {
        recreationalSales
        medicalSales
        tax
        totalCollected
        recreationalCashSales
        medicalCashSales
        totalCashTax
        totalCashCollected
        recreationalDebitSales
        medicalDebitSales
        totalDebitTax
        totalDebitCollected
        receipts(receiptUuid: $uuId){
          edges {
            node {
              uuid
              id
              soldAt
              terminalName
              employee {
                name
              }
              subtotal
              tax
            }
            cursor
          }
        }
      }
    }
  }
`

export const getNextReceipt = operation`
  query getReceipts($storeID: ID!, $startDt: DateTime, $endDt: DateTime, $cursor: String) {
    store(id: $storeID) {
      id
      transactionHistory(startDt: $startDt, endDt: $endDt) {
        receipts(first:1, after: $cursor){
          edges {
            node {
              uuid
              id
              soldAt
            }
            cursor
          }
        }
      }
    }
  }
`

export const getPreviousReceipt = operation`
  query getReceipts($storeID: ID!, $startDt: DateTime, $endDt: DateTime, $cursor: String) {
    store(id: $storeID) {
      id
      transactionHistory(startDt: $startDt, endDt: $endDt) {
        receipts(last:1, before: $cursor){
          edges {
            node {
              uuid
              id
              soldAt
            }
            cursor
          }
        }
      }
    }
  }
`

export const getReceiptData = operation`
  query GetReceipt($receiptId: ID!) {
    node(id: $receiptId) {
      ... on Receipt {
        id
        uuid
        soldAt
        paymentType
        terminalName
        employee {
          name
          shortName
        }
        customerType
        adjustments {
          appliesTo
          createdAt
          employee {
            id
            name
            shortName
          }
          type
          amount
          receiptItem {
            uuid
            quantitySold
            productName
          }
        }
        items {
          uuid
          quantitySold
          quantityUnit
          productName
          basePrice
          appliedRewards {
            amount
            amountSelected
            rewardRule {
              appliesTo
              amount
              rewardName
              rewardAmountType
            }
          }
          appliedDiscounts {
            amount
            amountSelected
            discountRule {
              appliesTo
              amount
              discountName
              discountAmountType
            }
          }
        }
        discountRules {
          appliesTo
          amount
          discountName
          discountAmountType
        }
        tendered
        preDiscountSubtotal
        tax
        total
      }
    }
  }

`

export default getReceiptData
