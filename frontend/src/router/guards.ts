import type { Router } from "vue-router";

export default function guard(router: Router) {
  const isAuthenticated = false

  router.beforeEach((to, from) => {
    if (
      !isAuthenticated &&
      // ❗️ Avoid an infinite redirect
      (to.name !== 'Login' && to.name !== 'Signup')
    ) {
      // redirect the user to the login page
      return { name: 'Login' }
    }
  })
}