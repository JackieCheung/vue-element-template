/**
 * @description 表格高度自适应
 * @author Jackie
 * @date 2020-04-26 17:27
 */
import adaptiveTable from './adaptive-table'

const install = function (Vue) {
  Vue.directive('adaptive-table', adaptiveTable)
}

if (window.Vue) {
  window['adaptive-table'] = adaptiveTable
  Vue.use(install) // eslint-disable-line
}

adaptiveTable.install = install
export default adaptiveTable
