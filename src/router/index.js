import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import './auth' // permission control

/* Layout */
import Layout from '_v/layout'

// for multilevel nested routes
// eslint-disable-next-line no-unused-vars
import RouterView from '_c/RouterView'

/* Route Modules */
import userRoute from './modules/user'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * path: `${routePath}`           route url, if set a valid url path will open this page in a new window when you click on the sidebar
 * hidden: true                   if set true, item will not show in the sidebar(default is false), such as 401, login and other pages or some edit pages like '/edit/1'
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: 'noRedirect'         redirect address, if set 'noRedirect' will no redirect and cannot be clicked in the breadcrumb
 * name: `${routeName}`           route name, the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     set permissions for this route, control the page roles (you can set multiple roles)
    title: `${title}`             the name show in sidebar and breadcrumb (recommend set)
    iconType: 'font-awesome'      the type of icon, can be set one of ['font-awesome', 'svg', 'element'](default is 'font-awesome')
    icon: `${iconName}`           the icon show in the sidebar
    noCache: true                 if set true, the page will no be cached(default is false)
    affix: true                   if set true, the tag will affix in the tags-view
    breadcrumb: false             if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'   if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * the basic pages that do not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('_v/dashboard'),
      name: 'Dashboard',
      meta: {
        title: 'Dashboard',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('_v/redirect')
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  userRoute,
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
