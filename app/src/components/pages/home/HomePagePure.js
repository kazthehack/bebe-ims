//  Copyright (c) 2018 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import styled from 'styled-components'
import StatBox from './partials/StatBox'
import SalesList from './partials/SalesList'

const StatsWrap = styled.div`
  position: relative;
  margin-bottom: 41px;
`

const StatzBox = styled(StatBox)`
  display: inline-block;
  position: relative;
  margin-right: 9px;
  margin-top: 9px;
  height: 144px;
  width: 191px;
`

const SalesTitle = styled.div`
  color: #8b939e;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 14px;
`

const SalesContent = styled.div`
  display: inline-block;
  margin-bottom: 14px;
  margin-right: 31px;
  max-width: 480px;
  width: 100%;
`
const SalesContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const HomePage = ({ metricsData, venueSettings }) => {
  const { enableDareMode } = get(venueSettings, 'store.settings')
  const { analytics } = metricsData
  const { summaryMetrics, top10ProductSales, top10EmployeeSales } = analytics
  const { totalSales, transactions, avgSale, refunds, discounts, rewards } = summaryMetrics
  const getIcon = (iconName) => {
    if (enableDareMode && (iconName === 'merch-shirt' || iconName === 'merch-bong')) {
      return 'shirt'
    }
    return iconName
  }
  return (
    <div>
      <StatsWrap>
        <StatzBox label="Total Sales" value={totalSales} />
        <StatzBox label="Transactions" value={transactions} isMoney={false} />
        <StatzBox label="Average Sale" value={avgSale} />
        <StatzBox label="Refunds" value={refunds} />
        <StatzBox label="Discounts" value={discounts} />
        <StatzBox label="Rewards" value={rewards} />
      </StatsWrap>
      <div>
        <SalesContentWrapper>
          <SalesContent>
            <SalesTitle>Best Sellers</SalesTitle>
            <SalesList
              data={top10ProductSales.map(productData => ({
                name: productData.productName,
                sales: productData.saleValue,
                iconName: getIcon(productData.iconName),
                prefix: '$',
              }))}
            />
          </SalesContent>
          <SalesContent>
            <SalesTitle>{`Top ${enableDareMode ? 'salesperson' : 'budtender'}`}</SalesTitle>
            <SalesList
              data={top10EmployeeSales.map(employeeData => ({
                name: employeeData.employeeName,
                sales: employeeData.total,
              }))}
            />
          </SalesContent>
        </SalesContentWrapper>
      </div>
    </div>
  )
}

HomePage.propTypes = {
  venueSettings: PropTypes.shape({
    store: PropTypes.shape({
      settings: PropTypes.shape({
        enableDareMode: PropTypes.bool,
      }),
    }),
  }),
  metricsData: PropTypes.shape({
    analytics: PropTypes.shape({
      summaryMetrics: PropTypes.shape({
        totalSales: PropTypes.string,
        transactions: PropTypes.number,
        avgSale: PropTypes.string,
        refunds: PropTypes.string,
        discounts: PropTypes.string,
      }),
    }),
  }),
}

export default HomePage
