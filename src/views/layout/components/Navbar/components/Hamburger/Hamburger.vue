<template>
  <div class="hamburger" @click="toggleClick">
    <e-icon class="hamburger-icon" :icon="isActive ? 'outdent' :'indent'"></e-icon>
  </div>
</template>

<script>
  export default {
    name: 'Hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleClick () {
        this.$emit('toggle-click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hamburger {
    padding: 0 15px;

    ::v-deep &-icon {
      display: inline-block;
      vertical-align: middle;
      width: 1.125em !important;
      height: 1.125em !important;
      font-size: 1.125em !important;
    }
  }
</style>
