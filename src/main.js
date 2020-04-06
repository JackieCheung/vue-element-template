import Vue from 'vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css

import 'view-design/dist/styles/iview.css' // View UI css

import App from './App'
import store from './store'
import router from './router'

import './router/auth' // permission control

import * as filters from './filters' // global filters
import './assets/icons' // Svg Icon
import './vendors/font-awesome-icon' // Font Awesome Icon
import './vendors/lodash' // lodash
import './vendors/view-ui' // View UI

Vue.use(Element)

import authImage from '@/directives/auth-image'

Vue.use(authImage)

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

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register an event hub
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

// register console.log
Vue.prototype.$log = Vue.prototype.$log || console.log

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
