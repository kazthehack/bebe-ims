//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import { combineReducers, compose } from 'redux'
import { withReset } from 'redux-foundry'
import { combineEpics } from 'redux-observable'
import auth from './auth'
import { LOGOUT } from './auth/actionTypes'
import modals from './modals'
import venues from './venues'
import transactionHistoryReport from './reports/transactionHistoryReport'
import navigation from './navigation'
import products from './inventory/products'
import productReport from './reports/productReport'
import employees from './inventory/employees'
import priceGroups from './inventory/priceGroups'
import budtender from './reports/budtender'
import budtenderDetailed from './reports/budtenderDetailed'
import assignProduct, { epic as assignProductEpic } from './modals/assignProduct'
import compliance from './settings/compliance'
import taxes from './settings/taxes'
import discounts from './settings/discounts'
import assignPackage, { epic as assignPackageEpic } from './modals/assignPackage'
import packageLogs from './logs/packageLogs'
import salesByPackage from './reports/salesByPackage'
import packageUpdate from './modals/packageUpdate'
import packages from './inventory/packages'
import salesByProduct from './reports/salesByProduct'
import salesByCategory from './reports/salesByCategory'
import salesByCategoryDetailed from './reports/salesByCategoryDetailed'
import salesByBrand from './reports/salesByBrand'
import salesByPriceGroup from './reports/salesByPriceGroup'
import rewards from './crm/rewards'
import customers from './crm/customers'
import notifications from './notifications'
import salesByCategoryCSV from './reports/salesByCategoryCSV'
import salesByPackageCSV from './reports/salesByPackageCSV'
import transactionHistoryDetailCSV from './reports/transactionHistoryDetailCSV'
import transactionHistoryListCSV from './reports/transactionHistoryListCSV'
import inventoryAllCategories from './reports/inventoryAllCategoriesCSV'
import inventoryCategoryDetail from './reports/inventoryCategoryDetailCSV'
import shiftList from './reports/shiftList'
import alerts from './alerts'

export const epic = combineEpics(
  assignPackageEpic,
  assignProductEpic,
)

const reducer = combineReducers({
  auth,
  alerts,
  modals,
  venues,
  transactionHistoryReport,
  navigation,
  products,
  productReport,
  employees,
  priceGroups,
  budtender,
  budtenderDetailed,
  assignProduct,
  compliance,
  taxes,
  discounts,
  assignPackage,
  packageLogs,
  salesByPackage,
  packageUpdate,
  packages,
  salesByProduct,
  salesByCategory,
  salesByCategoryDetailed,
  salesByBrand,
  salesByPriceGroup,
  salesByCategoryCSV,
  salesByPackageCSV,
  transactionHistoryDetailCSV,
  transactionHistoryListCSV,
  rewards,
  customers,
  notifications,
  inventoryAllCategories,
  inventoryCategoryDetail,
  shiftList,
})

export default compose(
  withReset(LOGOUT),
)(reducer)
