import type { Router } from "vue-router";
import { useUserStore } from "@/stores";

export default function guard(router: Router) {

  router.beforeEach((to, _from, next) => {
    const store = useUserStore();
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!store.isLoggedIn) {
        next({
          name: 'login',
          query: { redirect: to.name?.toString() },
        })
      } else {
        next()
      }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
      if (store.isLoggedIn) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}