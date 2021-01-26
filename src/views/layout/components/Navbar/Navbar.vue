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
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" alt="avatar" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link :to="{ name: 'Profile' }">-->
          <!--            <el-dropdown-item>-->
          <!--              <e-icon-->
          <!--                icon="user-alt"-->
          <!--                style="margin-right: 2px; width: 12px; height: 12px; font-size: 12px;"-->
          <!--              ></e-icon>-->
          <!--              个人中心-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
          <el-dropdown-item divided @click.native="logout">
            <e-icon
              icon="sign-out-alt"
              style="margin-right: 2px; width: 13px; height: 13px; font-size: 13px;"
            ></e-icon>
            Logout
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Hamburger from './components/Hamburger'
  import Breadcrumb from './components/Breadcrumb'
  import Screenfull from './components/Screenfull'

  export default {
    name: 'Navbar',
    components: {
      Breadcrumb,
      Hamburger,
      Screenfull
    },
    computed: {
      ...mapGetters({
        'sidebar': 'app/sidebar',
        'device': 'app/device'
      }),
      avatar () {
        return this.$store.getters['user/userInfo']['avatar'] || require('@/assets/images/logo.png')
      }
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout () {
        await this.$store.dispatch('user/logout')
        // await this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.fullPath)}`)
        this.$router.push('/login').catch(err => err)
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

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            object-fit: cover;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
