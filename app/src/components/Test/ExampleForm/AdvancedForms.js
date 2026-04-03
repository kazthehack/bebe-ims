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

const AdvancedForms = () => (
  <Fragment>
    {/*     FORM WITH RESET BUTTON

      The reset works by bringing in the 'form' render prop. You can then call form.reset to reset
      the form values to whatever is given to the initialValues, or to blank if no initialValues
      were specified. 'form' gives access to the full final-form form API.
      */}
    <Form
      onSubmit={onSubmit}
      initialValues={initalizedValues}
      render={({ handleSubmit, form }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with reset to initial values</Subheader>
          <p>The reset button resets the form to what it was initialized as.
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
          {/* Use form.reset to reset the form. Reset can accept arguments as well, similarly to
            initialValues. The form will then be set to those values. */}
          <Button onClick={form.reset} type="button">Reset</Button>
        </StyledForm>
      )}
    />


    {/*     FORM WITH DISABLED BUTTONS BASED ON FORM STATE

      This form has its reset and submit buttons disabled until something on the form has been
      changed and it's also not submitting. The pristine render prop returns true if the current
      form values == initialValues. This might be useful to use with mutations to prevent needless
      API calls. The submitting render prop is true after handleSubmit is called until it finishes
      executing. This could be useful to prevent people double-pressing the submit button. */}
    <Form
      onSubmit={onSubmit}
      initialValues={defaultInitialValues}
      render={({ handleSubmit, form, pristine, submitting }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with disabled buttons</Subheader>
          <p>The buttons on this form are disabled until any field is edited and also when its
            submitting.
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
          <Button primary type="submit" disabled={pristine || submitting}>Submit</Button>
          <Button onClick={form.reset} type="button" disabled={pristine || submitting}>Reset</Button>
        </StyledForm>
      )}
    />


    {/*     FORM WITH CONDITIONAL RENDERING BASED OR FORM STATE

      This form uses the 'values' render prop to conditionally render one set of fields based on
      the value of another. Since final-form effectively stores the form's state for us, this
      approach is preferable to using react-state in probably every case. The values prop gives
      access to all the values in the form. */}
    <Form
      onSubmit={onSubmit}
      initialValues={defaultInitialValues}
      render={({ handleSubmit, form, values }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with conditional rendering</Subheader>
          <p>The checkbox in this form renders the group checkboxes if checked.
          </p>
          <Spacer />
          <FormCheckbox name="soloCheckbox" label="Solo Checkbox" />
          {values.soloCheckbox &&
            <Fragment>
              <Spacer />
              <FormCheckbox name="groupCheckbox" label="Group Checkbox 1" value="1" />
              <FormCheckbox name="groupCheckbox" label="Group Checkbox 2" value="2" />
              <FormCheckbox name="groupCheckbox" label="Group Checkbox 3" value="3" />
            </Fragment>
          }
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
          <Button onClick={form.reset} type="button">Reset</Button>
        </StyledForm>
      )}
    />


    {/*     FORM USING META FIELD RENDER PROP

      This form showcases the meta field render prop. This uses the meta data for conditional
      rendering, but we might use it more often to change styling or something along those lines.
      There are a lot more meta fields than the ones I use here (there are 14?), but many are very
      similar to each other. */}
    <Form
      onSubmit={onSubmit}
      initialValues={defaultInitialValues}
      render={({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Subheader>Form with Fields using meta field render prop.</Subheader>
          <p>This form has a field that uses the meta Field render prop.
          </p>
          <Field
            name="select"
            render={({ input, meta }) => (
              <Fragment>
                <SelectField
                  name="selectField"
                  options={selectOptions}
                  {...input}
                />
                {meta.active && <div>ACTIVE</div>}
                {meta.touched && <div>TOUCHED</div>}
                {meta.dirty && <div>DIRTY</div>}
                {meta.pristine && <div>PRISTINE</div>}
                {meta.visited && <div>VISITED</div>}
              </Fragment>
            )}
          />
          <Spacer />
          <Button primary type="submit">Submit</Button>
        </StyledForm>
      )}
    />
  </Fragment>
)

export default AdvancedForms
