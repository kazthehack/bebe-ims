import {
  combineValidators,
  required,
  naturalNumberValidator,
  zipCodeValidator,
  phoneNumberValidator,
  maxDecimalPlaces,
  numberValidator,
} from './validators'

describe('required', () => {
  it('should pass when truthy', () => {
    expect(required('abc')).toBeUndefined()
    expect(required(1)).toBeUndefined()
  })

  it('should fail when falsy', () => {
    expect(required('')).toBe('Required')
    expect(required(NaN)).toBe('Required')
  })
})

const alwaysPass = () => undefined

const alwaysFail = () => 'Failed'

describe('combineValidators', () => {
  it('should fail if either fail', () => {
    const checkLeft = combineValidators(required, alwaysPass)
    expect(checkLeft('')).toBe('Required')

    const checkRight = combineValidators(alwaysPass, required)
    expect(checkRight('')).toBe('Required')

    const check = combineValidators(alwaysFail, alwaysFail)
    expect(check('')).toBe('Failed')
  })

  it('should pass if both pass', () => {
    const check = combineValidators(alwaysPass, alwaysPass)
    expect(check('')).toBeUndefined()
  })

  it('should display the message of the first validator to fail', () => {
    const checkFailed = combineValidators(alwaysFail, required)
    expect(checkFailed('')).toBe('Failed')

    const checkRequired = combineValidators(required, alwaysFail)
    expect(checkRequired('')).toBe('Required')
  })
})

describe('naturalNumber', () => {
  it('should fail when not a natural', () => {
    expect(naturalNumberValidator('12abc')).toBe('Must be a natural number')
    expect(naturalNumberValidator('-4')).toBe('Must be a natural number')
    expect(naturalNumberValidator(-6)).toBe('Must be a natural number')
    expect(naturalNumberValidator('0.1')).toBe('Must be a natural number')
    expect(naturalNumberValidator(0.05)).toBe('Must be a natural number')
    expect(naturalNumberValidator('1.0.0')).toBe('Must be a natural number')
  })

  it('should pass when valid natural number', () => {
    expect(naturalNumberValidator('0')).toBeUndefined()
    expect(naturalNumberValidator('1')).toBeUndefined()
    expect(naturalNumberValidator('2.0')).toBeUndefined()
    expect(naturalNumberValidator('10')).toBeUndefined()
    expect(naturalNumberValidator(0)).toBeUndefined()
    expect(naturalNumberValidator(-0)).toBeUndefined()
    expect(naturalNumberValidator(1)).toBeUndefined()
    expect(naturalNumberValidator(2.0)).toBeUndefined()
  })
})

describe('zipCode', () => {
  it('should fail when not a zip code', () => {
    // expect(zipCodeValidator('')).toBe('Invalid zip code')
    expect(zipCodeValidator('hello')).toBe('Invalid zip code')
    expect(zipCodeValidator('1234')).toBe('Invalid zip code')
    expect(zipCodeValidator('12345-1')).toBe('Invalid zip code')
  })

  it('should pass when valid zip code', () => {
    expect(zipCodeValidator('12345')).toBeUndefined()
    expect(zipCodeValidator('12345 1234')).toBeUndefined()
    expect(zipCodeValidator('12345-1234')).toBeUndefined()
  })
})

describe('phoneNUmber', () => {
  it('should fail when not a phone number', () => {
    // expect(phoneNumberValidator('')).toBe('Invalid phone number')
    expect(phoneNumberValidator('123')).toBe('Invalid phone number')
    expect(phoneNumberValidator('123-abc-1234')).toBe('Invalid phone number')
  })

  it('should pass when valid phone number', () => {
    expect(phoneNumberValidator('123-456-7890')).toBeUndefined()
    expect(phoneNumberValidator('1234567890')).toBeUndefined()
  })
})

describe('maxDecimalPlaces', () => {
  const twoDecimalValidator = maxDecimalPlaces()
  const oneDecimalValidator = maxDecimalPlaces(1)

  it('should fail when there is more than the specified decimal places', () => {
    expect(twoDecimalValidator('110.111')).toBe('Only use 2 decimal places')
    expect(twoDecimalValidator('.111')).toBe('Only use 2 decimal places')
    expect(oneDecimalValidator(1.11)).toBe('Only use 1 decimal places')
    expect(oneDecimalValidator('a.aa')).toBe('Only use 1 decimal places')
    expect(twoDecimalValidator('1.000')).toBe('Only use 2 decimal places')
  })

  it('should pass when there is the specified number of decimal places or less', () => {
    expect(twoDecimalValidator('a')).toBeUndefined()
    expect(twoDecimalValidator('a.aa')).toBeUndefined()
    expect(twoDecimalValidator(10000000000000000.00)).toBeUndefined()
    expect(twoDecimalValidator(1.000)).toBeUndefined()
    expect(oneDecimalValidator(1)).toBeUndefined()
    expect(oneDecimalValidator('1.1')).toBeUndefined()
    expect(oneDecimalValidator(undefined)).toBeUndefined()
    expect(oneDecimalValidator('')).toBeUndefined()
  })
})

describe('numberValidator', () => {
  it('should pass when given various number values', () => {
    expect(numberValidator('123.123')).toBeUndefined()
    expect(numberValidator('0')).toBeUndefined()
    expect(numberValidator('1')).toBeUndefined()
    expect(numberValidator('-1')).toBeUndefined()
  })

  it('should fail when given non-numbers', () => {
    expect(numberValidator('abc')).toBe('Please enter a number')
    expect(numberValidator('1.f')).toBe('Please enter a number')
    expect(numberValidator('f.1')).toBe('Please enter a number')
    expect(numberValidator('1f')).toBe('Please enter a number')
    expect(numberValidator('f1')).toBe('Please enter a number')
    expect(numberValidator('1.2.3')).toBe('Please enter a number')
  })
})
