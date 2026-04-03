import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment-timezone'
import { DATE_FORMAT } from 'constants/Settings'

export const StackedAreaChart = ({ width, height, data, areas, domain }) => {
  const areasToDisplay = areas.map((area) => {
    let unitTypeToDisplay = ''
    if (`${area.subCategoryType}`.toLowerCase().includes('weight')) {
      unitTypeToDisplay = `${area.unitType}`.toLowerCase() === 'grams' ? ' g' : ` ${area.unitType}`.toLowerCase()
    }

    return (
      <Area
        unit={unitTypeToDisplay}
        key={area.productId}
        type="monotone"
        dataKey={area.productName}
        stackId="1"
        stroke={area.color}
        fill={area.color}
      />
    )
  })

  return (
    <Fragment>
      <AreaChart width={width} height={height} data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          tickFormatter={unixTime => moment(unixTime).format(DATE_FORMAT)}
          domain={domain}
        />
        <YAxis />
        <Tooltip
          labelFormatter={unixTime => moment(unixTime).format(DATE_FORMAT)}
          formatter={value => `${String(data[0].subCategoryType).toLowerCase().includes('revenue') ? '$' : ''} ${value}`}
          wrapperStyle={{ zIndex: 100 }}
        />
        <Legend />
        {areasToDisplay}
      </AreaChart>
    </Fragment>
  )
}

StackedAreaChart.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.shape({
    productName: PropTypes.string,
    color: PropTypes.string,
  })),
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.number,
    products: PropTypes.arrayOf(PropTypes.shape({
      productName: PropTypes.string,
      sales: PropTypes.number,
    })),
  })),
  height: PropTypes.number,
  width: PropTypes.number,
  domain: PropTypes.arrayOf(PropTypes.number),
}

// ResponsiveContainer needed for non-pixel width and height
export const ResponsiveStackedAreaChart = ({ height, width, ...props }) => (
  <ResponsiveContainer width={width} height={height}>
    <StackedAreaChart {...props} />
  </ResponsiveContainer>
)

ResponsiveStackedAreaChart.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default ResponsiveStackedAreaChart
