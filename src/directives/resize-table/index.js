/**
 * @description resize table
 * @author Jackie
 * @date 2020-09-03 08:10
 */
import resizeTable from './resize-table'

const install = function (Vue) {
  Vue.directive('resize-table', resizeTable)
}

if (window.Vue) {
  window['resize-table'] = resizeTable
  Vue.use(install) // eslint-disable-line
}

resizeTable.install = install
export default resizeTable
