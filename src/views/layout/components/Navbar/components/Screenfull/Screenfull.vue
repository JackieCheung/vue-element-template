<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="handleScreenFull"></svg-icon>
  </div>
</template>

<script>
  import screenfull from 'screenfull'

  export default {
    name: 'Screenfull',
    data () {
      return {
        isFullscreen: false
      }
    },
    mounted () {
      this.init()
    },
    beforeDestroy () {
      this.destroy()
    },
    methods: {
      handleScreenFull () {
        if (!screenfull.isEnabled) {
          this.$msg.warning('Sorry, your browser does not support full screen!')
          return false
        }
        screenfull.toggle()
      },
      change () {
        this.isFullscreen = screenfull.isFullscreen
      },
      init () {
        if (screenfull.isEnabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy () {
        if (screenfull.isEnabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
</script>

<style scoped>

</style>
