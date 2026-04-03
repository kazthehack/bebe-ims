import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Form, Field } from 'react-final-form'
import { FormCheckbox } from 'components/common/input/Checkbox'
import Subheader from 'components/common/display/Subheader'
import Button from 'components/common/input/Button'
import { FormRadioButton, RadioButtonGroup } from 'components/common/input/RadioButton'
import SelectField from 'components/common/input/SelectField'
import { FormTextField } from 'components/common/input/TextField'
import { FormToggle } from 'components/common/input/Toggle'

const StyledForm = styled.form`
  padding: 16px 0 16px 32px;
`

const Spacer = styled.div`
  height: 24px;
  width: 100%;
`

const initalizedValues = {
  soloCheckbox: true,
  groupCheckbox: ['1', '3'],
  radioButton: '2',
  select: '3',
  textField: 'Example text field',
  toggle: true,
}

const selectOptions = [
  { name: 'Option 1', value: '1' },
  { name: 'Option 2', value: '2' },
  { name: 'Option 3', value: '3' },
]

const onSubmit = (data) => {
  console.log(data) // eslint-disable-line no-console
}

// Synchronous record-level validator for first form. Called with values field and returns errors.
const onValidate = (values) => {
  const errors = {}
  if (!values.soloCheckbox) {
    errors.soloCheckbox = 'Required!'
  } if (values.groupCheckbox.length < 1) {
    errors.groupCheckbox = 'At least 1 is required!'
  } if (!values.radioButton) {
    errors.radioButton = 'Required!'
  } if (values.select === '') {
    errors.select = 'Required!'
  } else if (values.select === '1') {
    errors.select = 'Not that one!'
  } if (!values.textField || values.textField === '') {
    errors.textField = 'Required!'
  }
  return errors
}

// Functions to spoof an async validator
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = async (value) => {
  await sleep(400)
  if (value === '1') {
    return 'Not 1!'
  }
  return undefined
}

const ValidatedForms = () => (
  <Fragment>
    {/*     SYNCHRONOUS FORM-LEVEL VALIDATION EXAMPLE

      This form uses Form's validate prop to pass it a validation function. This validation
      function runs every time a value is changed or when the form is submitted. It has values
      as a parameter and returns an object that is the same shape as values with strings the value
      of each field. If the string is present, there is an error with that Field. If the value is
      undefined, there is not an error. onSubmit will not run if there are any errors. The errors
      Form render prop is object containing the errors for each Field. The errors can also be
      accessed from Field render prop, meta. The meta.error attribute contains the error for that
      Field only. */}
    <Form
      onSubmit={onSubmit}
      initialValues={initalizedValues}
      validate={onValidate} // The validate prop
      render={({ handleSubmit, form, errors }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with synchronous record-level validation</Subheader>
          <p>This form validates the values of all the inputs in different ways. Unfortunately, most
            of the fields arent set up to support error displays yet, so I added the live view of
            the errors. SelectField and TextField support error displays in this example.
          </p>
          <Spacer />
          <FormCheckbox name="soloCheckbox" label="Solo Checkbox" />
          <Spacer />
          <FormCheckbox name="groupCheckbox" label="Group Checkbox 1" value="1" />
          <FormCheckbox name="groupCheckbox" label="Group Checkbox 2" value="2" />
          <FormCheckbox name="groupCheckbox" label="Group Checkbox 3" value="3" />
          <Spacer />
          <RadioButtonGroup>
            <FormRadioButton name="radioButton" label="Radio Button 1" value="1" />
            <FormRadioButton name="radioButton" label="Radio Button 2" value="2" />
            <FormRadioButton name="radioButton" label="Radio Button 3" value="3" />
          </RadioButtonGroup>
          <Spacer />
          <Field
            name="select"
            render={({ input, meta }) => (
              <Fragment>
                <SelectField
                  name="selectField"
                  options={selectOptions}
                  {...input}
                />
                {/* Here I use meta.error to display the error, but only if the field has been
                  touched. touched is true if the field has been focused and then unfocused, or
                  if the form has been submitted. */}
                {meta.touched && meta.error && <div>{meta.error}</div>}
              </Fragment>
            )}
          />
          <Spacer />
          <FormTextField name="textField" type="text" width="320px" placeholder="Text Field" />
          <Spacer />
          <FormToggle name="toggle" />
          <Spacer />
          <Button primary type="button" onClick={handleSubmit}>Submit</Button>
          <Button onClick={form.reset} type="button">Reset</Button>
          {/* Here I'm using the errors Form render prop to visualize the errors in the form. */}
          <pre>{JSON.stringify(errors, 0, 2)}</pre>
        </StyledForm>
      )}
    />


    {/*     SYNCHRONOUS FIELD-LEVEL VALIDATION EXAMPLE

      This works very similarly to the previous example, but it uses the validate prop on the Field,
      rather than the Form, so that the validate function only validates one Field at a time.
      Otherwise, it works the same. It's also possible to write a helper function so we can apply
      multiple validation functions to one Field This type of validation is what I foresee us using
      most often in our app. It would allow as to reuse common validators across multiple forms. */}
    <Form
      onSubmit={onSubmit}
      initialValues={initalizedValues}
      render={({ handleSubmit, form, errors }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with synchronous field-level validation</Subheader>
          <p>The Field on this form validates as an error if the input is set to Option 1.
          </p>
          <Spacer />
          <Field
            name="select" // This validate prop contains the validation function for this example.
            validate={value => (value === '1' ? 'Not one!' : undefined)}
            render={({ input, meta }) => (
              <Fragment>
                <SelectField
                  name="selectField"
                  options={selectOptions}
                  {...input}
                />
                {meta.touched && meta.error && <div>{meta.error}</div>}
              </Fragment>
            )}
          />
          <Spacer />
          <Button primary type="button" onClick={handleSubmit}>Submit</Button>
          <Button onClick={form.reset} type="button">Reset</Button>
          <pre>{JSON.stringify(errors, 0, 2)}</pre>
        </StyledForm>
      )}
    />


    {/*     ASYNCHRONOUS FIELD-LEVEL VALIDATION EXAMPLE

      This example is the same as the previous, except that the validation function passed to the
      Field prop is asynchronous. This would be used if we validated a Field against the backend,
      such as if we were checking if a username already existed, or an ID etc. I use the validating
      Form render prop to tell if we are waiting for the results of a validation function. */}
    <Form
      onSubmit={onSubmit}
      initialValues={initalizedValues}
      render={({ handleSubmit, form, validating }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with asynchronous field-level validation</Subheader>
          <p>This form works the same as the previous, but with an asynchronous validation function.
            Fails if 1 is selected. Loading thing is displayed and submit disabled while validation
            is ongoing.
          </p>
          <Spacer />
          <Field
            name="select"
            validate={asyncValidate}
            render={({ input, meta }) => (
              <Fragment>
                <SelectField
                  name="selectField"
                  placeholder="Select a value (not 1)"
                  options={selectOptions}
                  {...input}
                />
                {/* Spinner displaying while validating is true (except without spinner) */}
                {validating && <div>Validating... (put spinner here)</div>}
                {meta.touched && meta.error && <div>{meta.error}</div>}
              </Fragment>
            )}
          />
          <Spacer />
          <Button disabled={validating} primary type="button" onClick={handleSubmit}>Submit</Button>
          <Button onClick={form.reset} type="button">Reset</Button>
        </StyledForm>
      )}
    />
  </Fragment>
)

export default ValidatedForms
