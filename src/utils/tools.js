/**
 * @description get page title
 * @param { String } pageTitle
 * @return { String } page title
 */
export function getPageTitle (pageTitle) {
  const title = process.env.VUE_APP_TITLE || 'Vue Element Template'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

/**
 * @description parse the time to string
 * @param { Object | String | Number } time
 * @param { String } cFormat
 * @return { String | null }
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
}

/**
 * @description format time
 * @param { Number } time
 * @param { String } option
 * @return { String }
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt('' + time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @description get query object of the url
 * @param { String } url
 * @return { Object }
 */
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @description get the byte length of an utf8 string
 * @param { String } str
 * @return { number }
 */
export function byteLength (str) {
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @description parse json object to query string
 * @param { Object } json
 * @return { String }
 */
export function param (json) {
  if (!json) return ''
  return Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
  }).filter(item => item !== '').join('&')
}

/**
 * @description parse query string of the url to json object
 * @param { String } url
 * @return { Object }
 */
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @description parse html to text
 * @param { String } val
 * @return { String }
 */
export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * @description merges two objects, giving the last one precedence
 * @param { Object } target
 * @param { Object | Array} source
 * @return { Object }
 */
export function objectMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @description toggle class of the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param { Function } func
 * @param { Number } wait
 * @param { Boolean } immediate
 * @return { * }
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @description This is just a simple version of deep copy. Has a lot of edge cases bug. If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param { Object } source
 * @return { Object }
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments - deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @description filter duplicate elements of an array
 * @param { Array } arr
 * @return { Array }
 */
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * @description generate uuid
 * @return { String }
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt('' + ((1 + Math.random()) * 65536)) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @description check if the html element has the class
 * @param { HTMLElement } element
 * @param { String } className
 * @return { Boolean }
 */
export function hasClass (element, className) {
  return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

/**
 * @description add the class to the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function addClass (element, className) {
  if (!hasClass(element, className)) element.className += ' ' + className
}

/**
 * @description remove the class from the html element
 * @param { HTMLElement } element
 * @param { String } className
 */
export function removeClass (element, className) {
  if (hasClass(element, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    element.className = element.className.replace(reg, ' ')
    // // OR
    // const classNames = element.className.split(' ')
    // element.className = classNames.splice(classNames.indexOf(className), 1).join(' ')
  }
}

/**
 * @description get current navigator name
 * @return { String } current navigator name
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) {
    return 'IE'
  } else if (isExplorer('Firefox')) {
    return 'Firefox'
  } else if (isExplorer('Chrome')) {
    return 'Chrome'
  } else if (isExplorer('Opera')) {
    return 'Opera'
  } else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description bind event to html element
 * @param { HTMLElement } element
 * @param { String } event
 * @param { EventListener } handler
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description unbind event to html element
 * @param { HTMLElement } element
 * @param { String } event
 * @param { EventListener } handler
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description transform DataURL to Blob Object
 * @param { String } dataUrl
 * @return { Blob } Blob Object
 */
export const dataURLToBlob = dataUrl => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * @description transform Image Object to Base64 String
 * @param { HTMLImageElement } image, Image Object
 * @return { String } Base64 String
 */
export const getBase64FromImage = image => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
  return canvas.toDataURL('image/' + ext)
}

/**
 * @description write async await without try-catch blocks
 * @param { Function } asyncFunc, asynchronous function
 * @return { Array } callback result of asynchronous function
 */
export const asyncAction = asyncFunc => {
  return asyncFunc.then(res => {
    return [null, res]
  }).catch(err => {
    return [err, null]
  })
}
