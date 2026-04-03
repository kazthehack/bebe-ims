import React from 'react'
import PropTypes from 'prop-types'
import { map, toNumber } from 'lodash'
import colors from 'styles/colors'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const TodayTopBudtendersGraph = ({ todaysTopBudtenders }) => {
  const data = map(todaysTopBudtenders, ({ budtender, sales }) => (
    {
      budtender: budtender.toUpperCase(),
      sales: toNumber(sales),
    }))

  return (
    <div style={{ height: '240px', width: '400px', minWidth: '400px', padding: 5, marginLeft: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
        >
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
          <YAxis
            dataKey="budtender"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 10,
              color: '#485465',
              letterSpacing: '0.12px',
              fontWeight: 300,
            }}
            tickSize={10}
            width={100}
          />
          <Tooltip />
          <Bar dataKey="sales" barSize={10} fill={colors.dashboardGraphs.blue} radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

TodayTopBudtendersGraph.propTypes = {
  todaysTopBudtenders: PropTypes.arrayOf(PropTypes.shape({
    budtender: PropTypes.string,
    sales: PropTypes.string,
  })),
}

export default TodayTopBudtendersGraph
