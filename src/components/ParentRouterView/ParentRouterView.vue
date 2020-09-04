<template>
  <div class="router-view">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      <!-- iframe pages -->
      <component
        :is="item.name"
        v-for="item in cachedIframeComponents"
        v-show="$route.path === item.path"
        :key="item.name"
      ></component>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'ParentRouterView',
    data () {
      return {
        iframeComponents: []
      }
    },
    computed: {
      cachedViews () {
        return this.$store.state.routerView.cachedViews
      },
      key () {
        return this.$route.path
      },
      cachedIframeComponents () {
        return this.iframeComponents.filter(comp => this.cachedViews.includes(comp.name))
      }
    },
    watch: {
      '$route': {
        handler (route) {
          const { iframeComponent } = route.meta
          if (iframeComponent && !~this.iframeComponents.findIndex(comp => comp.name === route.name)) {
            Vue.component(route.name, iframeComponent)
            this.iframeComponents.push({
              name: route.name,
              path: route.path
            })
          }
        },
        immediate: true
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
