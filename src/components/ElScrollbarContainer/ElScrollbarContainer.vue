<template>
  <div
    class="position-relative"
    :style="{ height }"
  >
    <el-scrollbar
      class="el-scrollbar-container"
      :class="getNativeClass"
      :wrap-class="getWrapClass"
    >
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: 'ElScrollbarContainer',
    props: {
      vertical: {
        type: Boolean,
        default: true
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      height: {
        type: String,
        default: 'inherit'
      }
    },
    computed: {
      getNativeClass () {
        return this.vertical ? 'vertical' : this.horizontal ? 'horizontal' : ''
      },
      getWrapClass () {
        return this.vertical ? 'vertical' : this.horizontal ? 'horizontal' : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-scrollbar-container {
    position: relative;
    height: 100%;

    &.vertical {
      .el-scrollbar__bar.is-horizontal {
        display: none;
      }
    }

    &.horizontal {
      .el-scrollbar__bar.is-vertical {
        display: none;
      }
    }
  }

  ::v-deep .el-scrollbar__wrap {
    &.vertical {
      overflow-x: hidden;
      overflow-y: scroll;
    }

    &.horizontal {
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
</style>
