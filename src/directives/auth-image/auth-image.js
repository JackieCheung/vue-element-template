import request from '@/utils/request'

const setImgSrc = (el, binding) => {
  if (!binding.value) {
    el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>暂无内容</span>`
    return false
  }
  let url = ''
  let fn = null // the callback function after the image is loaded, returns the remote url of the current image
  if (Object.prototype.toString.call(binding.value) === '[object Object]') {
    url = binding.value.url || ''
    fn = binding.value.fn || null
  } else {
    url = binding.value || ''
    fn = null
  }
  if (typeof binding.oldValue === 'undefined' || JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
    // el.localName !== 'img' ? el.innerHTML = `<span>加载中...</span>` : ''
    request({
      url: url,
      method: 'GET'
    }).then(res => {
      // el.localName === 'img' ? el.src = res.data.data.signatureUrl : el.innerHTML = `<img src="${res.data.data.signatureUrl}" alt="" />`
      el.localName === 'img' ? el.src = res.data.data.signatureUrl : ''
      fn && fn(res.data.data.signatureUrl || '')
      // const reader = new FileReader()
      // reader.onload = e => {
      //   el.localName === 'img' ? el.src = e.target.result : el.innerHTML = `<img src="${e.target.result}" alt="" />`
      // }
      // reader.readAsDataURL(res)
    }).catch(error => {
      console.error(error)
      // el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>加载失败</span>`
      el.localName === 'img' ? el.src = '' : ''
      fn && fn('')
    })
  }
}

export default {
  bind: function (el, binding) {
    setImgSrc(el, binding)
  },
  componentUpdated: function (el, binding) {
    setImgSrc(el, binding)
  }
}
