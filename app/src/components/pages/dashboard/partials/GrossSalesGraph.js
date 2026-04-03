import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import colors from 'styles/colors'
import { map, toNumber, range, isEmpty } from 'lodash'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

// returns the first tick and every other tick after that
const everyOtherTickFilter = (ticks, counter) => (++counter.count % 2 ? ticks : '') // eslint-disable-line

const emptyData = map(range(14), n => ({
  date: moment().subtract(13 - n, 'days').format('DD/MM'),
  total: 0,
  med: 0,
  rec: 0,
}))

const GrossSalesGraph = ({ grossSalesByDay }) => {
  const data = map(grossSalesByDay, ({ date, med, rec, total }) => (
    {
      date: moment(date).format('M/D'),
      med: toNumber(med),
      rec: toNumber(rec),
      total: toNumber(total),
    }))
  const tickCounter = { count: 0 }

  return (
    <div style={{ height: '150px', width: '800px', padding: 5, marginLeft: -10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={200}
          data={isEmpty(data) ? emptyData : data}
          margin={{
            top: 5,
            right: 30,
            bottom: 5,
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

GrossSalesGraph.propTypes = {
  grossSalesByDay: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    rec: PropTypes.string,
    med: PropTypes.string,
    total: PropTypes.string,
  })),
}

export default GrossSalesGraph
