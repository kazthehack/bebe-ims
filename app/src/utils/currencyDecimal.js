// TODO: remove this file

export const roundToTwoDecimals = value => (
  Math.round(value * 100) / 100
)

export const roundDownToTwoDecimals = value => (
  Math.floor(value * 100) / 100
)

export const roundUpToTwoDecimals = value => (
  Math.ceil(value * 100) / 100
)

export const showTwoDecimals = (value) => {
  if (typeof value === 'undefined' || value === '') return undefined
  if (value === 'Invalid') return value
  const newValue = value.toString()
  const decIndex = newValue.indexOf('.')
  const end = newValue.substring(decIndex + 1)
  if (decIndex === -1) return `${newValue}.00`
  else if (end === '') return `${newValue}00`
  else if (end.length === 1) return `${newValue}0`
  return newValue
}
