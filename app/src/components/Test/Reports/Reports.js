//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { withState } from 'recompose'
import SelectField from 'components/common/input/SelectField'
import HeaderPage from './Header'
import SalesByProductGraphPage from './SalesByProductGraph'
import SalesByProductTablePage from './SalesByProductReportTable'
import DetailedCategoryChart from './DetailedCategoryChart'
import DateFieldPage from './DateField'
import DetailedCategoryTablePage from './DetailedCategoryTablePage'

const LandingDisplay = () => (
  <div>
    Hello! This is a test route for developers to collaborate on different pieces of the
    reports components.
  </div>
)

const returnDisplayable = {
  landing: LandingDisplay(),
  header: HeaderPage(),
  graph: SalesByProductGraphPage(),
  productTable: SalesByProductTablePage(),
  detailedCategoryChart: DetailedCategoryChart(),
  dateField: DateFieldPage(),
  detailedCategory: DetailedCategoryTablePage(),
}

const options = [
  {
    name: 'Landing',
    value: 'landing',
  }, {
    name: 'Header',
    value: 'header',
  }, {
    name: 'Sales By Product Graph',
    value: 'graph',
  }, {
    name: 'Sales By Product Table',
    value: 'productTable',
  }, {
    name: 'Detailed Category Report Chart',
    value: 'detailedCategoryChart',
  }, {
    name: 'Date Field',
    value: 'dateField',
  }, {
    name: 'Detailed Category Report Table',
    value: 'detailedCategory',
  },
]

const ReportsPage = withState(
  'display',
  'setDisplay',
  'dateField',
)(({
  display,
  setDisplay,
}) => (
  <div>
    Display:
    <SelectField
      value={display}
      options={options}
      name="display"
      onChange={(e) => {
        setDisplay(e.target.value)
      }}
    />
    <br />
    {returnDisplayable[display]}
  </div>
))

ReportsPage.propTypes = {
  display: PropTypes.string,
  setDisplay: PropTypes.func,
}

export default ReportsPage
