/**
 * @description 激活表格右键拖动
 * @author Jackie
 * @date 2020-04-07 01:19
 */
import dragTable from './drag-table'

const install = function (Vue) {
  Vue.directive('drag-table', dragTable)
}

if (window.Vue) {
  window['drag-table'] = dragTable
  Vue.use(install) // eslint-disable-line
}

dragTable.install = install
export default dragTable
