import { createApp } from 'vue'
import { createPinia /*, /type Store*/, type Store } from 'pinia'
import App from '@/App.vue'
import '@/assets/main.css'
import type { PhpProps } from '@/types'

export function initialize(props: PhpProps) {
    try {
        const phpProps: PhpProps = props
        const id = phpProps.selector
        const app = createApp(App)

        const mountWindowProps = async ({ store }: { store: Store }) => {
            // get props
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
                store.$patch(reconstruct)
            }

            // restore localstorage
            if (store.$id === 'storageStore') {
                const rehydrated = JSON.parse(
                    localStorage.getItem('vue-storage-' + store.$id) || '{}',
                )
                // console.log(rehydrated)
                store.$patch(rehydrated)

                store.$subscribe(
                    (_state) => {
                        try {
                            // for some case (deeply nested object with differenct types, serialization not work, need to use lodash clonedeep)
                            const cloned = JSON.stringify(store.$state)
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
