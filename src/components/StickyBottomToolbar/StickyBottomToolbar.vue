<template>
  <div class="sticky-bottom-toolbar" :style="{ width: `calc(100% - ${paddingLeft})` }">
    <div style="float: left">
      <slot name="title">{{ title }}</slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'StickyBottomToolbar',
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters({
        sidebar: 'app/sidebar',
        device: 'app/device'
      }),
      paddingLeft () {
        return this.device === 'desktop' ? this.sidebar.opened ? '210px' : '54px' : '0px'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sticky-bottom-toolbar {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
    background: #fff;
    border-top: 1px solid #e8e8e8;
    padding: 0 24px;
    z-index: 9;
    transition: all 0.28s;

    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }
</style>
