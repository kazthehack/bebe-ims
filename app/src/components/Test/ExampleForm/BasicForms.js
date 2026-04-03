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

const defaultInitialValues = {
  soloCheckbox: false,
  groupCheckbox: [],
  radioButton: '',
  select: '',
  textField: '',
  toggle: false,
}

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

const BasicForms = () => (
  <Fragment>
    {/*     BASIC FORM EXAMPLE

      This a very basic form using all the different types of inputs we have in the app. <Form />
      needs an onSubmit function, which will call-back when <form /> is submitted, and a render, in
      which you return the rest of the <form /> (StyledForm here), with all of the <Field />s
      inside  of that <form />. Alternatively, you can use the component prop, which works very
      similarly. A <Form /> needs a <form /> inside of it, and a <Field /> must be inside of
      a <Form />. This form does not have initialValues specified, so when you press submit, no
      value will be present for any field unless that field was changed, including the selectField,
      which isn't starting blank. This could be useful if we don't want some optional fields to be
      included in a mutation unless they were changed.
      */}
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form without default values</Subheader>
          <p>This form doesnt utilize the initialValues prop to set an intial value for the form. As
             a result, not only do many of the form components not start with a default value, but
             they will not be included with the submitted data unless theyve been changed. Press
             Submit to print the data to console.
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
          {/* <Field />s wrap any input whose value we want to be included in the form submission.
            For most of the inputs on this form, the <Field /> is hidden in our components. This
            SelectField doesn't support that yet, so it makes a good example. The 'name' prop is how
            final-form differentiates between different fields. That name is the key that field is
            assigned in the data object that is returned on submission. The render prop renders the
            provided component. The 'input' render prop contains a value, onChange, onBlur, and
            onFocus. These allow final-form to control the value of the inputs, if those props are
            spread on the base <input />. Value seems to only provide an inital value, if one of the
            corresponding name was provided in an object to the <Form />'s initialValues. onChange
            will update final-form's record of the value of the input, so it's very important that
            is called. Because final-form is controlling the value of these inputs, it can cause
            conflict when we attempt to control the value of an input as well. */}
          <Field
            name="select"
            render={({ input }) => (
              <SelectField
                name="selectField"
                options={selectOptions}
                placeHolder="placeHolder"
                {...input}
              />)
            }
          />
          <Spacer />
          <FormTextField name="textField" type="text" width="320px" placeholder="Text Field" />
          <Spacer />
          <FormToggle name="toggle" />
          <Spacer />
          {/* A button of type submit calls <form />'s onSubmit as long as it does not also specify
          an onClick function. If you need to also call a function onClick, you can programmatically
          the <form />'s submit using one of the <Form />'s render props. */}
          <Button primary type="submit">Submit</Button>
        </StyledForm>
      )}
    />


    {/*     FORM WITH BLANK INTIALIZED VALUES

      This form has initialValues specified as all blank. This way the values will always be
      included in the onSubmit data. Note that submit value for the selectField starts as blank
      since it is initialized as blank, even though the selectField actually starts on the first
      option since it doesn't support a blank value. This is fixed if the value is changed. */}
    <Form
      onSubmit={onSubmit}
      initialValues={defaultInitialValues}
      render={({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with blank default values</Subheader>
          <p>This form has default values specified using initialValues, but theyre initalized to
             be blank. This way they are included in the submit data, even if they were not changed.
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
            render={({ input }) => (
              <SelectField
                name="selectField"
                options={selectOptions}
                {...input}
              />
            )}
          />
          <Spacer />
          <FormTextField name="textField" type="text" width="320px" placeholder="Text Field" />
          <Spacer />
          <FormToggle name="toggle" />
          <Spacer />
          <Button primary type="submit">Submit</Button>
        </StyledForm>
      )}
    />


    {/*     FORM WITH INITIALIZED VALUES

      This form has actual values passed to its initialValues prop. Otherwise, it's
      the same as the previous example.
      */}
    <Form
      onSubmit={onSubmit}
      initialValues={initalizedValues}
      render={({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with initialized values</Subheader>
          <p>This form has initialized values, which can be used to fill out a form with
             information from the back-end, for example.
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
            render={({ input }) => (
              <SelectField
                name="selectField"
                options={selectOptions}
                {...input}
              />
            )}
          />
          <Spacer />
          <FormTextField name="textField" type="text" width="320px" placeholder="Text Field" />
          <Spacer />
          <FormToggle name="toggle" />
          <Spacer />
          <Button primary type="submit">Submit</Button>
        </StyledForm>
      )}
    />
  </Fragment>
)

export default BasicForms
