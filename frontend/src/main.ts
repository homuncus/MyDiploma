import ElementPlus from 'element-plus'
import './index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/index.scss'
import 'vue-m-message/dist/style.css'

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
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(createPinia())
  .use(ElementPlus)

// app.use(FlashMessage)

app.use(router)

app.mount('#app')
