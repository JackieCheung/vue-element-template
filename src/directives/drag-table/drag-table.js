import { on, off } from '@/utils/tools'

const context = '@@drag-table'

const activateDraggableTable = (el, binding) => {
  const element = el.querySelector('.el-table__body-wrapper')
  let move = false
  !document[context].mouseDownHandler && (document[context].mouseDownHandler = event => {
    const ev = document.all ? window.event : event
    // ev.which 鼠标右键的值为 3，ev.button 鼠标右键的值为 2
    const evCode = ev.which || ev.button + 1
    // 鼠标右键
    if (evCode === 3) {
      // 记录鼠标点击的 x 坐标和 y 坐标
      let startX = ev.pageX
      let startY = ev.pageY
      move = false
      // element 绑定 mousemove 事件
      on(element, 'mousemove', el[context].mouseMoveHandler = (_ => {
        return event => {
          const ev = document.all ? window.event : event
          ev.preventDefault()
          // 计算鼠标移动的 x 轴、 y 轴偏移量，赋值列表的横向、竖向滚动条
          element.scrollLeft += startX - ev.pageX
          element.scrollTop += startY - ev.pageY
          /* 偏移量绝对值大于 4 即视为有滑动（防止 click 事件造成轻微滑动） */
          if (Math.abs(startX - ev.pageX) >= 4 || Math.abs(startY - ev.pageY) >= 4) {
            element.style.cursor = 'move'
            move = true
            // to do what you want
          }
          // 记录最新的起始坐标
          startX = ev.pageX
          startY = ev.pageY
        }
      })(move))
    }
  })
  // document 绑定 mousedown 事件
  on(document, 'mousedown', document[context].mouseDownHandler)
  // 松开鼠标（document 绑定 mouseup 事件），取消 element 已绑定的 mousemove 事件
  !document[context].mouseUpHandler && (document[context].mouseUpHandler = event => {
    const ev = document.all ? window.event : event
    const evCode = ev.which || ev.button + 1
    if (evCode === 3) {
      off(element, 'mousemove', el[context].mouseMoveHandler)
      element.style.cursor = 'default'
      // 滑动状态下，鼠标右键 mouseup 取消弹出菜单
      on(document, 'contextmenu', document[context].contextMenuHandler = (_ => {
        return event => {
          if (move) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false
          }
        }
      })(move))
    }
  })
  on(document, 'mouseup', document[context].mouseUpHandler)
}

export default {
  bind (el) {
    el[context] = {}
    document[context] = {}
  },
  inserted (el, binding) {
    activateDraggableTable(el, binding)
  },
  unbind (el) {
    off(document, 'mousedown', document[context].mouseDownHandler)
    off(document, 'mouseup', document[context].mouseUpHandler)
    off(document, 'contextmenu', document[context].contextMenuHandler)
    el[context] = null
    delete el[context]
    document[context] = null
    delete document[context]
  }
}
