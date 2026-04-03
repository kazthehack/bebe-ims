//  Copyright (c) 2017-2018 First Foundry Inc. All rights reserved.

import React, { Component } from 'react'
import { merge, noop } from 'lodash'
import { FormSelectField } from 'components/common/input/SelectField'
import Box from 'components/common/container/Box'
import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import Toggle from 'components/common/input/Toggle'
import TextField, { FormTextField } from 'components/common/input/TextField'
import { FormRadioButton, RadioButtonGroup } from 'components/common/input/RadioButton'
import { FormSearch } from 'components/common/input/Search'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import Button from 'components/common/input/Button'
import Checkbox from 'components/common/input/Checkbox'
import { Form } from 'react-final-form'
import styled from 'styled-components'
import colors from 'styles/colors'
import TooltipSymbol from 'components/common/display/TooltipSymbol'
import { TableSearchField } from 'components/Table'
import 'react-tippy/dist/tippy.css'

const StyledButton = styled(Button)`
  display: block;
`

const SpacerSpan = styled.span`
  margin: 5px;
`

// Test button function
const exampleClicked = () => {
}

const Example = props => (
  <SpacerSpan >{props.children}</SpacerSpan>
)

Example.propTypes = {
  children: PropTypes.node.isRequired,
}

const ButtonsExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Button</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Primary</Subheader>
          <Example><StyledButton id="elem0" primary onClick={exampleClicked}>Submit</StyledButton></Example>
          <Example><StyledButton id="elem1" primary disabled onClick={exampleClicked}>Submit</StyledButton></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Default</Subheader>
          <Example><StyledButton id="elem2" onClick={exampleClicked}>Cancel</StyledButton></Example>
          <Example><StyledButton id="elem3" disabled onClick={exampleClicked}>Cancel</StyledButton></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>White</Subheader>
          <Example><StyledButton id="elem4" white onClick={exampleClicked}>Back</StyledButton></Example>
          <Example><StyledButton id="elem5" white disabled onClick={exampleClicked}>Back</StyledButton></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Link</Subheader>
          <Example><Button id="elem6" link>Download</Button></Example>
          <Example><Button id="elem7" link disabled><div>Download</div></Button></Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const CheckboxesExample = ({ updateCheckboxes, checkboxesState }) => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Checkbox</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Left Side</Subheader>
          <Example>
            <Checkbox
              checked={checkboxesState.left1}
              label={checkboxesState.left1 ? 'checked' : 'unchecked'}
              onChange={() => updateCheckboxes({ left1: !checkboxesState.left1 })}
            />
          </Example>
          <Example>
            <Checkbox
              checked={checkboxesState.left2}
              label={checkboxesState.left2 ? 'checked' : 'unchecked'}
              onChange={() => updateCheckboxes({ left2: !checkboxesState.left2 })}
            />
          </Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Right Side</Subheader>
          <Example>
            <Checkbox
              checked={checkboxesState.right1}
              label={checkboxesState.right1 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right1: !checkboxesState.right1 })}
            />
          </Example>
          <Example>
            <Checkbox
              checked={checkboxesState.right2}
              label={checkboxesState.right2 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right2: !checkboxesState.right2 })}
            />
          </Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>disabled</Subheader>
          <Example>
            <Checkbox
              checked={checkboxesState.right1}
              label={checkboxesState.right1 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right1: !checkboxesState.right1 })}
              disabled
            />
          </Example>
          <Example>
            <Checkbox
              checked={checkboxesState.right2}
              label={checkboxesState.right2 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right2: !checkboxesState.right2 })}
              disabled
            />
          </Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>partiallyChecked</Subheader>
          <Example>
            <Checkbox
              checked={checkboxesState.right1}
              label={checkboxesState.right1 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right1: !checkboxesState.right1 })}
              partiallyChecked
            />
          </Example>
          <Example>
            <Checkbox
              checked={checkboxesState.right2}
              label={checkboxesState.right2 ? 'checked' : 'unchecked'}
              boxOnRight
              onChange={() => updateCheckboxes({ right2: !checkboxesState.right2 })}
              disabled
              partiallyChecked
            />
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

CheckboxesExample.propTypes = {
  updateCheckboxes: PropTypes.func,
  checkboxesState: PropTypes.object,
}

const TogglesExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Toggle</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={3} lg={3}>
          <Form
            onSubmit={() => {}}
            initialValues={{
              tog1: true,
              tog2: true,
            }}
            render={() => (
              <form>
                <Subheader textSizeOption={4}>No Label</Subheader>
                <Toggle />
                <Toggle greenBackground />
              </form>
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={3} lg={3}>
          <Form
            onSubmit={() => {}}
            initialValues={{
              tog1: true,
              tog2: true,
            }}
            render={() => (
              <form>
                <Subheader textSizeOption={4}>No Label or Status</Subheader>
                <Toggle noStatusText />
                <Toggle noStatusText greenBackground />
              </form>
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5}>
          <Form
            onSubmit={() => {}}
            initialValues={{
              tog1: true,
              tog2: false,
              tog3: false,
              tog4: false,
            }}
            render={() => (
              <form>
                <Subheader textSizeOption={4}>Labeled</Subheader>
                <Toggle label="green" greenBackground />
                <Toggle label="disabled" disabled />
                <Toggle label="custom status" checkedStatusText="toggled" uncheckedStatusText="untoggled" statusTextWidth="70px" />
                <Toggle label="no status" checkedStatusText="toggled" noStatusText />
              </form>
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={3} lg={3}>
          <Form
            onSubmit={() => {}}
            initialValues={{
              tog1: true,
              tog2: true,
            }}
            render={() => (
              <form>
                <Subheader textSizeOption={4}>Disabled</Subheader>
                <Toggle checked disabled />
                <Toggle greenBackground checked disabled />
                <Toggle disabled />
              </form>
            )}
          />
        </Col>
      </Row>
    </Grid>
  </Col>
)

const RadioButtonExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>RadioButton</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Example>
            <Subheader textSizeOption={3}>formradiobutton/radiobuttongroup</Subheader>
            <Form
              onSubmit={() => {}}
              initialValues={{ logoutAfterSale: 'false' }}
              render={() => (
                <form>
                  <RadioButtonGroup name="logoutAfterSale" defaultValue="false">
                    <FormRadioButton
                      name="logoutAfterSale"
                      value="false"
                      label="Return to menu after a sale"
                      disabled={false}
                    />
                    <FormRadioButton
                      name="logoutAfterSale"
                      value="true"
                      label="Return to pin-in screen after a sale"
                      disabled={false}
                    />
                  </RadioButtonGroup>
                </form>
              )}
            />
          </Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Example>
            <Subheader textSizeOption={3}>disabled</Subheader>
            <Form
              onSubmit={() => {}}
              initialValues={{ logoutAfterSale: 'false' }}
              render={() => (
                <form>
                  <RadioButtonGroup name="logoutAfterSale" defaultValue="false">
                    <FormRadioButton
                      name="logoutAfterSale"
                      value="false"
                      label="Return to menu after a sale"
                      disabled
                    />
                    <FormRadioButton
                      name="logoutAfterSale"
                      value="true"
                      label="Return to pin-in screen after a sale"
                      disabled
                    />
                  </RadioButtonGroup>
                </form>
              )}
            />
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const TextFieldExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>TextField</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Default</Subheader>
          <Example><TextField id="elem17" /></Example>
          <Example><TextField id="elem18" defaultValue="defaultValue" /></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Disabled</Subheader>
          <Example><TextField id="elem19" defaultValue="defaultValue" disabled /></Example>
          <Example><TextField id="elem20" placeholder="placeholder" disabled prefix="$" /></Example>
          <Example><TextField id="elem20" placeholder="placeholder" disabled suffix="$" /></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Error</Subheader>
          <Example><TextField id="elem25" error="This field is required." meta={{ error: true, touched: true }} /></Example>
          <Example><TextField id="elem26" prefix="$" error="This field is required." meta={{ error: true, touched: true }} defaultValue="defaultValue" /></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Prefix/Suffix</Subheader>
          <Example><TextField prefix="oz" id="elem27" /></Example>
          <Example><TextField suffix="$" id="elem28" defaultValue="12.04" /></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>placeholder</Subheader>
          <Example><TextField id="elem37o" placeholder="placeholder" /></Example>
          <Example><TextField suffix="oz" id="elem38o" placeholder="placeholder" /></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Focus</Subheader>
          <Example><TextField id="elem37o" meta={{ active: true }} /></Example>
          <Example><TextField suffix="oz" id="elem38o" defaultValue="12.04" meta={{ active: true }} /></Example>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Error with Errors</Subheader>
          <Example>
            <Form
              onSubmit={() => {}}
              initialValues={{ boop: 'doot' }}
              validate={() => ({ boop: 'DOOT' })} // The validate prop
              render={() => (
                <form>
                  <FormTextField prefix="$" name="boop" type="text" />
                </form>
              )}
            />
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const SearchExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Search</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Example>
            <Form
              onSubmit={() => {}}
              initialValues={{ boop: 'doot', boop2: 'doot2', boop3: '' }}
              render={() => (
                <form>
                  <FormSearch name="boop3" onSearch={noop} />
                  <FormSearch name="boop" onSearch={noop} />
                  <FormSearch name="boop2" onSearch={noop} disabled />
                  {/* eslint-disable-next-line no-alert */}
                  <TableSearchField onSearch={val => alert(val)} />
                </form>
              )}
            />
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const discountTypesOptions = [{
  name: 'Fixed amount off',
  value: 'amount-fixed',
}, {
  name: 'Fixed percent off',
  value: 'amount-percentage',
}, {
  name: 'Custom amount off',
  value: 'custom-fixed',
}, {
  name: 'Custom percent off',
  value: 'custom-percentage',
}]


const discountTypesComboOptions = [{
  value: 'Fixed amount off',
}, {
  value: 'Fixed percent off',
}, {
  value: 'Custom amount off',
}, {
  value: 'Custom percent off',
}]

const SelectExamples = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Selectors</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Example>
            <Form
              onSubmit={() => {}}
              initialValues={{ boop: 'doot', boop2: 'doot2', boop3: '' }}
              render={() => (
                <form>
                  <FormSelectField name="amountType" options={discountTypesOptions} />
                  <FormSelectField name="amountTypeTest" comboBox options={discountTypesComboOptions} />
                </form>
              )}
            />
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const NoPaddingSubheader = styled(Subheader)`
  padding: 0;
  margin: 0;
`

const SubheadersExample = () => (
  <Col xs={12} sm={12} md={12} lg={12}>
    <Subheader textSizeOption={2}>Subheaders</Subheader>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Size 1</Subheader>
          <Example><Subheader textSizeOption={1}>Subheader</Subheader></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Size 2</Subheader>
          <Example><Subheader textSizeOption={2}>Subheader</Subheader></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Size 3</Subheader>
          <Example><Subheader textSizeOption={3}>Subheader</Subheader></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Size 4</Subheader>
          <Example><Subheader textSizeOption={4}>subheader</Subheader></Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Colors</Subheader>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.blueishGray}
            >
              greyDark4
            </NoPaddingSubheader>
          </Example>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.grayDark2}
            >
              greyDark2
            </NoPaddingSubheader>
          </Example>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.blueishGray}
            >
              greyLight4
            </NoPaddingSubheader>
          </Example>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Subheader textSizeOption={3}>Colors</Subheader>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.blue}
            >
              blue
            </NoPaddingSubheader>
          </Example>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.grayLight}
            >
              greyLight
            </NoPaddingSubheader>
          </Example>
          <Example>
            <NoPaddingSubheader
              textSizeOption={4}
              color={colors.red}
            >
              error
            </NoPaddingSubheader>
          </Example>
        </Col>
      </Row>
    </Grid>
  </Col>
)

const NoPaddingBox = styled(Box)`
  padding: 0;
`

export default class DesignReferencePage extends Component {
  constructor(...args) {
    super(...args)

    this.updateCheckboxes = this.updateCheckboxes.bind(this)
    this.state = {
      checkboxesState: {
        left1: false,
        left2: true,
        right1: false,
        right2: true,
      },
    }
  }

  updateCheckboxes(value) {
    this.setState(merge({}, this.state, { checkboxesState: value }))
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NoPaddingBox>
              <Grid fluid style={{ padding: 0, margin: 0 }}>
                <TooltipSymbol />
                <Row>
                  <ButtonsExample />
                  <RadioButtonExample />
                  <CheckboxesExample
                    updateCheckboxes={this.updateCheckboxes}
                    checkboxesState={this.state.checkboxesState}
                  />
                  <TogglesExample />
                  <TextFieldExample />
                  <SearchExample />
                  <SelectExamples />
                  <SubheadersExample />
                </Row>
              </Grid>
            </NoPaddingBox>
          </Col>
        </Row>
      </Grid>
    )
  }
}
