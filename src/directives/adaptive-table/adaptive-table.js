import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

/**
 * How to use:
 *
 * <el-table height="100" v-adaptive-table="{ bottomOffset: 30 }">...</el-table>
 * <el-table height="100" v-adaptive-table="{ bottomOffset: 30, minHeight: 200 }">...</el-table>
 * <el-table height="100" v-adaptive-table.resizable="{ bottomOffset: 30 }">...</el-table>
 *
 * height: must be set
 * bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */

const doResize = async (el, binding, vnode) => {
  const $table = await (vnode.componentInstance.$refs.eTable ? vnode.componentInstance.$refs.eTable.$refs.elTable : vnode.componentInstance)

  if (!$table) throw new Error('The componentInstance of <el-table> does not exist.')
  if (!$table.height) throw new Error('The height property of <el-table> must be set. Such as height="100" or height="100px".')

  const { value } = binding
  const bottomOffset = parseFloat(value && value.bottomOffset) || 30
  const minHeight = parseFloat(value && value.minHeight)
  const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset

  $table.layout.setHeight(minHeight && height <= minHeight ? minHeight : height)
  $table.doLayout()
}

export default {
  bind (el, binding, vnode) {
    if (binding.modifiers.resizable) return
    el.resizeListener = async () => {
      await doResize(el, binding, vnode)
    }
    // parameter 1 is must be "Element" type
    addResizeListener(el, el.resizeListener)
    addResizeListener(window.document.body, el.resizeListener)
  },
  async inserted (el, binding, vnode) {
    await doResize(el, binding, vnode)
  },
  unbind (el) {
    removeResizeListener(el, el.resizeListener)
    removeResizeListener(window.document.body, el.resizeListener)
  }
}
