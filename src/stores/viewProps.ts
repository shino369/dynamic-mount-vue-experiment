import { ref } from 'vue'
import { defineStore } from 'pinia'

export const viewPropsStore = <T = { [key: string]: any }>() =>
    defineStore('viewPropsStore', () => {
        /**
         * properties passed from php
         */
        const data = ref<any>({})
        const view = ref<string>('')
        const selector = ref<string>('')
        const translation = ref<Record<string, string>>({})
        const config = ref<{
            baseUrl: string
            langKey: string | number
            customStyle: Record<string, Record<string, string>>
        }>({
            baseUrl: '',
            langKey: 1,
            customStyle: {},
        })

        /**
         * function to return translation by key
         * @param key
         * @returns
         */
        const t = (key: string) => {
            return translation.value[key] && typeof translation.value[key] === 'string'
                ? translation.value[key]
                : key
        }

        const mountView = (key: string) => {
            view.value = key
            console.log(view.value)
        }
        // no setter
        return {
            data: data as T,
            view,
            selector,
            translation,
            config,
            t,
            mountView,
        }
    })()
