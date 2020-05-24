/**
 * @description copy to clipboard
 * @author Jackie
 * @date 2020-05-25 00:45
 */
import clipboard from './clipboard'

const install = function (Vue) {
  Vue.directive('clipboard', clipboard)
}

if (window.Vue) {
  window.clipboard = clipboard
  Vue.use(install) // eslint-disable-line
}

clipboard.install = install
export default clipboard
