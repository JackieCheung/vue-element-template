import { getFinalStyle } from './tools'

/* collection of validations */

/**
 * @description validate whether is an valid url or not
 * @param { String } url
 * @return { Boolean }
 */
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @description validate whether the letters of the string are all lower-case or not
 * @param { String } str
 * @return { Boolean }
 */
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @description validate whether the letters of the string are all upper-case or not
 * @param { String } str
 * @return { Boolean }
 */
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @description validate whether the letters of the string are all alphabet or not
 * @param { String } str
 * @return { Boolean }
 */
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @description validate whether is an valid email address or not
 * @param { String } email
 * @return { Boolean }
 */
export function validEmail (email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @description validate whether is an valid phone number or not
 * @param {String} phone
 * @return { Boolean }
 */
export function validPhone (phone) {
  const reg = /^[1][3-9][0-9]{9}$/
  return reg.test(phone)
}

/**
 * @description determine whether is a string or not
 * @param { String } str
 * @return { Boolean }
 */
export function isString (str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @description determine whether is an external path or not
 * @param { String } path
 * @return { Boolean }
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description determine whether is an array or not
 * @param { Array } arg
 * @return { Boolean }
 */
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description determine whether the current device type is Android
 * @return { Boolean }
 */
export function isAndroidDevice () {
  return window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1
}

/**
 * @description determine whether the current device type is IOS
 * @return { Boolean }
 */
export function isIOSDevice () {
  return !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

/**
 * @description determine whether the scroll bar inside the element is scrolled to the bottom of the element, true if scrollTop + clientHeight === scrollHeight
 * @param { HTMLElement } element
 * @return { Boolean }
 * @author Jackie
 * @date 2020-03-20 08:25
 */
export function isScrolledToBottom (element) {
  const scrollTop = element && element.scrollTop || 0
  const clientHeight = element && element.clientHeight || 0
  const scrollHeight = element && element.scrollHeight || 0
  return getFinalStyle(element, 'overflow-y') === 'hidden' || scrollHeight <= clientHeight || Math.ceil(scrollTop) + clientHeight >= scrollHeight
}

/**
 * @description determine whether the val is empty
 * @param { * } val
 * @return { Boolean }
 * @author Jackie
 * @date 2020-04-01 20:30
 */
export const isEmpty = (val) => {
  // null or undefined
  if (val == null) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
  }

  return false
}

/**
 * @description validate whether is an valid image or not
 * @param { String } url
 * @returns { Promise }
 * @author Jackie
 * @date 2020-04-03 08:23
 */
export const validImage = (url) => {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => resolve(image.width > 0 && image.height > 0)
    image.onerror = () => resolve(false)
    image.crossOrigin = 'anonymous'
    image.src = url
  })
}
