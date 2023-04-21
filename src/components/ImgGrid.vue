<script setup lang="ts">
import { useFolderStore } from "@/stores/folders"
import { useModal } from "@/stores/modal"
import type { FileObj } from "@/types"
import { generateURL } from "@/utils/commonUtils"
import { computed, ref, shallowRef } from "vue"
import { useRoute } from "vue-router"
import ImageViewer from "./ImageViewer.vue"

interface Props {
  fileList: FileObj[]
  selectedFileList: string[]
  enabledSelect: boolean
}
const props = defineProps<Props>()

const interval = ref()
const count = ref<number>(0)

const modal = useModal()
const folderStore = useFolderStore()
const route = useRoute()

const emit = defineEmits<{
  (e: "initSelect", value: string): void
  (e: "itemSelect", value: string): void
}>()

// dynamically add blob to file object
const withUrl = computed(() => {
  return props.fileList.map((file) => ({
    url: generateURL(file.file),
    file: file.file
  }))
})

const touchStart = (fileName: string) => {
  if (props.enabledSelect) {
    return
  }
  if (!interval.value) {
    interval.value = setInterval(() => {
      count.value++
      if (count.value > 6) {
        emit("initSelect", fileName)
        stop()
      }
    }, 100)
  }
}
const start = (fileName: string) => {
  if (props.enabledSelect) {
    handleOnClick(fileName)
  } else {
    if (!interval.value) {
      interval.value = setInterval(() => {
        count.value++
        if (count.value > 5) {
          emit("initSelect", fileName)
          stop()
          count.value = 0
        }
      }, 100)
    }
  }
}

const stop = () => {
  if (props.enabledSelect) {
    return
  }
  clearInterval(interval.value)
  interval.value = null
  count.value = 0
}

const handleOnClick = (fileName: string) => {
  if (props.enabledSelect) {
    emit("itemSelect", fileName)
  }
}

const onModalOpen = (file: FileObj) => {
  const index = folderStore.checkExist(route.params.name as string, file.file.name)
  if(index > -1) {
    modal.open({
    detail: {
      header: file.file.name,
      content: index,
    },
    component: shallowRef(ImageViewer),
    onClose: () => {
    },
    type: 'modal'
  })
  }


}
</script>

<template>
  <div
    class="w-full h-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 grid-flow-row gap-2 auto-rows-min"
  >
    <template v-for="(file, index) in withUrl" :key="index">
      <div
        class="group col-auto w-[6rem] md:w-[10rem] m-2 flex flex-col items-center h-fit justify-self-center relative"
      >
        <div
          @mousedown="start(file.file.name)"
          class="absolute w-full h-full flex justify-center items-end z-20 cursor-pointer"
          :class="{
            hidden: !selectedFileList.includes(file.file.name),
          }"
        ></div>

        <div
          @click="onModalOpen(file)"
          @mousedown="start(file.file.name)"
          @mouseleave="stop"
          @mouseup="stop"
          @touchstart="touchStart(file.file.name)"
          @touchmove="stop"
          @touchend="stop"
          @touchcancel="stop"
          class="img-wrapper flex items-center justify-center h-[8rem] md:h-[12rem] select-none transition-opacity cursor-pointer"
          :class="{
            'opacity-20':
              enabledSelect && !selectedFileList.includes(file.file.name),
          }"
        >
          <img
            @contextmenu.prevent="() => false"
            class="max-w-full max-h-full transition-transform"
            :class="{
              'group-hover:shadow-2xl': !enabledSelect,
              'group-hover:scale-110': !enabledSelect,
            }"
            :src="file.url"
            draggable="false"
          />
        </div>

        <div :title="file.file.name" class="w-[inherit] truncate">
          {{ file.file.name }}
        </div>
      </div>
    </template>
  </div>
</template>
