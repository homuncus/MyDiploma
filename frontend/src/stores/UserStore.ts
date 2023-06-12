import { defineStore } from "pinia";
import axios from "axios";
import processAxios from "@/services/AxiosProcessor";

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
    },
    async checkToken() {
      if (!this.access_token.token) return false
      const valid = await processAxios(async (axios) => {
        return (await axios.get('/auth/check')).data
      })
      console.log(valid);

      if (!valid)
        this.$reset()
      return valid
    }
  },
  getters: {
    password: () => null,
    isLoggedIn: ({ access_token }) => !!access_token.token,
    token: ({ access_token }) => `${access_token.type} ${access_token.token}`
  },
  persist: true
})