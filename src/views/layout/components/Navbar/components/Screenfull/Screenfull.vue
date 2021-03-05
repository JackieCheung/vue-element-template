<template>
  <div @click="handleScreenFull">
    <e-icon
      :icon="isFullscreen ? 'compress' : 'expand'"
      style="width: 1.25em; height: 1.25em; vertical-align: middle;"
    ></e-icon>
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
