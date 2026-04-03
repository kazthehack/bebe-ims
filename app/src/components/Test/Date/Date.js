import React from 'react'
import { Form } from 'react-final-form'
import { FormDatePicker } from 'components/common/input/DatePicker'

const DateTest = () => (
  <Form
    initialValues={{
      testing: new Date(),
    }}
    onSubmit={() => {}}
    render={({ handleSubmit }) => (
      <form style={{ margin: '32px 0 0 32px' }} onSubmit={handleSubmit}>
        <FormDatePicker name="testing" />
      </form>
    )}
  />
)

export default DateTest
