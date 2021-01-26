import Vue from 'vue'

import 'view-design/dist/styles/iview.css' // View UI css

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './router/auth' // permission control

import * as filters from './filters' // global filters
import './assets/icons' // Svg Icon
import './vendors/font-awesome-icon' // Font Awesome Icon
import './vendors/lodash' // lodash
import './vendors/element-ui' // Element UI
import './vendors/view-ui' // View UI
import EIcon from './components/Icon'
import ElScrollbarContainer from '@/components/ElScrollbarContainer'

Vue.use(Element)

Vue.component('EIcon', EIcon)

Vue.component('ElScrollbarContainer', ElScrollbarContainer)

// registers customized directives
import directives from '@/directives'
Vue.use(directives)

/**
 * If you don't want to use mock-server
 * you want to use MockJS for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJS will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// registers global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// registers an event hub
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

// registers console.log
Vue.prototype.$log = Vue.prototype.$log || console.log

// assert
Window.prototype.assert = Window.prototype.assert || console.assert || function assert (condition, msg) {
  if (!condition) throw new Error(msg || 'Assert Error!')
}

// document.addEventListener('touchstart', event => {})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
