//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment-timezone'

const NewLineChart = ({ series, height, width, domain }) => (
  <LineChart height={height} width={width}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="category"
      type="number"
      allowDuplicatedCategory={false}
      tickFormatter={unixTime => moment(unixTime).format('MM/DD/YYYY')}
      domain={domain}
    />
    <YAxis dataKey="value" />
    <Tooltip
      labelFormatter={unixTime => moment(unixTime).format('MM/DD/YYYY')}
      // eslint-disable-next-line react/prop-types
      formatter={(value, name, props) => (props.unit === '' ? `$${value}` : value)}
      wrapperStyle={{ zIndex: 100 }}
    />
    <Legend />
    {series.map(s => (
      <Line
        dataKey="value"
        data={s.data}
        name={s.name}
        key={s.id}
        stroke={s.color}
        unit={s.unit === '$' ? '' : ` ${s.unit}`}
      />
    ))}
  </LineChart>
)

NewLineChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    unit: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      category: PropTypes.number,
      value: PropTypes.number,
    })),
  })).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  domain: PropTypes.arrayOf(PropTypes.number),
}

// ResponsiveContainer needed for non-pixel width and height
export const ResponsiveLineChart = ({ height, width, ...props }) => (
  <ResponsiveContainer width={width} height={height}>
    <NewLineChart {...props} />
  </ResponsiveContainer>
)

ResponsiveLineChart.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default NewLineChart
