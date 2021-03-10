<template>
  <el-dropdown trigger="hover">
    <div class="avatar-wrapper">
      <img :src="avatar" class="user-avatar" alt="avatar" />
      <span class="username">{{ username }}</span>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <!--      <router-link :to="{ name: 'Profile' }">-->
      <!--        <el-dropdown-item>-->
      <!--          <e-icon-->
      <!--            icon="user-alt"-->
      <!--            style="margin-right: 2px; width: 12px; height: 12px; font-size: 12px;"-->
      <!--          ></e-icon>-->
      <!--          个人中心-->
      <!--        </el-dropdown-item>-->
      <!--      </router-link>-->
      <el-dropdown-item divided @click.native="logout">
        <e-icon
          icon="sign-out-alt"
          style="margin-right: 2px; width: 13px; height: 13px; font-size: 13px;"
        ></e-icon>
        Logout
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    name: 'Avatar',
    computed: {
      avatar () {
        return this.$store.getters['user/userInfo']['avatar'] || require('@/assets/images/logo.png')
      },
      username () {
        return this.$store.getters['user/userInfo']['username']
      }
    },
    methods: {
      // 注销
      async logout () {
        await this.$store.dispatch('user/logout')
        // await this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.fullPath)}`)
        this.$router.push('/login').catch(err => err)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    height: inherit;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }

    .username {
      display: inline-block;
      margin-left: 8px;
      max-width: 100px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #515a6e;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
</style>
