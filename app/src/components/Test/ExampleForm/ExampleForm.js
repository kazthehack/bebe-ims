import React, { Component } from 'react'
import Button from 'components/common/input/Button'
import BasicForms from './BasicForms'
import AdvancedForms from './AdvancedForms'
import ValidatedForms from './ValidatedForms'
import ApolloExampleForm from './ApolloExampleForm'

class FormSwitcher extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      display: 3,
    }
  }

  switchDisplay = (display) => {
    this.setState({ display })
  }

  render() {
    return (
      <div>
        <Button onClick={() => this.switchDisplay(0)}>Basic Forms</Button>
        <Button onClick={() => this.switchDisplay(1)}>Advanced Forms</Button>
        <Button onClick={() => this.switchDisplay(2)}>Validated Forms</Button>
        <Button onClick={() => this.switchDisplay(3)}>Apollo Form</Button>
        {this.state.display === 0 && <BasicForms />}
        {this.state.display === 1 && <AdvancedForms />}
        {this.state.display === 2 && <ValidatedForms />}
        {this.state.display === 3 && <ApolloExampleForm />}
      </div>
    )
  }
}

export default FormSwitcher
