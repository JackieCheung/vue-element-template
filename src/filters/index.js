// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils/tools'

/**
 * @description show plural label if time is plural number
 * @param { Number } time
 * @param { String } label
 * @return { String }
 */
function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @description compute how long the specified time was before current time
 * @param { Number } time
 * @return { String }
 */
export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * @description format number, like 10000 => 10k
 * @param { Number } num
 * @param { Number } digits
 * @return { String }
 */
export function numberFormatter (num, digits) {
  const si = [{
    value: 1E18,
    symbol: 'E'
  }, {
    value: 1E15,
    symbol: 'P'
  }, {
    value: 1E12,
    symbol: 'T'
  }, {
    value: 1E9,
    symbol: 'G'
  }, {
    value: 1E6,
    symbol: 'M'
  }, {
    value: 1E3,
    symbol: 'k'
  }]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * @description format number, like 10000 => "10,000"
 * @param { Number } num
 * @return { String }
 */
export function toThousandFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * @description uppercase first character
 * @param { String } string
 * @return { String }
 */
export function uppercaseFirstChar (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
