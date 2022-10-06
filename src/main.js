import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from "./store/index";
import router from "./router";

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
