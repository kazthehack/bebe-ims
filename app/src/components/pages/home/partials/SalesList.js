//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 01/22/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'
import List from 'components/common/container/List'
import { ProductIcon } from 'components/common/display/ProductIcon'

const SalesItem = styled.div`
  width: 100%;
  color: #4d4d4d;
  font: 14px 'Roboto', sans-serif;
  display: flex;
  justify-content: space-between;
`

const SalesName = styled.div`
  display: flex;
  align-items: center;
`

const SalesNumber = styled.span`
  color: #1875f0;
  font-size: 16px;
  font-weight: 300;
`

const StyledIcon = styled(ProductIcon)`
  margin-right: 5px;
`

const NoDataContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: #4d4d4d;
  font: 14px 'Roboto', sans-serif;
`

const NoData = () => (
  <List
    data={[1]}
    renderItem={() => <NoDataContainer>No Data</NoDataContainer>}
  />
)
const renderSalesItem = (props) => {
  const precision = Number.isInteger(props.sales) ? 0 : 2

  return (
    <SalesItem>
      <SalesName>
        { props.iconName && <StyledIcon type={props.iconName} />}
        {props.name}
      </SalesName>
      <SalesNumber>
        <NumberFormat value={props.sales} prefix={props.prefix} suffix={props.suffix} thousandSeparator displayType="text" decimalScale={precision} />
      </SalesNumber>
    </SalesItem>
  )
}

renderSalesItem.propTypes = {
  name: PropTypes.string.isRequired,
  sales: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  iconName: PropTypes.string,
}


const SalesList = (props) => {
  const data = props.data.slice(0)
    .sort((a, b) => b.sales - a.sales)
  if (data.length === 0) return <NoData />
  return (
    <List data={data} renderItem={renderSalesItem} />
  )
}

SalesList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape(renderSalesItem.propTypes),
  ).isRequired,
}

export default SalesList
