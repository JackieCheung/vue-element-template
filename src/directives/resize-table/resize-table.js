import { generateGuid, off, on } from '@/utils/tools'
import throttle from 'lodash/throttle'

/**
 * How to use:
 *
 * <el-table v-resize-table>...</el-table>
 * <el-table v-resize-table="{ minHeight: 100 }">...</el-table>
 *
 */
const context = '@@resize-table'

const resizeHandler = ({ target, scoped }) => {
  !target[scoped].mouseMoveHandler && (target[scoped].mouseMoveHandler = event => {
    const boundingClientRect = target.getBoundingClientRect()

    const x = event.clientX
    const y = event.clientY

    // range to activate resize table
    if ((boundingClientRect.top + boundingClientRect.height - 2 <= y && boundingClientRect.top + boundingClientRect.height + 2 >= y) && boundingClientRect.left + 5 <= x && boundingClientRect.left + boundingClientRect.width - 5 >= x) {
      // show 's-resize' cursor
      target.style.cursor = 's-resize'

      !target[scoped].mouseDownHandler && (target[scoped].mouseDownHandler = () => {
        !document[scoped].mouseMoveHandler && (document[scoped].mouseMoveHandler = throttle(e => {
          target.style.height = 'auto'

          const y = e.clientY

          const tableBody = target.querySelector('.el-table__body-wrapper')
          const fixedTableBody = target.querySelector('.el-table__fixed-body-wrapper')
          const clientRect = tableBody.getBoundingClientRect()

          tableBody.style.height = `${target[scoped].minHeight && y - clientRect.top <= target[scoped].minHeight ? target[scoped].minHeight : y - clientRect.top}px`
          fixedTableBody && (fixedTableBody.style.height = `${tableBody.style.height - 17}px`)
        }, 100))
        // bind 'mousemove' event to 'document'
        on(document, 'mousemove', document[scoped].mouseMoveHandler)

        !document[scoped].mouseUpHandler && (document[scoped].mouseUpHandler = () => {
          off(target, 'mousedown', target[scoped].mouseDownHandler)
          off(document, 'mousemove', document[scoped].mouseMoveHandler)
          off(document, 'mouseup', document[scoped].mouseUpHandler)
        })
        // bind 'mouseup' event to 'document'
        on(document, 'mouseup', document[scoped].mouseUpHandler)
      })

      // bind 'mousedown' event to 'element'
      on(target, 'mousedown', target[scoped].mouseDownHandler)
    } else {
      target.style.cursor = 'auto'
      off(target, 'mousedown', target[scoped].mouseDownHandler)
    }
  })
  on(target, 'mousemove', target[scoped].mouseMoveHandler)
}

export default {
  bind (el, binding) {
    el.target = ~el.className.split(' ').findIndex(cls => cls === 'el-table') ? el : el.querySelector('.el-table')
    !el.scoped && (el.scoped = context + generateGuid())
    el.target[el.scoped] = {
      minHeight: binding.value && parseFloat(binding.value.minHeight)
    }
    document[el.scoped] = {}
  },
  inserted (el) {
    resizeHandler(el)
  },
  unbind (el) {
    const { target, scoped } = el
    // unbind events
    off(target, 'mousemove', target[scoped].mouseMoveHandler)
    off(target, 'mousedown', target[scoped].mouseDownHandler)
    off(document, 'mousemove', document[scoped].mouseMoveHandler)
    off(document, 'mouseup', document[scoped].mouseUpHandler)
    target[scoped] = null
    delete target[scoped]
    document[scoped] = null
    delete document[scoped]
  }
}
