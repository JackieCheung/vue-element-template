/**
 * @description allow the src of the img tag to access the protected path
 * @author Jackie
 * @date 2020-04-07 01:19
 */
import authImage from './auth-image'

const install = function (Vue) {
  Vue.directive('auth-image', authImage)
}

if (window.Vue) {
  window['auth-image'] = authImage
  Vue.use(install) // eslint-disable-line
}

authImage.install = install
export default authImage
