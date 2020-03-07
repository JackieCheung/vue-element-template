<template>
  <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="handleScreenFull"></svg-icon>
</template>

<script>
  import screenfull from 'src/views/layout/components/Navbar/components/Screenfull/Screenfull'

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
        if (!screenfull.enabled) {
          this.$message({
            message: 'Sorry, your browser does not support full screen!',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      },
      change () {
        this.isFullscreen = screenfull.isFullscreen
      },
      init () {
        if (screenfull.enabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy () {
        if (screenfull.enabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
</script>
