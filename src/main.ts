import { createApp } from "vue"
import { createPinia /*, /type Store*/ } from "pinia"

import App from "@/App.vue"
import "@/assets/main.css"

export const mountComp: string = (window as any).vueProps?.comp
const id = (window as any).vueProps?.id
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount(id)

