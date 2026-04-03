import { roundToTwoDecimals } from './currencyDecimal'

const scale = (value, currentScale, desiredScale) => (
  roundToTwoDecimals((value / currentScale) * desiredScale)
)

export default scale
