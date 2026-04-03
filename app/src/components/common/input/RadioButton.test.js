import React from 'react'
import { mount } from 'enzyme'

import { RadioButton, RadioButtonGroup } from './RadioButton'

describe('<RadioButtonGroup />', () => {
  it('should call onChange event when value updates', () => {
    const onChange = jest.fn()

    const wrapper = mount(
      <RadioButtonGroup defaultValue="C" onChange={onChange}>
        <RadioButton label="A" value="A" />
        <RadioButton label="B" value="B" />
        <RadioButton label="C" value="C" />
      </RadioButtonGroup>,
    )

    const radioButtons = wrapper.find(RadioButton)
    expect(radioButtons).toHaveLength(3)

    const firstButton = radioButtons.at(0)
    firstButton.find('input').simulate('click')

    expect(onChange.mock.calls).toHaveLength(1)
    expect(onChange.mock.calls[0]).toEqual(['A'])
  })

  it('should update state after clicking', () => {
    const wrapper = mount(
      <RadioButtonGroup defaultValue="C">
        <RadioButton label="A" value="A" />
        <RadioButton label="B" value="B" />
        <RadioButton label="C" value="C" />
      </RadioButtonGroup>,
    )

    expect(wrapper.state()).toHaveProperty('value', 'C')

    const radioButtons = wrapper.find(RadioButton)
    expect(radioButtons).toHaveLength(3)

    const firstButton = radioButtons.at(0)
    firstButton.find('input').simulate('click')
    expect(wrapper.state()).toHaveProperty('value', 'A')
  })
})
