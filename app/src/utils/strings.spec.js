import {
  fromNowShortHand,
} from './strings'

describe('Minutes', () => {
  it('Should report 1 minute if time if > 0 and < 1 minute', () => {
    expect(fromNowShortHand(new Date()))
      .toBe('1m')
  })
  it('Should report 1 minute if time if > 0 and < 1 minute', () => {
    const dt = new Date()
    dt.setSeconds(dt.getSeconds() - 58)
    expect(fromNowShortHand(dt))
      .toBe('1m')
  })
  it('Should report multiple minutes if still less than an hour', () => {
    const dt = new Date()
    dt.setMinutes(dt.getMinutes() - 3)
    expect(fromNowShortHand(dt)).toBe('3m')

    const dt2 = new Date()
    dt2.setMinutes(dt2.getMinutes() - 42)
    expect(fromNowShortHand(dt2)).toBe('42m')
  })
  it('Should report multiple hours if still less than a day', () => {
    const dt = new Date()
    dt.setHours(dt.getHours() - 13)
    expect(fromNowShortHand(dt)).toBe('13h')
  })
  it('Should report multiple days if > 24 hours', () => {
    const dt = new Date()
    dt.setHours(dt.getHours() - 30)
    expect(fromNowShortHand(dt)).toBe('1d')
    const dt2 = new Date()
    dt2.setHours(dt2.getHours() - 77)
    expect(fromNowShortHand(dt2)).toBe('3d')
  })
  it('Should work for very long time difference', () => {
    const dt = new Date()
    dt.setHours(dt.getHours() - 7200000)
    expect(fromNowShortHand(dt)).toBe('300000d')
  })
})
