import { createApp } from 'vue'
import { createPinia /*, /type Store*/, type Store } from 'pinia'
import App from '@/App.vue'
import '@/assets/main.css'
import type { PhpProps } from '@/types'

export function initialize(props: PhpProps) {
    try {
        // console.log('initizlizing')
        const phpProps: PhpProps = props
        const id = phpProps.selector
        const app = createApp(App)

        const mountWindowProps = async ({ store }: { store: Store }) => {
            // console.log(store)
            if (phpProps && store.$id === 'viewPropsStore') {
                const reconstruct = Object.entries(phpProps).reduce(
                    (accu, [key, value]) => {
                        return {
                            ...accu,
                            ...(value ? { [key]: value } : {}),
                        }
                    },
                    {},
                )
                // console.log(reconstruct)
                store.$patch(reconstruct)
                // console.log('patched')
            }

            if (store.$id === 'storageStore') {
                // console.log('storageStore')
                const rehydrated = JSON.parse(
                    localStorage.getItem('vue-storage-' + store.$id) || '{}',
                )
                // console.log(rehydrated)
                store.$patch(rehydrated)

                store.$subscribe(
                    (state) => {
                        try {
                            // console.log('persisting')
                            // console.log(state)
                            // strignify object
                            const cloned = JSON.stringify(store.$state)
                            // console.log(cloned)
                            // set reminded small item
                            localStorage.setItem(
                                'vue-storage-' + store.$id,
                                cloned,
                            )
                        } catch (error) {
                            console.error(error)
                        }
                    }
                )
            }
        }

        const pinia = createPinia()
        pinia.use(mountWindowProps)
        app.use(pinia)
        app.mount(id)
    } catch (error) {
        console.warn(error)
    }
}
window.initVue = initialize
// console.log('added')
