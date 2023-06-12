import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../components/layouts/MainLayout.vue'),
    children: [
      {
        path: '', redirect: { name: 'workshops' },
        meta: { requiresAuth: true }
      },
      {
        path: 'workshops/:slug?',
        components: {
          side: () => import('../views/Home/Workshops/WorkshopsList.vue'),
          content: () => import('../views/Home/Workshops/Workshop.vue'),
        },
        name: 'workshops',
        props: { side: true, main: true },
        // redirect: { name: 'workshops', params: { slug: 'hpfk-nu-"lp"' } },
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tasks',
        component: () => import('../views/Home/TasksPage.vue'),
        name: 'tasks',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'settings',
        component: () => import('../views/Home/TasksPage.vue'),
        name: 'settings',
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
