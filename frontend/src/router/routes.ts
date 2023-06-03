import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../components/layouts/MainLayout.vue'),
    children: [
      {
        path: '', redirect: { name: 'workshops' }, meta: { requiresAuth: true }
      },
      {
        path: 'workshops',
        component: () => import('../views/Home/WorkshopsPage.vue'),
        name: 'workshops',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/a',
    component: () => import('../components/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../views/Auth/SignUpPage.vue'),
        meta: {
          requiresGuest: true
        }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/Auth/LoginPage.vue'),
        meta: {
          requiresGuest: true
        }
      }
    ]
  },

  // {
  //     path: '/:catchAll(.*)*',
  //     component: () => import('pages/ErrorNotFound.vue'),
  // },
];

export default routes;
