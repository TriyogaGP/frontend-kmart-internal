export default [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/forgotpass',
    name: 'ForgotPass',
    component: () => import('@/views/ForgotPass.vue')
  },
  {
    path: '/undercontruction',
    name: 'UnderContruction',
    component: () => import('@/views/UnderContruction.vue')
  },
]
