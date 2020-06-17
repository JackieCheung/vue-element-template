import Vue from 'vue'

const setImmutableTags = (el, bindings) => {
  if (!bindings.value) {
    return
  }
  /**
   * values v-model 绑定值
   * options 下拉选项
   * prop 对应 options 中 的 value 属性
   * defaultProp 默认值判断属性
   * defaultValues 默认值集合
   */
  const [values, options, prop, defaultProp, defaultValues] = bindings.value
  // 需要隐藏的标签索引
  const indexs = []
  options.filter(option => values.includes(option[prop])).forEach((option, index) => {
    if (defaultValues.includes(option[defaultProp])) {
      option.disabled = true
      indexs.push(index)
    }
  })

  const updateStyle = (tags) => {
    tags.forEach((el, index) => {
      if (indexs.includes(index) && ![...el.classList].includes('select-tag-close-none')) {
        el.classList.add('d-none')
      }
    })
  }
  // 设置样式 隐藏 close icon
  Vue.nextTick(_ => {
    updateStyle(el.querySelectorAll('.el-tag__close'))
  })
}

export default {
  componentUpdated: function (el, binding) {
    setImmutableTags(el, binding)
  }
}
