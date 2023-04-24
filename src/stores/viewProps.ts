import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PhpProps } from '@/types'

export const viewPropsStore = <T = { [key: string]: any }>() => defineStore('viewPropsStore', () => {
    /**
     * properties passed from php
     */
    const data = ref<any>({})
    const view = ref<string>('')
    const selector = ref<string>('')
    const translation = ref<Record<string, string>>({})

    /**
     * function to return translation by key
     * @param key
     * @returns
     */
    const t = (key: string) => {
        return translation.value[key] || key
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
        t,
        mountView,
    }
})()
