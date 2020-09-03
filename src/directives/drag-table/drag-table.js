import { on, off } from '@/utils/tools'

const activateDraggableTable = (el, binding) => {
  const element = el.querySelector('.el-table__body-wrapper')
  let move = false
  let mouseMoveHandler = null
  let contextmenuHandler = null
  // 绑定mousedown事件
  on(document, 'mousedown', event => {
    const ev = document.all ? window.event : event
    // ev.which鼠标右键的值为3，ev.button鼠标右键的值为2
    const evCode = ev.which || ev.button + 1
    // 鼠标右键
    if (evCode === 3) {
      // 记录鼠标点击的x坐标和y坐标
      let startX = ev.pageX
      let startY = ev.pageY
      move = false
      // 绑定mousemove事件
      on(element, 'mousemove', mouseMoveHandler = (() => {
        return event => {
          const ev = document.all ? window.event : event
          ev.preventDefault()
          // 计算鼠标移动的x轴、y轴偏移量，赋值列表的横向、竖向滚动条
          element.scrollLeft += startX - ev.pageX
          element.scrollTop += startY - ev.pageY
          /* 偏移量绝对值大于3即视为有滑动 */
          if (Math.abs(startX - ev.pageX) >= 2 || Math.abs(startY - ev.pageY) >= 2) {
            move = true
            element.style.cursor = 'move'
            // to do what you want
          }
          // 记录最新的起始坐标
          startX = ev.pageX
          startY = ev.pageY
        }
      })(move)) // 给闭包函数传递外部的局部变量！！
    }
  })
  // 松开鼠标（先绑定mouseup事件），取消已绑定mousemove事件
  on(document, 'mouseup', event => {
    const ev = document.all ? window.event : event
    const evCode = ev.which || ev.button + 1
    if (evCode === 3) {
      off(element, 'mousemove', mouseMoveHandler)
      element.style.cursor = 'default'
      // 鼠标右键是否弹出菜单
      off(document, 'contextmenu', contextmenuHandler)
      on(document, 'contextmenu', contextmenuHandler = (() => {
        return event => {
          if (move) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false
          }
        }
      })(move))
    }
  })
}

export default {
  bind: function (el, binding) {
    activateDraggableTable(el, binding)
  }
}
