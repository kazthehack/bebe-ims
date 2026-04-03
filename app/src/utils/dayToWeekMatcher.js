import { get, invert } from 'lodash'

const weekObject = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export const DAYS = Object.keys(weekObject)

export const weekLookup = day => get(weekObject, day, null)

export const dayLookup = num => (
  (num === 7) ? DAYS[0] : get(invert(weekObject), num, null)
)
