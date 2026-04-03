import React from 'react'
import PropTypes from 'prop-types'
import StatBox from './DashboardBox'
import { StyledTitle, StyledRow, StyledColumn } from '../DashboardPagePure'

const TodaysSalesSection = ({ todaysSales, todaysBestSellers, todaysAdjustments }) => {
  const {
    grossSales,
    netSales,
    medSales,
    taxCollected,
    bulkFlowerSold,
    avgReceiptTotal,
    concentratesSold,
    prerollsSold,
    ediblesSold,
    merchandiseSold,
  } = todaysSales

  const {
    bestSellingProduct,
    bestCategory,
    bestVendor,
    bestStrain,
    bestPriceGroup,
  } = todaysBestSellers

  const {
    avgDiscount,
    totalDiscounts,
    avgReturn,
    totalReturns,
  } = todaysAdjustments

  return (
    <StyledColumn>
      <StyledTitle>Today&apos;s sales</StyledTitle>
      <StyledRow>
        <StatBox label="Gross sales" value={grossSales} prefix="$" styledDecimal />
        <StatBox label="Net sales" value={netSales} prefix="$" styledDecimal />
      </StyledRow>
      <StyledRow>
        <StatBox label="Medical sales" value={medSales} prefix="$" styledDecimal />
        <StatBox label="Tax collected" value={taxCollected} prefix="$" styledDecimal />
      </StyledRow>
      <StyledRow>
        <StatBox label="Bulk flower sold" value={bulkFlowerSold} suffix="g" />
        <StatBox label="Avg. receipt total" value={avgReceiptTotal} prefix="$" styledDecimal />
      </StyledRow>
      <StyledRow>
        <StatBox label="Concentrates sold" value={concentratesSold} />
        <StatBox label="Prerolls sold" value={prerollsSold} />
      </StyledRow>
      <StyledRow>
        <StatBox label="Edibles sold" value={ediblesSold} />
        <StatBox label="Merchandise sold" value={merchandiseSold} />
      </StyledRow>

      <StyledTitle style={{ paddingTop: '20px' }} >Today&apos;s adjustments</StyledTitle>
      <StyledRow>
        <StatBox label="Avg. discount %" value={avgDiscount} suffix="%" />
        <StatBox label="Total discounts" value={totalDiscounts} prefix="$" styledDecimal />
      </StyledRow>
      <StyledRow>
        <StatBox label="Avg. return %" value={avgReturn} suffix="%" />
        <StatBox label="Total returns" value={totalReturns} prefix="$" styledDecimal />
      </StyledRow>

      <StyledTitle style={{ paddingTop: '20px' }} >Today&apos;s best sellers</StyledTitle>
      <StyledRow>
        <StatBox
          label="Best selling product"
          value={bestSellingProduct || ''}
          innerBoxStyle={{ whiteSpace: 'nowrap', width: '382px' }}
          titleStyle={{ textAlign: 'start', paddingLeft: '25px' }}
          fluid
        />
      </StyledRow>
      <StyledRow>
        <StatBox label="Best category" value={bestCategory || ''} />
        <StatBox label="Best vendor" value={bestVendor || ''} />
      </StyledRow>
      <StyledRow>
        <StatBox label="Best strain" value={bestStrain || ''} />
        <StatBox label="Best price group" value={bestPriceGroup || ''} />
      </StyledRow>
    </StyledColumn>
  )
}

TodaysSalesSection.propTypes = {
  todaysSales: PropTypes.shape({
    grossSales: PropTypes.string,
    netSales: PropTypes.string,
    medSales: PropTypes.string,
    taxCollected: PropTypes.string,
    bulkFlowerSold: PropTypes.number,
    avgReceiptTotal: PropTypes.string,
    concentratesSold: PropTypes.number,
    prerollsSold: PropTypes.number,
    ediblesSold: PropTypes.number,
    merchandiseSold: PropTypes.number,
  }),
  todaysBestSellers: PropTypes.shape({
    bestSellingProduct: PropTypes.string,
    bestCategory: PropTypes.string,
    bestVendor: PropTypes.string,
    bestStrain: PropTypes.string,
    bestPriceGroup: PropTypes.string,
  }),
  todaysAdjustments: PropTypes.shape({
    avgDiscount: PropTypes.string,
    totalDiscounts: PropTypes.string,
    avgReturn: PropTypes.string,
    totalReturns: PropTypes.string,
  }),
}

export default TodaysSalesSection
