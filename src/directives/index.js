import authImage from '@/directives/auth-image'
import dragTable from '@/directives/drag-table'
import adaptiveTable from '@/directives/adaptive-table'
import resizeTable from '@/directives/resize-table'
import immutableSelector from '@/directives/immutable-selector'
import clipboard from '@/directives/clipboard'
import permission from '@/directives/permission'
import wave from '@/directives/wave'

const directives = {
  authImage,
  dragTable,
  adaptiveTable,
  resizeTable,
  immutableSelector,
  clipboard,
  permission,
  wave
}

export default {
  install (Vue) {
    Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
  }
}
