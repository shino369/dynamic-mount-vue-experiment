import { createApp } from 'vue'
import { createPinia /*, /type Store*/, type Store } from 'pinia'
import App from '@/App.vue'
import '@/assets/main.css'
import type { PhpProps } from '@/types'

export function initialize(props: PhpProps) {
    // console.log('initizlizing')
    const phpProps: PhpProps = props
    // console.log(phpProps)
    const id = phpProps.selector
    const app = createApp(App)

    const mountWindowProps = ({ store }: { store: Store }) => {
        // console.log(store)
        if (phpProps && store.$id === 'viewPropsStore') {
            store.$patch(phpProps)
            // console.log('patched')
        }
    }

    const pinia = createPinia()
    pinia.use(mountWindowProps)
    app.use(pinia)
    app.mount(id)
    // console.log('end')
}
window.initVue = initialize
// console.log('added')
