import React from 'react'
import PropTypes from 'prop-types'
import { map, toNumber, truncate } from 'lodash'
import colors from 'styles/colors'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const LABEL_MAX_LENGTH = 13

const formatLabel = label => truncate(label, { length: LABEL_MAX_LENGTH })

const TodayTopCategoriesGraph = ({ todaysTopCategories }) => {
  const data = map(todaysTopCategories, ({ category, sales }) => (
    {
      category: category.toUpperCase(),
      sales: toNumber(sales),
    }))

  return (
    <div style={{ height: '240px', width: '430px', minWidth: '400px', padding: 5, marginLeft: -30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
        >
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 10,
              color: '#485465',
              letterSpacing: '0.12px',
              fontWeight: 300,
            }}
            tickFormatter={label => formatLabel(label)}
            tickSize={10}
            width={130}
            interval={0}
          />
          <Tooltip />
          <Bar dataKey="sales" barSize={10} fill={colors.dashboardGraphs.blue} radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

TodayTopCategoriesGraph.propTypes = {
  todaysTopCategories: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    sales: PropTypes.string,
  })),
}

export default TodayTopCategoriesGraph
