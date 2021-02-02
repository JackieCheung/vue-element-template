import Vue from 'vue'

// use font-awesome icon
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faRedo,
  faUpload,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
// import {} from '@fortawesome/free-regular-svg-icons'
// import {} from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon
  // , FontAwesomeLayers
  // , FontAwesomeLayersText
}
  from '@fortawesome/vue-fontawesome'

library.add(
  faUser,
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faRedo,
  faUpload,
  faSignOutAlt
)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
// Vue.component('FontAwesomeLayers', FontAwesomeLayers)
// Vue.component('FontAwesomeLayersText', FontAwesomeLayersText)
