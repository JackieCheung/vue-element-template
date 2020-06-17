/**
 * @description set the default values of multiple el-selector immutable
 * @author Jackie
 * @date 2020-05-25 00:45
 */
import immutableSelector from './immutable-selector'

const install = function (Vue) {
  Vue.directive('immutable-selector', immutableSelector)
}

if (window.Vue) {
  window['immutable-selector'] = immutableSelector
  Vue.use(install) // eslint-disable-line
}

immutableSelector.install = install
export default immutableSelector
