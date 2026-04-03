import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import colors from 'styles/colors'
import { map, toNumber, range, isEmpty } from 'lodash'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// returns the first tick and every other tick after that
const everyOtherTickFilter = (ticks, counter) => ( ++counter.count % 2 ? ticks : '') // eslint-disable-line

const emptyData = map(range(14), n => ({
  hour: moment().subtract(13 - n, 'hours').format('ha'),
  sales: 0,
}))

const TodaysSalesHourlyGraph = ({ salesByHour }) => {
  const data = map(salesByHour, ({ hour, sales }) => ({ hour: moment(hour, 'hh:mm:ss').format('ha'), sales: toNumber(sales) }))
  const tickCounter = { count: 0 }

  return (
    <div style={{ height: '150px', width: '800px', padding: 5, marginLeft: -10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={700}
          height={280}
          data={isEmpty(data) ? emptyData : data}
          margin={{
            top: 5,
            right: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 'bold' }} interval={0} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
            tickFormatter={tick => everyOtherTickFilter(tick, tickCounter)}
          />
          <Tooltip />
          <Line type="linear" dataKey="sales" stroke={colors.dashboardGraphs.blue} strokeWidth={2} r={4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

TodaysSalesHourlyGraph.propTypes = {
  salesByHour: PropTypes.arrayOf(PropTypes.shape({
    hour: PropTypes.string,
    sales: PropTypes.string,
  })),
}

export default TodaysSalesHourlyGraph
