<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script>
  const SPACE_BETWEEN_TAGS = 4 // the spaces bewteen two tags

  export default {
    name: 'ScrollPane',
    computed: {
      scrollWrapper () {
        return this.$refs.scrollContainer.$refs.wrap
      }
    },
    mounted () {
      this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
    },
    beforeDestroy () {
      this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
    },
    methods: {
      handleScroll (e) {
        // wheelDelta: the scroll direction of the wheel, up to 120, down to -120, but it is constant and independent of the speed of wheel
        // deltaY: vertical scrolling range, scrolling down means positive values, the default number of vertical rows of the computer mouse wheel is 3
        // wheelDelta is only supported by some browsers, and deltaY is supported by almost all browsers
        const eventDelta = e.wheelDelta || -e.deltaY * 40
        const $scrollWrapper = this.scrollWrapper
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
      },
      emitScroll () {
        this.$emit('scroll')
      },
      moveToTarget (currentTag) {
        const $container = this.$refs.scrollContainer.$el
        const $containerWidth = $container.offsetWidth
        const $scrollWrapper = this.scrollWrapper
        const tagList = this.$parent.$refs.tag

        let firstTag = null
        let lastTag = null

        // find first tag and last tag
        if (tagList.length) {
          firstTag = tagList[0]
          lastTag = tagList[tagList.length - 1]
        }

        if (firstTag === currentTag) {
          $scrollWrapper.scrollLeft = 0
        } else if (lastTag === currentTag) {
          $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
        } else {
          // find preTag and nextTag
          const currentIndex = tagList.findIndex(item => item === currentTag)
          const prevTag = tagList[currentIndex - 1]
          const nextTag = tagList[currentIndex + 1]

          // the tag's offsetLeft after of nextTag
          const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + SPACE_BETWEEN_TAGS

          // the tag's offsetLeft before of prevTag
          const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - SPACE_BETWEEN_TAGS

          if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
            $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
          } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;

    ::v-deep {
      /*.el-scrollbar__bar {*/
      /*  bottom: 0;*/
      /*}*/

      .el-scrollbar__wrap {
        height: 57px;
        // height: 58px;
      }
    }
  }
</style>
