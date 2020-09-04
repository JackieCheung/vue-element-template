import Vue from 'vue'
import VueRouter from 'vue-router'

// detail: https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter)

/* Layout */
import Layout from '_v/layout'

// for multilevel nested routes
// import ParentRouterView from '_c/ParentRouterView'

/* Route Modules */
import userRoute from './modules/user'
import errorPageRoute from './modules/error-page'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * path: `${routePath}`               route url, if set a valid url path will open this page in a new window when you click on the sidebar
 * hidden: true                       if set true, item will not show in the sidebar(default is false), such as 401, login and other pages or some edit pages like '/edit/1'
 * alwaysShow: true                   if set true, will always show the root menu
 *                                    if not set alwaysShow, when item has more than one children route,
 *                                    it will becomes nested mode, otherwise not show the root menu
 * redirect: 'noRedirect'             redirect address, if set 'noRedirect' will no redirect and cannot be clicked in the breadcrumb
 * name: `${routeName}`               route name, the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']         set permissions for this route, control the page roles (you can set multiple roles)
    title: `${title}`                 the name show in sidebar and breadcrumb (recommend set)
    iconType: 'font-awesome'          the type of icon, can be set one of ['font-awesome', 'svg', 'element-ui', 'view-ui'](default is 'font-awesome')
    icon: `${iconName}`               the icon show in the sidebar
    noCache: true                     if set true, the page will no be cached(default is false)
    affix: true                       if set true, the tag will affix in the tags-view
    breadcrumb: false                 if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'       if set path, the sidebar will highlight the path you set
    iframeComponent: VueComponent     if set this property(meanwhile the 'component' property should not be set),
                                      the iframe component will be cached when the route changes
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
        icon: 'tachometer-alt',
        affix: true,
        noCache: true
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
  },
  ...errorPageRoute
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
  // scrollBehavior:
  // - only available in html5 history mode
  // - defaults to no scroll behavior
  // - return false to prevent scroll
  // - detail: https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js
  scrollBehavior: (to, from, savedPosition) => {
    const scrollbar = document.querySelector('.app-main .el-scrollbar__wrap')
    if (!from.meta.noCache) {
      from.meta.savedPosition = (scrollbar || document.documentElement || document.body.parentNode || document.body).scrollTop
    }
    // savedPosition is only available for popstate navigations
    /**
     * 如果是通过浏览器的前进后退按钮进行路由切换，那么 savedPosition 值不为 null，保持之前的滚动条位置；
     * 如果是通过 <router-link> 进行路由切换，那么 savedPosition 值为 null ，此时就会回到目标路由页面的指定位置
     */
    if (savedPosition) {
      setTimeout(() => {
        if (scrollbar) {
          scrollbar.scrollTop = to.meta.savedPosition || 0
          savedPosition.y = scrollbar.scrollTop
        }
        return savedPosition
      }, 600) // 对消 transition 的过渡影响
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          scrollbar && (scrollbar.scrollTop = to.meta.savedPosition || 0)
          resolve({
            x: 0,
            y: to.meta.savedPosition || 0
          })
        }, 600) // 对消 transition 的过渡影响
      })
    }
  },
  base: process.env.VUE_APP_ROUTER_BASE_PATH,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
