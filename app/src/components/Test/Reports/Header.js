//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import ReportHeader from 'components/pages/reports/common/ReportHeader'
import { FormCheckbox } from 'components/common/input/Checkbox'

const Wrapper = styled.div`
  margin: 16px;
`

const list = [{
  value: 'Product1',
}, {
  value: 'Product2',
}]

const HeaderPage = () => (
  <Wrapper>
    <Form
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <FormCheckbox
            name="comboField"
            label="Show combo field?"
          />
          <ReportHeader comboField={values.comboField} comboList={list} />
        </form>
      )}
    />
  </Wrapper>
)

export default HeaderPage
