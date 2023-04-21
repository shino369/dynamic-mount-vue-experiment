<script setup lang="ts">
import type { ModalDetail } from "@/types"
import IconButton from "@/components/IconButton.vue"
import { onMounted, ref } from "vue"
interface Props {
  detail: ModalDetail
  onCloseClick: () => void
}
const props = defineProps<Props>()
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
    if(props.detail.inputValue !== undefined && inputRef.value) {
        inputRef.value.focus()
    }
})


</script>

<template>
  <div class="w-[30rem] p-4 bg-white shadow-sm shadow-slate-200">
    <div
      class="flex justify-between pb-2 items-center border-b border-slate-200"
    >
      <div class="capitalize" :class="detail.headerClass? detail.headerClass : ''">{{ detail.header }}</div>
      <IconButton
        @click="onCloseClick"
        name="close"
        class="cursor-pointer"
        icon-class-name="h-5 w-5 text-black"
      />
    </div>
    <div class="py-4 text-base">
      {{ detail.content }}
      <input
        ref="inputRef"
        class="border rounded-sm w-full px-4 border-slate-400"
        v-if="detail.inputValue !== undefined"
        :value="detail.inputValue"
        @input="detail.onInputChange"
      />
    </div>
    <div class="flex justify-end">
      <button
        class="flex items-end ml-4"
        v-for="(btn, index) in detail.actionBtns"
        :key="index"
        @click="btn.onClick"
      >
        <IconButton
          v-if="btn.iconName"
          :name="btn.iconName"
          class="mr-2"
          icon-class-name="h-6 w-6 text-black"
        />
        <div class="capitalize text-base text-slate-700">{{ btn.name }}</div>
      </button>
    </div>
  </div>
</template>
