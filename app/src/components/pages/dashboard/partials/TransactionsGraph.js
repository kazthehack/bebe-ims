import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import colors from 'styles/colors'
import { map, range, isEmpty } from 'lodash'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// returns the first tick and every other tick after that
const everyOtherTickFilter = (ticks, counter) => ( ++counter.count % 2 ? ticks : '') // eslint-disable-line

const emptyData = map(range(14), n => ({
  date: moment().subtract(13 - n, 'days').format('D/M'),
  total: 0,
  med: 0,
  rec: 0,
}))

const TransactionsGraph = ({ transactionsByDay }) => {
  const data = map(transactionsByDay, day => ({ ...day, date: moment(day.date).format('M/D') }))
  const tickCounter = { count: 0 }
  return (
    <div style={{ height: '150px', width: '800px', padding: 5, marginLeft: -10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={isEmpty(data) ? emptyData : data}
          margin={{
            top: 10,
            right: 5,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 'bold' }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
            tickFormatter={tick => everyOtherTickFilter(tick, tickCounter)}
          />
          <Tooltip />
          <Line type="linear" dataKey="med" stroke={colors.dashboardGraphs.lightBlue} strokeWidth={2} r={4} />
          <Line type="linear" dataKey="rec" stroke={colors.dashboardGraphs.blue} strokeWidth={2} r={4} />
          <Line type="linear" dataKey="total" stroke={colors.dashboardGraphs.darkBlue} strokeWidth={2} r={4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

TransactionsGraph.propTypes = {
  transactionsByDay: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    rec: PropTypes.number,
    med: PropTypes.number,
    total: PropTypes.number,
  })),
}

export default TransactionsGraph
