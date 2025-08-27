import { LOCAL_TOKEN, LOCAL_REFTOKEN, TOKEN_EXPIRE, TOKEN_REFEXPIRE } from 'configs/const'

// 判断当前时间是否超过token过期时间
export function isTokenExpire(expire) {
  return +new Date() >= Number(expire)
}

export function getToken() {
  // return Cookies.getItem(LOCAL_TOKEN)
  const token = window.localStorage.getItem(LOCAL_TOKEN)
  const expire = window.localStorage.getItem(TOKEN_EXPIRE)

  if (!token || !expire) {
    return false
  }
  if (isTokenExpire(expire)) {
    return false
  }
  return token
}

export function setToken(token /** expire=(+new Date() + 1e3 * 60 * 60)* */) {
  // return Cookies.setItem(LOCAL_TOKEN, token, new Date(expire).toGMTString(), '/', 'yowubuy.com', true)
  return window.localStorage.setItem(LOCAL_TOKEN, token)
}

export function removeToken() {
  window.localStorage.removeItem(LOCAL_TOKEN)
  window.localStorage.removeItem(LOCAL_REFTOKEN)
  window.localStorage.removeItem(TOKEN_EXPIRE)
  window.localStorage.removeItem(TOKEN_REFEXPIRE)
}

// 获取UTC时间
export function getUTCTime(now) {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const date = now.getUTCDate()
  const hours = now.getUTCHours()
  const minutes = now.getMinutes()
  const seconds = now.getUTCSeconds()
  const ms = now.getUTCMilliseconds()

  return Date.UTC(year, month, date, hours, minutes, seconds, ms)
}
