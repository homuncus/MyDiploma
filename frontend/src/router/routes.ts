import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [

    ]
  },
  {
    path: '/a',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('../views/Auth/SignUpPage.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/Auth/LoginPage.vue')
      }
    ]
  },

  // {
  //     path: '/:catchAll(.*)*',
  //     component: () => import('pages/ErrorNotFound.vue'),
  // },
];

export default routes;
