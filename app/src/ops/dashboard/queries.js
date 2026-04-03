import { op as operation } from 'api/operation'

/* eslint-disable import/prefer-default-export */
export const getDashboard = operation`
  query getDashboard($storeID: ID!) {
    store(id: $storeID) {
      id
      dashboard {
        metrc {
          verifiedMetrcSales
          metrcFailuresHandled
          totalMetrcInteractions
        }
        transactions {
          totalToday
          totalRecToday
          totalMedToday
          totalYesterday
          totalRecYesterday
          totalMedYesterday
          lastWeek
          lastMonth
          recLastWeek
          medLastWeek
          recLastMonth
          medLastMonth
          transactionsByDay {
            date
            rec
            med
            total
          }
        }
        todaysSales {
          grossSales
          netSales
          medSales
          taxCollected
          bulkFlowerSold
          avgReceiptTotal
          concentratesSold
          prerollsSold
          ediblesSold
          merchandiseSold
        }
        todaysAdjustments {
          avgDiscount
          totalDiscounts
          avgReturn
          totalReturns
        }
        todaysBestSellers {
          bestSellingProduct
          bestCategory
          bestVendor
          bestStrain
          bestPriceGroup
        }
        todaysTopBudtenders {
          budtender
          sales
        }
        todaysTopCategories {
          category
          sales
        }
        grossSalesOverTime {
          totalToday
          totalYesterday
          lastWeek
          lastMonth
          totalRecToday
          totalRecYesterday
          recLastWeek
          recLastMonth
          totalMedToday
          totalMedYesterday
          medLastWeek
          medLastMonth
          grossSalesByDay {
            date
            rec
            med
            total
          }
        }
        todaysSalesHourly {
          avgSalesPerHour
          avgTransactionPerHour
          rushHour
          salesByHour {
            hour
            sales
          }
        }
        customers {
          onlineMenuCustomersAcquired
          loyaltyPointsAccumulated
          recurringCustomers
        }
        compliance {
          posComplianceErrorsStopped
          posComplianceErrorsPotentialCost
          packageOversellingStopped
          autoFinishedPackages
        }
      }
    }
  }
`
