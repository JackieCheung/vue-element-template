import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.roles

    if (value && value instanceof Array && value.length > 0) {
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
}
