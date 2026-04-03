import { useEffect, useState } from 'react'

export const setCookie = ({ name, value, duration }) => {
  const cookie = `${name}=${escape(value)}${(duration) ? `; duration=${duration.toGMTString()}` : ''}`
  document.cookie = cookie
}

export const getCookie = (cname) => {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const deleteCookie = (name) => {
  if (getCookie(name)) {
    document.cookie = `${name}=; expires=Thu, 01-Jan-70 00:00:01 GMT`
  }
}

export const clearAuthCookies = () => {
  deleteCookie('logged')
  deleteCookie('accessToken')
  deleteCookie('refreshToken')
  deleteCookie('expires')
}

export const getAuthCookies = () => ({
  email: getCookie('logged'),
  accessToken: getCookie('accessToken'),
  refreshToken: getCookie('refreshToken'),
  expires: getCookie('expires'),
})

const cookies = () => Object.fromEntries(document.cookie.split(';').map(it => it.split('=')))

// eslint-disable-next-line no-prototype-builtins
const cookieExist = cookie => cookies().hasOwnProperty(cookie)

export const useCookieWatcher = (cookie, pollingRate = 250) => {
  // state for cookie existence
  const [exist, setExist] = useState(cookieExist(cookie))
  useEffect(() => {
    const interval = setInterval(() => setExist(cookieExist(cookie)), pollingRate)
    return () => clearInterval(interval)
  })

  return exist
}

export const useCookie = cookie => cookies()[cookie]
