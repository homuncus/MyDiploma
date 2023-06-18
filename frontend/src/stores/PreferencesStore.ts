import { defineStore } from 'pinia'
import { isDark } from '@/composables'

export const usePreferencesStore = defineStore('PreferencesStore', {
  persist: true,
  state: () => {
    return {
      isDark
    }
  }
})