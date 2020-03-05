import store from '@/store'

/**
 * @description check whether has permission or not
 * @param { Array } value: permissible roles
 * @return { Boolean } has permission or not
 */
export function hasPermission (value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissibleRoles = value
    return roles.some(role => {
      return permissibleRoles.includes(role)
    })
  } else {
    console.error(`Require roles! Like v-permission="['admin','user']"`)
    return false
  }
}
