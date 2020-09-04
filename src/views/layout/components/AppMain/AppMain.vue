<template>
  <main class="app-main">
    <el-scrollbar
      class="el-scrollbar-container vertical"
      wrap-class="el-scrollbar__wrap-vertical">
      <div class="app-main__content">
        <transition name="fade-transform" mode="out-in">
          <parent-router-view></parent-router-view>
        </transition>
      </div>
    </el-scrollbar>
  </main>
</template>

<script>
  import ParentRouterView from '_c/ParentRouterView'
  export default {
    name: 'AppMain',
    components: {
      ParentRouterView
    }
  }
</script>

<style lang="scss" scoped>
  .app-main {
    /* 90 = navbar + tags-view = 50 + 40 */
    height: calc(100vh - 90px);
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #f5f7fa;

    &__content {
      // padding: 24px 16px;
      padding: 16px;
    }
  }

  .fixed-header + .app-main {
    padding-top: 90px;
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
