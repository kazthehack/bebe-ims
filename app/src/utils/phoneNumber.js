import { trimStart } from 'lodash'

const formatPhoneNumber = (phoneNumberString = '') => {
  const cleaned = (trimStart(phoneNumberString, '+1')).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '('.concat(match[1]).concat(') ').concat(match[2]).concat('-')
      .concat(match[3])
  }
  return phoneNumberString
}

export default formatPhoneNumber
