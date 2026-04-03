import { indexOf, castArray, every, assign } from 'lodash'
import { atLeastOneSelected } from 'components/common/input/NestingCheckboxList'
import moment from 'moment-timezone'
import { validate as uuidValidate } from 'uuid'

/** Validate a number from a text field
 * @function numberValidator
 * @param {any} v - The value to check is a Number
 */
export const numberValidator = (v) => {
  // Don't validate undefined or empty string values
  if ((typeof (v) === 'undefined') || (v === '')) return undefined
  const value = Number(v)
  if (!Number.isNaN(value)) return undefined
  return 'Please enter a number'
}

// TODO: Consider wrapping a library which already supplies these
// validations instead of self-implementing.

const removeWhiteSpace = value => value.replace(/ /g, '')

// const removeNonNumber = value => value.replace(/\D/g, '')

/** Validate the presence of a field.
 * @function required
 * @param {any} value - The field value to check.
 */
export const required = value => (value ? undefined : 'Required')

/** Combine multiple field validators into a new validator which fails if any
 *  of the individual validators fail.
 * @function combineValidators
 * @param {...function} validators
 */
export const combineValidators = (...validators) =>
  value => validators.reduce((error, check) => error || check(value), undefined)

/** Perform a validation by testing the input against a regular expression.
* @function regex
* @param {RegExp} re The regular expression to test against.
* @param {string} errorMessage The error message to return when validation fails.
*/
export const regex = (re, errorMessage = 'Invalid') =>
  value => (re.test(value || '') ? undefined : errorMessage)

/** Perform a validation by testing the input against a regular expression.
* looks for error invalid string
* @function iregex
* @param {RegExp} re The regular expression to test against.
* @param {string} errorMessage The error message to return when validation fails.
*/
export const iregex = (re, errorMessage = 'Invalid') =>
  value => (re.test(value || '') ? errorMessage : undefined)

/** Validate a natural number (non-negative integer) (0, 1, 2, ...).
 * @function naturalNumberValidator
 * @param {any} value - The value to check as a natural number.
*/
export const naturalNumberValidator = (value) => {
  if (typeof value === 'undefined' || value === '') return undefined
  const num = Number(value)
  if (num !== 0 && !num) return 'Must be a natural number'
  if (!(num >= 0)) return 'Must be a natural number'
  if (parseInt(num, 10) === parseFloat(num)) return undefined
  return 'Must be a natural number'
}

/** Validate an integer number
 * @function integerValidator
 * @param {any} v - The value to check as an integer number.
 */
export const integerValidator = (v) => {
  // Don't validate undefined or empty string values
  if ((typeof (v) === 'undefined') || (v === '')) return undefined
  const valToNum = Number(v)
  if (String(valToNum).length !== String(v).length) return 'Must be an integer' // errors on "1."
  return (Number.isInteger(valToNum) || v === undefined) ? undefined : 'Must be an integer'
}

// TODO: this shouldn't necessarily require the float to be positive
/** Validate a number to be a positive float, but allow the value to be 0 or undefined.
 * @function nonRequiredFloat
 * @param {any} v - The value to check.
*/
export const nonRequiredFloat = (v) => {
  // Don't validate undefined or empty string values
  if ((typeof (v) === 'undefined') || (v === '')) return undefined
  const value = Number(v)
  if (value === 0) return undefined
  return parseFloat(value, 10) > 0 ? undefined : 'Please enter a float value'
}

/** Validate the number of decimal places after the first '.'
 * @function maxDecimalPlaces
 * @param {any} v - The value to check.
 * @param {number} decimals - the number of decimal places to allow.
*/
export const maxDecimalPlaces = (decimals = 2) => (v) => {
  // Don't validate undefined or empty string values
  if (!v) return undefined
  if ((typeof (v) === 'undefined') || (v === '')) return undefined
  const stringValue = v.toString()
  const decIndex = stringValue.indexOf('.')
  if (decIndex === -1) return undefined
  if (stringValue.substring(decIndex + 1, stringValue.length).length > decimals) {
    return `Only use ${decimals} decimal places`
  }
  return undefined
}

/**
 * @function withinRangeValidator - Curries a validator which will validate a number between a min
 * and a max value
 * @param {number} min - minimum acceptable value
 * @param {number} max - maximum acceptable value
 * @param {boolean} inclusive - determines if values matching the min or max are acceptable
 */
export const withinRangeValidator = (min, max, inclusive = true) => (v) => {
  const num = parseFloat(v, 10)
  if (
    num < min || (!inclusive && num === min) ||
    num > max || (!inclusive && num === max)
  ) return `Must be a number ${inclusive ? 'from' : 'between'} ${min} ${inclusive ? 'to' : 'and'} ${max}`
  return undefined
}

/** Validate a zip code.
 * @function zipCodeValidator
 * @param {any} value - The value to check as a zip code.
 */
export const zipCodeValidator = regex(/^(\d{5}([ -]\d{4})?)?$/, 'Invalid zip code')

/** Validate a phone number.
 * @function phoneNumberValidator
 * @param {any} v - The value to check as a phone number.
 */
export const phoneNumberValidator = v => (
  /^(((\(\d{3}\))|(\d{3}))-?\d{3}-?\d{4})?$/.test(removeWhiteSpace(v || '')) ? undefined : 'Invalid phone number'
)

/** Validate a UUID.
 * @function uuidValidator
 * @param {any} v - The value to check as a uuid.
 */
export const uuidValidator = v => (
  uuidValidate(v) ? undefined : 'Invalid uuid format'
)

export const emailValidator = regex(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  'Invalid email address',
)

/** Curries a validator which will validate a number has a given number of digits
 * @function numberOfLengthValidator
 * @param {number} digits - The number of digits the number should have
 */
export const numberOfLengthValidator = digits => regex(new RegExp(`^[0-9]{${digits}}$`), `Must be a number ${digits} digits long`)

/** Curries a validator which will validate a string has at least the given length
 * @function stringOfMinimumLengthValidator
 * @param {number} length - The minimum length the string should have
 */
export const stringOfMinimumLengthValidator = length => v =>
  (v.length >= length ?
    undefined :
    `Must be at least ${length} characters long`
  )

// This validates a number with just a decimal at the end like "12." as invalid
/** Validate a float.
 * @function floatValidator
 * @param {any} value - The value to check as a float.
 */
export const floatValidator = regex(/^-?\d*(\.\d+)?$/, 'Invalid number')

/** Validates for no trailing whitespace characters: i.e. [\r\n\t\f\v ]
 * a good place to add other cleaning operations we would want to apply to user text input
 * @function sanitizedStringValidator
 * @param {any} value - The field value to check.
 */
export const sanitizedStringValidator = iregex(/\s+$/, 'No trailing whitespace allowed')


export const getUniqueValidator = values => value => (indexOf(values, value) >= 0 ? 'unique' : undefined)

/** Curries a validator which will validate a string does not exceed the maximum given length
 * @function stringOfMaximumLength
 * @param {number} length - The maximum length the string should have
 */
export const stringOfMaximumLength = length => (value) => {
  if (value) {
    return value.length <= length ? undefined : `The length cannot be longer than ${length} characters`
  }
  return undefined
}

/** Check that a number is non-zero.
 * @function nonZero
 * @param {number} v - The field value to check.
 */
export const nonZero = (v) => {
  if (typeof v === 'string') {
    if (v === '') return 'Must be non-zero'
    return Number.parseInt(v, 10) === 0 ? 'Must be non-zero'
      : undefined
  }
  return v === 0 ? 'Must be non-zero'
    : undefined
}

export const inRange = (min, max) => (v) => {
  if (v > max) return `Must be less than ${max}`
  else if (v < min) return `Must be greater than ${min}`
  return undefined
}

/** Check that a number is non-zero.
 * @function valueGreaterThanMin
 * @param {number} minValue - minimum value allowed.
 * @param {string} errorMessage - error message to display in case of error.
 */
export const valueGreaterThanMin = (minValue, errorMessage = 'Must be greater than min value ') => (v) => {
  if (v <= minValue) return `${errorMessage}${minValue}`
  return undefined
}

/**
 * Checks that the value being validated does not match any of the given values
 * @function checkUnique
 * @param {any} value - The value which should not be matched. If this is an array, every element of
 * the array will be checked against, rather than the array as a whole
 * @param {string} errorMessage - The error message to return when validation fails
 */
export const checkUnique = (value, errorMessage) => v =>
  (castArray(value).includes(v) ? errorMessage : undefined)

export const checklistValidator = values =>
  (atLeastOneSelected(values) ? {} : { checkboxes: 'At least one is required' })

/** Validate value contains at least 1 lowercase letter
 * @function atLeastOneUppercaseLetter
 * @param {any} value - The value to check
 */
export const atLeastOneUppercaseLetter = regex(/^(.*[A-Z].*)$/, 'Must contain at least 1 uppercase letter')

/** Validate value contains at least 1 lowercase letter
 * @function atLeastOneLowercaseLetter
 * @param {any} value - The value to check
 */
export const atLeastOneLowercaseLetter = regex(/^(.*[a-z].*)$/, 'Must contain at least 1 lowercase letter')

/** Validate value contains at least 1 number
 * @function atLeastOneNumber
 * @param {any} value - The value to check
 */
export const atLeastOneNumber = regex(/^(.*[0-9].*)$/, 'Must contain at least 1 number')

/** Validate value contains at least 1 special character
 * @function atLeastOneSpecialCharacter
 * @param {any} value - The value to check
 */
export const atLeastOneSpecialCharacter = regex(/^(.*[!,@,#,$,%,^,&,*].*)$/, 'Must contain at least 1 special character')

/** Validate value based on current password standard
 * combining validators in this way will allow for specific feedback which makes the password
 * setting process easier
 * @function passwordValidator
 * @param {any} value - The value to check
 */
export const passwordValidator = combineValidators(
  stringOfMinimumLengthValidator(8),
  atLeastOneLowercaseLetter,
  atLeastOneUppercaseLetter,
  atLeastOneSpecialCharacter,
)

/** Validate value based on current password standard
 * This validates only on the minimal requirements that the back-end requires
 * @function softPasswordValidator
 * @param {any} value - The value to check
 */
export const softPasswordValidator = combineValidators(
  stringOfMinimumLengthValidator(8),
)

/** Validate a field value against an entered value in another field
 * @function stringMatchValidator
 * @param {any} value - The value to check
 * @param {any} allValues - All the form values
 * @param {any} tergetFieldName - The name of the target field to validate the value against
 * @param {string} errorMessage - The error message to return when validation fails
 */
export const stringMatchValidator = (targetFieldName, errorMessage) => (value, allValues) => {
  if (value === allValues[targetFieldName]) return undefined
  return errorMessage
}

// TODO: unit test
/** Validate value against target value to be greater or less than, with inclusive option.
 * @function compareValue
 * @param {any} value - The value to check
 * @param {number} target - target value to check value against
 * @param {boolean} greater - boolean to determine greater or less than
 * @param {boolean} inclusive - boolean to be greater or less than
 */
export const compareValue = (target, greater, inclusive) => (value) => {
  // Don't validate undefined or empty string values
  if ((typeof (value) === 'undefined') || (value === '')) return undefined
  const cast = Number(value)
  if (greater) {
    if (cast > target || (inclusive && (cast === target))) return undefined
    return inclusive ? `value must be greater than or equal to ${target}`
      : `value must be greater than ${target}`
  }
  if (cast < target || (inclusive && (cast === target))) return undefined
  return inclusive ? `value must be less than or equal to ${target}`
    : `value must be less than ${target}`
}

/** Validate that at least one of collection passes condition
 * @function atLeastOneWithoutError
 * @param {Array} collection - array of something to check condition
 * @param {function} condition - The condition to check elements of collection with
 * @param {string} message - message to display if no elements of collection pass condition
 */
export const atLeastOneWithoutError = (collection, condition, message) => {
  if (!every(collection, condition)) return undefined
  return message
}

/** Convenience function using compareValue. Preferable to the other because there is less to test
 * @function positiveNumber
 */
export const positiveNumber = compareValue(0, true, false)

/** Convenience function using compareValue
 * @function greaterThanOrEqualTo0
 */
export const greaterThanOrEqualTo0 = compareValue(0, true, true)

// TODO: unit test
/** Run multiple form-level validators, merging and returning the resulting error objects.
 * @function combineFormValidators
 * @param {Array} validators - array of something to check condition
 * @param {Object} values - The condition to check elements of collection with
 */
export const combineFormValidators = (...validators) => (values) => {
  const errors = {}
  validators.forEach(validator => assign(errors, validator(values)))
  return errors
}

/** Validate value against target value to be not equal
 * @function cannotBe
 * @param {any} value - The value to check
 * @param {number} cannotBeValue - target value to check value against
 */
export const cannotBe = (cannotBeValue, errorMessage) => (value) => {
  // Don't validate undefined or empty string values
  if ((typeof (value) === 'undefined') || (value === '')) return undefined
  if (cannotBeValue === value) return errorMessage
  return undefined
}

/** Validate a positive number
 * @function positiveNumberValidator
*/
export const positiveNumberValidator = combineValidators(numberValidator, positiveNumber)

/** Validate a future date
 * @function futureDateValidator
 * @param timezone - The store's timezone
 * @param date - The entered date
*/
export const futureDateValidator = timezone => (value) => {
  const enteredDate = moment.tz(value, timezone).unix()
  const currentDate = moment.tz(timezone).unix()

  if (enteredDate > currentDate) {
    return 'Date cannot be in the future.'
  }
  return undefined
}

/** Validate a past date which is anytime beyond year 2000
 * @function notBeforeYear2000
 * @param timezone - The store's timezone
 * @param date - The entered date
*/
export const notBeforeYear2000 = timezone => (value) => {
  const enteredYear = moment.tz(value, timezone).unix()
  const pastYear = moment.tz('2000', timezone).unix()

  if (enteredYear < pastYear) {
    return 'Date cannot be before 2000.'
  }
  return undefined
}

/** Validate if year has more than 4 digits
 * @function yearHasFourDigits
 */
export const yearHasFourDigits = (value) => {
  if (value) {
    const date = new Date(value)
    const yearString = date.getFullYear().toString()
    return yearString.length <= 4 ? undefined : 'Invalid year'
  }
  return undefined
}
