import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import components from './components'
import store from './stores'


const app = createApp(App)

app.use(store)
app.use(components)
app.use(router)

app.mount('#app')
