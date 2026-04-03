import { isNaN, isFinite } from 'lodash'

export const numberWithCommas = x => (
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
)

export const isNumeric = value => (
  !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
)
