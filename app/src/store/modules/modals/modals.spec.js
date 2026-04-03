//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import { reduceStates } from 'redux-foundry'
import reducer from './reducer'
import { push, pop, replace, clear, remove } from './actions'

describe('Modals Stack', () => {
  it('is a function', () => {
    expect(typeof reducer).toBe('function')
  })

  it('produces expected states', () => {
    const simulate = reduceStates([
      push('foo'),
      push('bar'),
      pop(),
      push('baz'),
      replace('bar'),
      push('foo'),
      remove('foo'),
      push('woot'),
      clear(),
    ])
    const states = simulate(reducer)

    expect(states).toEqual([
      [],
      ['foo'],
      ['foo', 'bar'],
      ['foo'],
      ['foo', 'baz'],
      ['foo', 'bar'],
      ['foo', 'bar', 'foo'],
      ['bar'],
      ['bar', 'woot'],
      [],
    ])
  })
})
