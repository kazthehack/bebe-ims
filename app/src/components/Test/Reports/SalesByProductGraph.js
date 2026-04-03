//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import { ResponsiveLineChart } from 'components/common/display/LineChart'

const testSeries = [{
  name: 'Series 1',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 2',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 3',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 4',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 5',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 6',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 7',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 8',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 9',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 10',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}, {
  name: 'Series 11',
  data: [
    { category: '12/30/2017 8:00', value: Math.random() },
    { category: '12/30/2017 10:00', value: Math.random() },
    { category: '12/30/2017 12:00', value: Math.random() },
  ],
}]

const SalesByProductGraphPage = () => (
  <div>
    <ResponsiveLineChart series={testSeries} width="100%" height={350} />
  </div>
)

export default SalesByProductGraphPage
