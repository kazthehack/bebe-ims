//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/4/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import PropTypes from 'prop-types'
// import PropTypes from 'prop-types'
import Well from 'components/common/container/Well'

import mockTaxTemplatesData from 'data/mockTaxTemplatesData'

import { forEach } from 'lodash'

const TaxesWell = ({ style = {} }) => {
  const taxes = []
  forEach(mockTaxTemplatesData, (dat, key) => {
    taxes.push(<li key={key}>{dat.title}</li>)
  })

  return (
    <Well title="Taxes" style={style}>
      <ul>
        {taxes.map(tax => tax)}
      </ul>
    </Well>
  )
}

TaxesWell.propTypes = {
  style: PropTypes.object,
}

export default TaxesWell
