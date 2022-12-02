export default [
  {
    path: '',
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      },
      {
        path: '/dataAdmin',
        name: 'DataAdmin',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/dataHarian',
        name: 'DataHarian',
        component: () => import('@/views/page-content/content-view/DataHarian.vue')
      },
      {
        path: '/dataOrder',
        name: 'DataOrder',
        component: () => import('@/views/page-content/content-view/DataOrder.vue')
      },
      {
        path: '/dataStack',
        name: 'DataNonCodStack',
        component: () => import('@/views/page-content/content-view/DataStack.vue')
      },
      {
        path: '/hitManualOrder',
        name: 'DataHitManualOrder',
        component: () => import('@/views/page-content/content-view/DataHitManual.vue')
      },

      {
        path: '/dataTransaksiDetail',
        name: 'DataTransaksiDetail',
        component: () => import('@/views/page-content/content-view/DataTransaksi.vue')
      },
      {
        path: '/dataTransaksiDetailSummary',
        name: 'DataTransaksiDetailSummary',
        component: () => import('@/views/page-content/content-view/DataTransaksiByDate.vue')
      },
      {
        path: '/dataProduct',
        name: 'DataProduct',
        component: () => import('@/views/page-content/content-view/DataProduct.vue')
      },
      {
        path: '/dataProductSummary',
        name: 'DataProductSummary',
        component: () => import('@/views/page-content/content-view/DataProductSummary.vue')
      },
      {
        path: '/dataCustomerByArea',
        name: 'DataCustomerByArea',
        component: () => import('@/views/page-content/content-view/DataCustomerByArea.vue')
      },
      {
        path: '/dataCustomerSalesByArea',
        name: 'DataCustomerSalesByArea',
        component: () => import('@/views/page-content/content-view/DataCustomerSalesByArea.vue')
      },
    ]
  },
  {
    path: '/undercontruction',
    name: 'UnderContruction',
    prop: true,
    component: () => import('@/views/UnderContruction.vue')
  },
]