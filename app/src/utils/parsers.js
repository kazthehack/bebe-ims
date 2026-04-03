import { trimStart, toNumber } from 'lodash'

const SanitizedString = val => (val ? trimStart(val) : '')

// only positive
export const intParser = val => val.replace(/[\D.]/g, '')
export const floatParser = (val) => {
  const v = val.replace(/[^\d.]/g, '')
  const u = v.split('.')
  if (u.length > 2) return `${u[0]}.${u.slice(1, u.length).join('')}`
  return v
}
export const getFloatParserPrecision = precision => (val) => {
  const v = val.replace(/[^\d.]/g, '')
  const u = v.split('.')
  if (u.length >= 2) return `${u[0]}.${u.slice(1, u.length).join('').slice(0, precision)}`
  return v
}

export const getRangeParser = (min, max, precision) => (value) => {
  const val = getFloatParserPrecision(precision)(value)
  if (!val) return ''
  if (val === '.') return '0.'
  const fVal = parseFloat(val)
  if (min && fVal < min) return min.toString()
  if (max && fVal > max) return max.toString()
  return val
}


export const combineParsers = (...parsers) => val => (
  parsers.reduce((accumulator, parse) => parse(accumulator), val)
)


// Parses an input to be a positive float limited to two decimal places. Returns undefined if
// non-numbers except for '.' are present, or if more than one '.' is present.
export const recursiveParseInputAsCurrency = (value, allowCents = true) => {
  const newValue = toNumber(value)
  const decIndex = value.indexOf('.')
  if (value === '') {
    return value
  } else if (decIndex > -1) {
    if (!allowCents) {
      return undefined
    }
    const start = value.substring(0, decIndex)
    const end = value.substring(decIndex + 1)
    const startOK = recursiveParseInputAsCurrency(start, false)
    const endOK = recursiveParseInputAsCurrency(end, false)
    if (typeof startOK === 'undefined' || typeof endOK === 'undefined') {
      return undefined
    }
    return `${start}.${endOK}`
  } else if (Number.isNaN(newValue) || (value.indexOf('-') > -1)) {
    return undefined
  } if (!allowCents) {
    return value.substring(0, 2)
  }
  return value
}


export default SanitizedString
