import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      access_token: {
        type: '',
        token: '',
        refreshToken: '',
      },
      user: {
        id: -1,
        email: '',
        username: '',
      },
    }
  },
  actions: {
    async getUser() {
      const user = await axios.get(`${import.meta.env.VITE_API_URL}/users/${this.user.id}`)
      return user
    },
    async update(): Promise<any> {
      return await axios.patch(`${import.meta.env.VITE_API_URL}/users/${this.user.id}`, this.$state.user)
    }
  },
  getters: {
    password: () => null,
    isLoggedIn: ({ access_token }) => !!access_token.token
  }
})