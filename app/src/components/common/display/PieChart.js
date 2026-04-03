//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Sector, Cell } from 'recharts'
import { withState } from 'recompose'
import colors, { TABLE_COLORS as tc } from 'styles/colors'
import { numberWithCommas } from 'utils/numbers'

// From the recharts CustomActiveShapePieChart example, reformatted. Shows the fancy stuff
const ActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
  nameKey,
  prefix,
  suffix,
}) => {
  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + ((outerRadius + 10) * cos)
  const sy = cy + ((outerRadius + 10) * sin)
  const mx = cx + ((outerRadius + 30) * cos)
  const my = cy + ((outerRadius + 30) * sin)
  const ex = mx + ((cos >= 0 ? 1 : -1) * 22)
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={colors.grayDark2}>{payload[nameKey]}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} textAnchor={textAnchor} fill="#333">
        {prefix && `${prefix}${numberWithCommas(value.toFixed(2))}`} {/* hard-coded format for now */}
        {suffix && `${value}${suffix}`}
      </text>
      <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  )
}

ActiveShape.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  fill: PropTypes.string,
  payload: PropTypes.object,
  percent: PropTypes.number,
  value: PropTypes.number,
  nameKey: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
}

const NewPieChart = withState('activeIndex', 'setActiveIndex', 0)(
  ({ activeIndex, setActiveIndex, data, height, width, dataKey = 'value', nameKey = 'name', prefix, suffix }) => (
    <PieChart height={height} width={width} fontSize="13" >
      <Tooltip />
      <Legend />
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        activeIndex={activeIndex}
        activeShape={props =>
          <ActiveShape nameKey={nameKey} prefix={prefix} suffix={suffix} {...props} />
        }
        cx={'50%'}
        cy={'50%'}
        innerRadius={60} // Not sure if these numbers should be adjusted
        outerRadius={80}
        fill="#8884d8"
        onMouseEnter={(blahData, index) => setActiveIndex(index)}
      >
        {
          data.map((s, i) => (
            <Cell key={s.categoryId} fill={tc[i % tc.length]} />
          ))
        }
      </Pie>
    </PieChart>
  ),
)

NewPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // TODO: write the shape of this data
  height: PropTypes.number,
  width: PropTypes.number,
  dataKey: PropTypes.string,
  nameKey: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
}

// ResponsiveContainer needed for non-pixel width and height
export const ResponsivePieChart = ({ height, width, ...props }) => (
  <ResponsiveContainer width={width} height={height}>
    <NewPieChart {...props} />
  </ResponsiveContainer>
)

ResponsivePieChart.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default NewPieChart
