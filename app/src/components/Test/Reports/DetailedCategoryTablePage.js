//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { DetailedCategoryReportTable } from 'components/pages/reports/SalesByCategoryReport'

const mockData = [
  {
    productId: 'UHJvZHVjdDoxMzc=',
    productName: 'Blue Dragon',
    totalSalesValue: 21,
    totalSalesCount: 5,
    totalProductCount: 5,
    totalWeight: 7.5,
    color: '#217af1',
  },
  {
    productId: 'UHJvZHVjdDoxMzb=',
    productName: 'Pinot Green',
    totalSalesValue: 28,
    totalSalesCount: 7,
    totalProductCount: 6,
    totalWeight: 11,
    color: '#21f1d6',
  },
  {
    productId: 'UHJvZHVjdDoxOTU=',
    productName: 'Chewdawg Shake',
    totalSalesValue: 33,
    totalSalesCount: 10,
    totalProductCount: 12,
    totalWeight: 21.2,
    color: '#f1d621',
  },
  {
    productId: 'UHJvZHVjdDoyNDM=',
    productName: 'Test Flower',
    totalSalesValue: 12,
    totalSalesCount: 3,
    totalProductCount: 2,
    totalWeight: 5,
    color: '#21f177',
  },
]

const DetailedCategoryTablePage = () => (
  <div>
    <DetailedCategoryReportTable data={mockData} />
  </div>
)

export default DetailedCategoryTablePage
