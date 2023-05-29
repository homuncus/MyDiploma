import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      id: -1,
      type: '',
      token: '',
      refreshToken: '',
      email: '',
      username: '',
    }
  },
  actions: {
    async getUser() {
      return await axios.get(`${import.meta.env.VITE_API_URL}/users/${this.id}`)
    },

    async update() {
      return await axios.patch(`${import.meta.env.VITE_API_URL}/users/${this.id}`, this.$state)
    }
  }
})