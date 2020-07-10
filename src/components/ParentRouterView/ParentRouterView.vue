<template>
  <keep-alive :include="cachedViews">
    <router-view :key="key" />
  </keep-alive>
</template>

<script>
  export default {
    name: 'ParentRouterView',
    computed: {
      cachedViews () {
        return this.$store.state.routerView.cachedViews
      },
      key () {
        return this.$route.path
      }
    },
    created () {
      const route = this.$route.matched.find(item => item.name === this.$options.name)
      if (route) this.$store.dispatch('routerView/addCachedView', route)
    }
  }
</script>

<style scoped>

</style>
