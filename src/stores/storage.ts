import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStorageStore = defineStore('storageStore', () => {
    const storage = ref<Record<string, any>>({})

    const setStorage = <T>(key: string, value: T) => {
        storage.value[key] = value
    }

    const deleteStorage = (key: string) => {
        if (storage.value[key]) {
            delete storage.value[key]
        }
    }

    const getStorage = <T>(key: string) => {
        if (storage.value[key]) {
            return storage.value[key] as T
        }

        return undefined
    }

    return { storage, setStorage, getStorage, deleteStorage }
})
