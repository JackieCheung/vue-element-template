import Layout from '@/layout'

const userRoute = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'User',
  meta: {
    title: 'User',
    icon: 'table'
  }
}
export default userRoute
