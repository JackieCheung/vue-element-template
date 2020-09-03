import { on, off } from '@/utils/tools'
import throttle from 'lodash/throttle'

/**
 * How to use:
 *
 * <el-table v-resize-table>...</el-table>
 * <el-table v-resize-table="{ minHeight: 100 }">...</el-table>
 *
 */
let target = null
const context = '@@resize-table'

const resizeHandler = (element) => {
  !target[context].mouseMoveHandler && (target[context].mouseMoveHandler = (event) => {
    const boundingClientRect = element.getBoundingClientRect()

    const x = event.clientX
    const y = event.clientY

    // range to activate resize table
    if ((boundingClientRect.top + boundingClientRect.height - 2 <= y && boundingClientRect.top + boundingClientRect.height + 2 >= y) && boundingClientRect.left + 5 <= x && boundingClientRect.left + boundingClientRect.width - 5 >= x) {
      // show 's-resize' cursor
      element.style.cursor = 's-resize'

      !target[context].mouseDownHandler && (target[context].mouseDownHandler = () => {
        !document[context].mouseMoveHandler && (document[context].mouseMoveHandler = throttle(e => {
          target.style.height = 'auto'

          const y = e.clientY

          const tableBody = element.querySelector('.el-table__body-wrapper')
          const fixedTableBody = element.querySelector('.el-table__fixed-body-wrapper')

          const clientRect = tableBody.getBoundingClientRect()

          tableBody.style.height = `${target[context].minHeight && y - clientRect.top <= target[context].minHeight ? target[context].minHeight : y - clientRect.top}px`
          fixedTableBody && (fixedTableBody.style.height = `${tableBody.style.height - 12}px`)
        }, 100))
        // bind 'mousemove' event to 'document'
        on(document, 'mousemove', document[context].mouseMoveHandler)

        !document[context].mouseUpHandler && (document[context].mouseUpHandler = () => {
          off(element, 'mousedown', target[context].mouseDownHandler)
          off(document, 'mousemove', document[context].mouseMoveHandler)
          off(document, 'mouseup', document[context].mouseUpHandler)
        })
        // bind 'mouseup' event to 'document'
        on(document, 'mouseup', document[context].mouseUpHandler)
      })

      // bind 'mousedown' event to 'element'
      on(element, 'mousedown', target[context].mouseDownHandler)
    } else {
      element.style.cursor = 'auto'
      off(element, 'mousedown', target[context].mouseDownHandler)
    }
  })
  on(element, 'mousemove', target[context].mouseMoveHandler)
}

export default {
  bind (el, binding) {
    target = ~el.className.split(' ').findIndex(cls => cls === 'el-table') ? el : el.querySelector('.el-table')
    target && (target[context] = {
      minHeight: binding.value && parseFloat(binding.value.minHeight)
    })
    document[context] = {}
  },
  inserted () {
    target && resizeHandler(target)
  },
  unbind () {
    // unbind events
    off(target, 'mousemove', target[context].mouseMoveHandler)
    off(target, 'mousedown', target[context].mouseDownHandler)
    off(document, 'mousemove', document[context].mouseMoveHandler)
    off(document, 'mouseup', document[context].mouseUpHandler)
    target[context] = null
    delete target[context]
    document[context] = null
    delete document[context]
  }
}
