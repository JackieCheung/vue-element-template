import wave from './wave'

const install = function (Vue) {
  Vue.directive('wave', wave)
}

if (window.Vue) {
  window.wave = wave
  Vue.use(install) // eslint-disable-line
}

wave.install = install
export default wave
