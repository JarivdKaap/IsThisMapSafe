const routes = [
  {
    path: '',
    redirect: 'main',
    component: () => import('../views/Layout/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import ('../views/Pages/Home.vue')
      },
      {
        path: '/request',
        name: 'request',
        component: () => import('../views/Pages/Request.vue')
      },
      {
        path: '/search/:value',
        name: 'search',
        component: () => import('../views/Pages/Search.vue')
      },
      {
        path: '/faq',
        name: 'faq',
        component: () => import('../views/Pages/Faq.vue')
      },
      /*{
        path: '/login',
        name: 'login',
        component: () => import('../views/Pages/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../views/Pages/Register.vue')
      },*/
    ]
  },
  /*{
    path: '',
    component: () => import('../views/Layout/DashboardLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: '/icons',
        name: 'icons',
        component: () => import('../views/Icons.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/Pages/UserProfile.vue')
      },
      {
        path: '/maps',
        name: 'maps',
        component: () => import('../views/GoogleMaps.vue')
      },
      {
        path: '/tables',
        name: 'tables',
        component: () => import('../views/RegularTables.vue')
      }
    ]
  },*/
  {
    path: '',
    redirect: 'main',
    component: () => import('../views/Layout/MainLayout.vue'),
    children: [
      { path: '*', component: () => import('@/views/NotFoundPage.vue') }
    ]
  },
];

export default routes;
