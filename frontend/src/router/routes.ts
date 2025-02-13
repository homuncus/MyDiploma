import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: {
      requiresAuth: true
    },
    component: () => import('../components/layouts/MainLayout.vue'),
    children: [
      {
        path: '', redirect: { name: 'workshops' },
      },
      {
        path: 'workshops/:slug?',
        components: {
          side: () => import('../views/Home/Workshops/List.vue'),
          content: () => import('../views/Home/Workshops/Workshop.vue'),
        },
        name: 'workshops',
        props: { side: true, content: true },
        // redirect: { name: 'workshops', params: { slug: 'hpfk-nu-"lp"' } },
        meta: {
          activeIndex: 1
        }
      },
      {
        path: 'chats/:slug?',
        components: {
          side: () => import('../views/Home/Chats/List.vue'),
          content: () => import('../views/Home/Chats/Chat.vue'),
        },
        name: 'chats',
        props: { side: true, content: true },
        meta: {
          activeIndex: 2
        }
      },
      {
        path: 'tasks/:id?',
        components: {
          side: () => import('../views/Home/Tasks/List.vue'),
          content: () => import('../views/Home/Tasks/Task.vue')
        },
        name: 'tasks',
        meta: {
          activeIndex: 3
        }
      },
      {
        path: 'settings/:slug?',
        components: {
          side: () => import('../views/Home/Settings/List.vue'),
          content: () => import('../views/Home/Settings/Settings.vue'),
        },
        name: 'settings',
        props: { side: true, content: true },
        meta: {
          activeIndex: 4
        }
      },
      {
        path: 'users/:username',
        components: {
          side: () => import('../views/Home/Chats/List.vue'),
          content: () => import('../views/Home/Users/User.vue')
        },
        name: 'user',
        props: { side: true, content: true }
      },
      {
        path: 'guide/:slug?',
        components: {
          side: () => import('../views/Home/Guide/List.vue'),
          content: () => import('../views/Home/Guide/Guide.vue')
        },
        name: 'guide',
        props: { side: true, content: true }
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
