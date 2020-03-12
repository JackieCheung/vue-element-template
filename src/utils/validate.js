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
