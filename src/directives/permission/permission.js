import store from '@/store'

function checkPermission (el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters['user/roles']

  if (value && value instanceof Array && value.length) {
    const permissibleRoles = value

    const hasPermission = roles.some(role => {
      return permissibleRoles.includes(role)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`Require roles! Like v-permission="['admin','user']"`)
  }
}

export default {
  inserted (el, binding) {
    checkPermission(el, binding)
  },
  update (el, binding) {
    checkPermission(el, binding)
  }
}
