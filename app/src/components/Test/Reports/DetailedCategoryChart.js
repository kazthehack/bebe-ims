import React from 'react'
import { ResponsiveStackedAreaChart } from 'components/common/display/StackedAreaChart'

const data = [
  { date: '05/10/2019', 'Blue Dragon': 10, 'Pinot Green': 21, 'Chewdawg Shake': 17 },
  { date: '05/11/2019', 'Blue Dragon': 3, 'Pinot Green': 11, 'Chewdawg Shake': 8, 'Test Flower': 2 },
  { date: '05/12/2019', 'Blue Dragon': 5, 'Pinot Green': 1, 'Chewdawg Shake': 11, 'Test Flower': 7 },
  { date: '05/13/2019', 'Blue Dragon': 15, 'Pinot Green': 6, 'Test Flower': 8 },
  { date: '05/14/2019', 'Pinot Green': 6, 'Chewdawg Shake': 5, 'Test Flower': 5 },
]

const series = [
  { productId: 'UHJvZHVjdDoxMzc=', productName: 'Blue Dragon', color: '#217af1' },
  { productId: 'UHJvZHVjdDoxMzb=', productName: 'Pinot Green', color: '#21f1d6' },
  { productId: 'UHJvZHVjdDoxOTU=', productName: 'Chewdawg Shake', color: '#f1d621' },
  { productId: 'UHJvZHVjdDoyNDM=', productName: 'Test Flower', color: '#21f177' },
]

const DetailedCategoryChart = () => (
  <div>
    <ResponsiveStackedAreaChart data={data} areas={series} width="90%" height={500} />
  </div>
)

export default DetailedCategoryChart
