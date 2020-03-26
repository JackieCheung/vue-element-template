<template>
  <div class="page-403-container">
    <el-button icon="el-icon-arrow-left" class="back-btn" @click="goBack">Return</el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-ginormous">
          Oops!
        </h1>
        <h2>You don't have any permission to access this page.</h2>
        <h4>Or you can:</h4>
        <ul>
          <li>
            <router-link to="/dashboard">
              Back to home
            </router-link>
          </li>
          <li>
            <a href="https://cn.bing.com/">Browse around</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import errGif from '@/assets/images/403/403.gif'

  export default {
    name: 'Page403',
    data () {
      return {
        errGif: errGif + '?' + +new Date()
      }
    },
    methods: {
      goBack () {
        if (this.$route.query.noGoBack) {
          this.$router.push({ path: '/dashboard' })
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-403-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;

    .back-btn {
      background: #008489;
      color: #fff;
      border: none !important;
    }

    .text-ginormous {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }

    ul {
      font-size: 14px;

      li {
        padding-bottom: 5px;
        color: #008489;
      }

      a {
        color: #008489;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
