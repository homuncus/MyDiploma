import ElementPlus from 'element-plus'
import './index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "element-plus/theme-chalk/src/message.scss"
import '@/styles/index.scss'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//       $flashMessage: FlashMessagePlugin
//   }
// }
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus)
  .component('font-awesome-icon', FontAwesomeIcon)

// app.use(FlashMessage)

app.mount('#app')
