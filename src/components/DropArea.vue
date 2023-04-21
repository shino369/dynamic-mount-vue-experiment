<script setup lang="ts">
import { useLoading } from "@/stores/loading"
import type { FileObj } from "@/types"
import _ from "lodash"
import { computed, ref } from "vue"
import IconButton from "./IconButton.vue"

const showBorder = ref<boolean>(false)

const loadingStore = useLoading()

const isPageLoading = computed(() => loadingStore.isLoading)


const emit = defineEmits<{
  (e: "emitFile", file: FileObj[]): void
  (e: "getMore"): void
}>()

const setBorder = (show: boolean) => {
  showBorder.value = show
}

const upload = async (e: DragEvent) => {
  if (e && e.dataTransfer) {
    loadingStore.setLoading(true)
    const fileArr: FileObj[] = []
    try {
      const files = e.dataTransfer.files

      for (var i = 0; i < files.length; i++) {
        const fileObj = {
          file: files[i],
        }
        fileArr.push(fileObj)
      }
    } catch (e) {
      console.warn(e)
    } finally {
      emit("emitFile", fileArr)
      setBorder(false)
      loadingStore.setLoading(false)
    }
  }
}
const handleScroll = (e: UIEvent) => {
  if (e.target) {
    const target = e.target as HTMLButtonElement
    if (target.scrollTop + target.offsetHeight + 100 >= target.scrollHeight) {
      emit("getMore")
    }
  }
}
const debouncedHandleScroll = _.debounce(handleScroll, 300)
</script>
<template>
  <div class="flex justify-center items-center relative">
    <div
      @dragenter.prevent="() => setBorder(true)"
      @scroll="debouncedHandleScroll"
      class="drag-area m-2 md:m-4 h-[calc(100%-1rem)] md:h-[calc(100%-2rem)] w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] overflow-y-auto overflow-x-hidden"
    >
      <slot></slot>
    </div>
    <div
      @dragover.prevent="() => setBorder(true)"
      @dragleave.prevent="() => setBorder(false)"
      @drop.prevent="upload"
      class="overlay-drag-area w-full h-full absolute z-20 flex"
      :class="{
        hidden: !showBorder,
      }"
    ></div>

    <div
      class="overlay-border-effect w-full h-full absolute bg-[rgba(255,255,255,0.5)] z-10 flex justify-center items-center"
      :class="{
        hidden: !showBorder && !isPageLoading,
        'bg-[rgba(255,255,255,0.6)]': isPageLoading,
        'border-sky-900': showBorder,
        'border-dashed': showBorder,
        'border-4': showBorder,
      }"
    >
      <div v-if="isPageLoading">
        <IconButton name="spinner" icon-class-name="w-20 h-20 mr-2" />
      </div>
      <div class="capitalize bg-[rgba(255,255,255, 0.9)]">
        {{ isPageLoading ? "loading..." : "drag your image here" }}
      </div>
    </div>
  </div>
</template>

<style></style>
