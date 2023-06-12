import type { Router } from "vue-router";
import { useUserStore } from "@/stores";

export default function guard(router: Router) {

  router.beforeEach(async (to, _from, next) => {
    const userState = useUserStore();
    await userState.checkToken()
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!userState.isLoggedIn) {
        next({
          name: 'login',
          query: { redirect: to.name?.toString() },
        })
      } else {
        next()
      }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
      if (userState.isLoggedIn) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}