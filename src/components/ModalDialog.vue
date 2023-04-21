<script setup lang="ts">
import { useModal } from "@/stores/modal"
import { computed, ref, watch } from "vue"

const modalStore = useModal()
const readyStack = ref<number[]>([])
const modalStack = computed(() => modalStore.modalStack)

watch(
  () => modalStore.modelPreStack,
  (newState, _oldState) => {
    if (newState.length > readyStack.value.length) {
      // push stack
      setTimeout(() => {
        readyStack.value.push(1)
      }, 150)
    } else {
      // pop stack
      readyStack.value.pop()
      setTimeout(() => {
        modalStore.modalClose()
      }, 150)
    }
  },
  { deep: true }
)
</script>

<template>
  <template v-for="(modal, index) in modalStack" :key="index">
    <!--backdrop area-->
    <div
      @click="modal.type === 'popup' && modalStore.close()"
      :class="`fixed w-full h-full top-0 left-0 min-h-screen ${
        modal.type === 'modal'
          ? ' bg-[rgba(0,0,0,0.9)]'
          : ' bg-[rgba(0,0,0,0.5)]'
      } flex justify-center items-center transition-transform ${
        readyStack.length !== modalStack.length && modal.type === 'modal'
          ? ' translate-y-full'
          : ''
      }`"
      :style="{
        zIndex: 100 + index,
      }"
    >
      <!--modal area-->
      <component
        @click="(e: Event) => {e.stopPropagation()}"
        class="transition-transform"
        :class="{
          'scale-0':
            readyStack.length !== modalStack.length && modal.type === 'popup',
        }"
        :is="modal.component"
        :detail="modal.detail"
        :onCloseClick="modalStore.close"
      />
    </div>
  </template>
</template>
