<template>
  <div :class="{'has-logo': showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"></logo>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :background-color="variables.menuBg"
              :text-color="variables.menuText"
              :unique-opened="uniqueOpened"
              :active-text-color="variables.menuActiveText"
              :collapse-transition="collapseTransition"
              mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Logo from './components/Logo'
  import SidebarItem from './components/SidebarItem'
  import variables from '@/assets/styles/variables.scss'

  export default {
    name: 'Sidebar',
    components: {
      Logo,
      SidebarItem
    },
    props: {
      showLogo: {
        type: Boolean,
        default: true
      },
      uniqueOpened: {
        type: Boolean,
        default: false
      },
      collapseTransition: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters({
        sidebar: 'app/sidebar',
        routes: 'permission/routes'
      }),
      activeMenu () {
        const route = this.$route
        const { meta, path } = route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      variables () {
        return variables
      },
      isCollapse () {
        return !this.sidebar.opened
      }
    }
  }
</script>
