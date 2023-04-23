import { createApp } from "vue"
import { createPinia /*, /type Store*/ } from "pinia"
import App from "@/App.vue"
import "@/assets/main.css"
import type { PhpProps } from "@/types"

export const phpProps: PhpProps = (window as any).vueProps
const id = phpProps.uniqSelector
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount(id)

