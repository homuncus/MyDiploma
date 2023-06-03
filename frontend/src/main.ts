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

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//       $flashMessage: FlashMessagePlugin
//   }
// }

const app = createApp(App)
  .use(router)
  .use(createPinia())
  .use(ElementPlus)
  .component('font-awesome-icon', FontAwesomeIcon)

// app.use(FlashMessage)

app.mount('#app')
