import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { loadGame } from './stores/save'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

loadGame()

app.mount('#app')