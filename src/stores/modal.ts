import { ref } from "vue"
import { defineStore } from "pinia"
import type { ModalObject } from "@/types"

export const useModal = defineStore("modal", () => {
  // modal store using stack
  const modalStack = ref<ModalObject[]>([])
  const modelPreStack = ref<number[]>([])

  const open = (modal: ModalObject) => {
    modalStack.value.push(modal)
    modelPreStack.value.push(1)
  }

  const close = () => {
    modelPreStack.value.pop()
  }

  const modalClose = () => {
    modalStack.value.pop()?.onClose()
  }

  return { modalStack, modelPreStack, open, close, modalClose }
})
