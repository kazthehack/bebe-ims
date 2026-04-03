//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import styled from 'styled-components'
import DatePickerGenerate from 'components/pages/reports/common/DatePickerGenerate'
import { Form } from 'react-final-form'
import moment from 'moment-timezone'

const Wrapper = styled.div`
  margin-left: 16px;
`

const DateFieldPage = () => (
  <Wrapper>
    <Form
      onSubmit={() => {}}
      initialValues={{
        startTime: moment.tz(new Date().setDate(new Date().getDate() - 7), 'America/Los_Angeles').toDate(),
        endTime: moment.tz(new Date(), 'America/Los_Angeles').toDate(),
      }}
      render={({ handleSubmit, values, form }) => {
        const leftArrowClick = (name) => {
          form.change(name, new Date(values[name].setDate(values[name].getDate() - 1)))
        }
        const rightArrowClick = (name) => {
          form.change(name, new Date(values[name].setDate(values[name].getDate() + 1)))
        }
        return (
          <form onSubmit={handleSubmit}>
            <DatePickerGenerate
              startTime={values.startTime}
              endTime={values.endTime}
              leftArrowClick={leftArrowClick}
              rightArrowClick={rightArrowClick}
            />
          </form>
        )
      }}
    />
  </Wrapper>
)

export default DateFieldPage
