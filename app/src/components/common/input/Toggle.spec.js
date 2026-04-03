import React from 'react'
import { shallow, render } from 'enzyme'
import Toggle, { UncontrolledToggle } from './Toggle'

describe('<Toggle />', () => {
  describe('<UncontrolledToggle />', () => {
    it('does render', () => {
      expect(() => {
        shallow(<UncontrolledToggle />)
      }).not.toThrow()
    })

    it('renders expected elements', () => {
      const wrapper = render(<UncontrolledToggle />)
      const firstChildInner = wrapper.children().first().children().first()
      expect(firstChildInner.is('input')).toBe(true)
    })

    it('accepts statusText prop and uses its text', () => {
      const wrapper = render(
        <UncontrolledToggle statusText="foo" />,
      )
      expect(wrapper.text()).toEqual('foo')
    })

    it('accepts label prop and uses its text', () => {
      const wrapper = shallow(<UncontrolledToggle label="bar" />)
      const label = wrapper.children().get(0)
      expect(label.props.children).toEqual('bar')
    })

    it('accepts labelStyle prop and applies it as a style prop', () => {
      const wrapper = render(
        <UncontrolledToggle labelStyle={{ color: 'red' }} />,
      )
      expect(wrapper.prop('style')).toMatchObject({ color: 'red' })
    })

    it('accepts any other props and spreads them on the checkbox', () => {
      const wrapper = shallow(
        <UncontrolledToggle checked misSpelledProp />,
      )
      const checkbox = wrapper.children().first().children().first()
        .dive()
      expect(checkbox.props()).toMatchObject({ checked: true })
      expect(checkbox.props()).toMatchObject({ misSpelledProp: true })
    })
  })

  describe('<Toggle />', () => {
    it('does render', () => {
      expect(() => {
        shallow(<Toggle />)
      }).not.toThrow()
    })

    it('intializes local state', () => {
      const wrapper = shallow(<Toggle />)
      expect(wrapper.state('checked')).toBe(false)
    })

    it('accepts a checked prop and initializes state based on it', () => {
      const wrapper = shallow(<Toggle checked />)
      expect(wrapper.state('checked')).toBe(true)
    })

    it('accepts a value prop and initializes state based on it', () => {
      const wrapper = shallow(<Toggle value />)
      expect(wrapper.state('checked')).toBe(true)
    })

    it('accepts a checkedStatusText and uncheckedStatusText prop and passes it to its child based on state', () => {
      const wrapper = shallow(<Toggle checkedStatusText="checked!" uncheckedStatusText="not checked." />)
      const status = wrapper.dive().children().last().children()
        .last()
        .dive()
        .children()
      expect(status.text()).toEqual('not checked.')
      wrapper.setState({ checked: true })
      const checkedStatus = wrapper.dive().children().last().children()
        .last()
        .dive()
        .children()
      expect(checkedStatus.text()).toEqual('checked!')
    })

    it('passes \'ON\' and \'OFF\' to its child as checkedStatusText and uncheckedStatusText if none are given', () => {
      const wrapper = shallow(<Toggle />)
      const status = wrapper.dive().children().last().children()
        .last()
        .dive()
        .children()
      expect(status.text()).toEqual('OFF')
      wrapper.setState({ checked: true })
      const checkedStatus = wrapper.dive().children().last().children()
        .last()
        .dive()
        .children()
      expect(checkedStatus.text()).toEqual('ON')
    })

    it('accepts a noStatusText prop and if true passes statusText to its child as null', () => {
      const wrapper = shallow(<Toggle noStatusText />)
      const status = wrapper.dive().children().last().children()
        .last()
        .dive()
        .children()
      expect(status).toHaveLength(0)
    })

    it('accepts any other props and passes them to its child', () => {
      const wrapper = shallow(<Toggle readOnly />)
      const checkbox = wrapper.dive().children().first().children()
        .first()
      expect(checkbox.props()).toMatchObject({ readOnly: true })
    })

    it('passes its child a checked prop based on its state', () => {
      const wrapper = shallow(<Toggle />)
      wrapper.setState({ checked: true })
      const checkbox = wrapper.dive().children().first().children()
        .first()
      expect(checkbox.prop('checked')).toBe(true)
    })

    it('updates checked state on updateValue call', () => {
      const wrapper = shallow(<Toggle />)
      const instance = wrapper.instance()
      instance.updateValue({ target: { checked: true } })
      expect(wrapper.state('checked')).toBe(true)
    })
    // TODO: Revise this if we pull in sinon to spy on function calls or something similar
    it('calls onChange with an event when updateValue is called', () => {
      let x = false
      const onChangeCallback = (e) => {
        if (e) {
          x = true
        }
      }
      const wrapper = shallow(<Toggle onChange={onChangeCallback} />)
      const instance = wrapper.instance()
      instance.updateValue({ target: { checked: true } })
      expect(x).toBe(true)
    })
  })
})
