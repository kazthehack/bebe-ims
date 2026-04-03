import { split } from 'lodash'

export const decodeGlobalId = (encodedID = '') => {
  try {
    return split(atob(encodedID), ':')
  } catch (error) {
    return `Invalid Global ID - ${error}`
  }
}

export const decodeGlobalIdKey = (encodedID = '') =>
  decodeGlobalId(encodedID)[0]

export const decodeGlobalIdValue = (encodedID = '') =>
  decodeGlobalId(encodedID)[1]
