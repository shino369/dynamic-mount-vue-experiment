import { ref } from 'vue'
import { defineStore } from 'pinia'
import { phpProps } from '@/main'
import type { PhpProps } from '@/types'

export const viewProps = <T = any>() => defineStore('viewProps', () => {
    /**
     * properties passed from php
     */
    const props = ref<PhpProps>(phpProps)

    /**
     * function to return translation by key
     * @param key
     * @returns
     */
    const t = (key: string) => {
        return props.value.translation[key] || key
    }
    // no setter
    return {
        data: props.value.data as T,
        t,
    }
})()
