import Vue from 'vue'
import { Message } from 'element-ui'

Vue.prototype.$msg = {
  info: (message, options = {}) => {
    return Message.info({
      showClose: true,
      ...options,
      message: message || '提示'
    })
  },
  success: (message, options = {}) => {
    return Message.success({
      showClose: true,
      ...options,
      message: message || '成功'
    })
  },
  error: (message, options = {}) => {
    return Message.error({
      showClose: true,
      ...options,
      message: message || '错误'
    })
  },
  warning: (message, options = {}) => {
    return Message.warning({
      showClose: true,
      ...options,
      message: message || '警告'
    })
  }
}
