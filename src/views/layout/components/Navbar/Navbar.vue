<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    ></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect"></screenfull>
      </template>
      <avatar class="avatar-container right-menu-item hover-effect"></avatar>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Hamburger from './components/Hamburger'
  import Breadcrumb from './components/Breadcrumb'
  import Screenfull from './components/Screenfull'
  import Avatar from './components/Avatar'

  export default {
    name: 'Navbar',
    components: {
      Breadcrumb,
      Hamburger,
      Screenfull,
      Avatar
    },
    computed: {
      ...mapGetters({
        'sidebar': 'app/sidebar',
        'device': 'app/device'
      })
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('app/toggleSideBar')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      &-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;
      }
    }
  }
</style>
