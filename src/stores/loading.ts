import { ref } from "vue"
import { defineStore } from "pinia"

export const useLoading = defineStore("loading", () => {
  const isLoading = ref<boolean>(false)
  const setLoading = (state: boolean) => {
    isLoading.value = state
  }

  return { isLoading, setLoading }
})
