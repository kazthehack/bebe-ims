import { isString, split, size, padEnd } from 'lodash'
import differenceInDays from 'date-fns/difference_in_days'
import differenceInHours from 'date-fns/difference_in_hours'
import differenceInMinutes from 'date-fns/difference_in_minutes'

function sentenceCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const truncateStringNumberToFixedDecimals = (string, decimals = 2) => {
  if (isString(string)) {
    const stringComponents = split(string, '.')
    const numberOfComponents = size(stringComponents)
    if (numberOfComponents === 2) {
      const wholePart = stringComponents[0]
      const fractionalPart = padEnd(stringComponents[1], decimals, '0')
      return `${wholePart}.${fractionalPart.substring(0, decimals)}`
    }
    if (numberOfComponents === 1) {
      return `${string}.00`
    }
  }
  return string
}

function titleCase(string) {
  const str = string.toLowerCase().split(' ')
  for (let i = 0; i < str.length; i += 1) {
    str[i] = sentenceCase(str[i])
  }
  return str.join(' ')
}

/** Creates a shorthand string for a date in time-from-now style by essentially
 * simplifying the output from date-fns distanceInWordsToNow
 * @function fromNowShortHand
 * @param {String} dateString - the date string to compare with now
 * @returns {String} time-from-now style string
 */
function fromNowShortHand(dateString) {
  if (dateString) {
    const now = new Date()
    const properDateString = Number.isNaN(Number(dateString[dateString.length - 1]))
      ? dateString
      : dateString.concat('Z') // if last digit is a number assume UTC, if back-end fixes their date strings, this should still work
    const notificationDate = new Date(properDateString)
    const days = differenceInDays(now, notificationDate)
    if (days >= 1) {
      return String(days).concat('d')
    }
    const hours = differenceInHours(now, notificationDate)
    if (hours >= 1) {
      return String(hours).concat('h')
    }
    const minutes = differenceInMinutes(now, notificationDate)
    if (minutes > 1) {
      return String(minutes).concat('m')
    }
    if (minutes <= 1) {
      return '1m'
    }
  }
  // Fall back should not have to show this to the user, but satisfies lint and may prevent errors
  return 'N/A'
}

export {
  sentenceCase,
  titleCase,
  fromNowShortHand,
}
