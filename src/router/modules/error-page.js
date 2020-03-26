const errorPageRoute = [
  {
    path: '/404',
    component: () => import('_v/error-pages/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('_v/error-pages/403'),
    hidden: true
  }
]

export default errorPageRoute
