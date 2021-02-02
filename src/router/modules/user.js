import Layout from '_v/layout'

const userRoute = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'User',
  meta: {
    title: 'User',
    icon: 'user'
  }
}
export default userRoute
