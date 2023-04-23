import { ref } from "vue"
import { defineStore } from "pinia"
import { phpProps } from "@/main"

export const viewProps = defineStore("viewProps", () => {
  const props = ref<Record<string, any>>(phpProps)
  // no setter
  return { props }
})
