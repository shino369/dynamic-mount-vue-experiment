<script setup lang="ts">
import type { FileObj, ModalDetail } from "@/types"
import { generateURL } from "@/utils/commonUtils"
import { computed, onMounted, onUnmounted, ref } from "vue"
import IconButton from "./IconButton.vue"
import moment from "moment"
import { useFolderStore } from "@/stores/folders"
import { useRoute } from "vue-router"
import PinchZoom from "pinch-zoom-js"

interface Props {
  detail: ModalDetail
  onCloseClick: () => void
}

const props = defineProps<Props>()
// const isModalReady = ref<boolean>(false)
const currentFileName = ref<string>("")
const newFileName = ref<string>("")
const isEditing = ref<boolean>(false)
const error = ref({
  text: "",
  show: false,
})
const imgClicked = ref<boolean>(false)
const folderStore = useFolderStore()
const route = useRoute()
const currentFolder = computed(() => route.params.name as string)
const currentIndex = ref<number>(props.detail.content as number)
const fileList = ref<FileObj[]>(folderStore.getFolder(currentFolder.value))
const maxIndex = folderStore.getFileLength(currentFolder.value) - 1
const imgRef = ref<HTMLElement>()
let pz: any

onMounted(() => {
  if (imgRef.value) {
    pz = new PinchZoom(imgRef.value, {
      draggableUnzoomed: false,
      minZoom: 1,
    })
  }
  currentFileName.value = withUrl.value.file.name
  newFileName.value = currentFileName.value
})

onUnmounted(() => {
  pz.destroy()
})

const onPageChange = (direction: string) => {
  URL.revokeObjectURL(withUrl.value.url)
  //   console.log('revoked', currentIndex.value)
  if (direction === "right") {
    if (currentIndex.value > 0) {
      currentIndex.value--
    } else {
      currentIndex.value = maxIndex
    }
  } else {
    if (currentIndex.value < maxIndex) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
  }

  currentFileName.value = withUrl.value.file.name
  newFileName.value = currentFileName.value
}

const withUrl = computed(() => {
  const curFi = fileList.value.find((fi, index) => index === currentIndex.value)
  if (curFi) {
    const url = curFi.url ? curFi.url : generateURL(curFi.file, false)
    // console.log('generated', currentIndex.value)
    return {
      url: url,
      file: {
        ...curFi,
        name: curFi.file.name,
        lastModified: moment(curFi.file.lastModified).format(
          "YY/MM/DD HH:mm:ss"
        ),
        size: Math.ceil(curFi.file.size / 1024) + " KB",
      },
    }
  }

  return {
    url: "",
    file: {
      name: "",
      lastModified: "",
      size: "",
    },
  }
})

const handleClose = () => {
  URL.revokeObjectURL(withUrl.value.url)
  props.onCloseClick()
}

const onEditClick = (state: boolean) => {
  isEditing.value = state

  if (!isEditing.value) {
    error.value = {
      text: "",
      show: false,
    }
    newFileName.value = currentFileName.value
  }
}

const onConfirm = () => {
  // check if duplicate
  if (
    folderStore.checkExist(currentFolder.value, newFileName.value) > 0 &&
    newFileName.value !== currentFileName.value
  ) {
    // already exist
    error.value = {
      text: "file name already exist",
      show: true,
    }
  } else if (newFileName.value === currentFileName.value) {
    onEditClick(false)
  } else {
    // rename
    folderStore.renameFile(
      currentFolder.value,
      currentFileName.value,
      newFileName.value
    )
    currentFileName.value = newFileName.value
    const refreshFile = folderStore.getFileByIndex(
      currentFolder.value,
      currentIndex.value
    )
    if (refreshFile) {
      fileList.value[currentIndex.value].file = refreshFile
    }

    onEditClick(false)
  }
}

const download = () => {
  const url = withUrl.value.url
  const a = document.createElement("a")
  document.body.appendChild(a)
  a.setAttribute("style", "display: none")
  a.href = url
  a.download = withUrl.value.file.name
  a.click()
  a.remove()
}

// const imgSize = ref({
//   width: 0,
//   height: 0,
// })

// const onLoad = () => {
//   let img = new Image()
//   img.src = withUrl.value.url
//   img.onload = () => {
//     imgSize.value = {
//       width: img.width,
//       height: img.height,
//     }
//   }
// }

const onImageClicked = () => {
  imgClicked.value = !imgClicked.value
}
</script>

<template>
  <div class="w-full h-full flex flex-col text-slate-300 select-text">
    <div
      class="w-100 flex mx-3 md:mx-6 py-2 md:py-4 items-center justify-between border-b border-neutral-600 mb-2 md:mb-4"
    >
      <div class="whitespace-nowrap">
        {{ currentIndex + 1 }} /
        {{ maxIndex + 1 }}
      </div>
      <div class="px-8 whitespace-nowrap text-ellipsis overflow-hidden">
        {{ withUrl.file.name }}
      </div>
      <IconButton
        name="close"
        class="cursor-pointer"
        icon-class-name="w-8 h-8 text-white"
        @click="handleClose"
      />
    </div>
    <div class="flex-1 flex justify-center overflow-hidden relative">
      <div class="w-full">
        <div ref="imgRef">
          <img
            @click="onImageClicked"
            :src="withUrl.url"
            class="m-auto object-contain h-full"
          />
        </div>
      </div>

      <div
        @click="onPageChange('right')"
        class="absolute h-full w-[3rem] md:w-[4rem] left-0 top-0 hover:bg-[rgba(112,112,112,0.1)] cursor-pointer"
      ></div>
      <div
        @click="onPageChange('left')"
        class="absolute h-full w-[3rem] md:w-[4rem] right-0 top-0 hover:bg-[rgba(112,112,112,0.1)] cursor-pointer"
      ></div>
    </div>

    <div
      class="flex justify-center py-6 absolute left-0 bottom-0 w-full bg-[rgba(0,0,0,0.8)] origin-bottom transition-transform pb-20"
      :class="{
        'scale-y-0': imgClicked,
      }"
    >
      <div class="w-full px-6">
        <div class="flex flex-row border-b border-neutral-600 py-2">
          <div class="capitalize basis-2/5">name :</div>
          <div class="basis-3/5">
            <div class="min-h-[4rem]">
              <span v-if="!isEditing">{{ withUrl.file.name }}</span>
              <textarea
                class="w-full h-full text-black resize-none"
                v-if="isEditing"
                v-model="newFileName"
              ></textarea>
            </div>

            <div class="flex items-center min-h-[2.5rem]">
              <IconButton
                v-if="!isEditing"
                @click="onEditClick(true)"
                name="edit"
                class="cursor-pointer"
                icon-class-name="my-2 h-5 w-5 text-white"
              />
              <IconButton
                v-if="isEditing"
                @click="onConfirm"
                name="confirm"
                class="cursor-pointer mr-4"
                icon-class-name="my-2 h-5 w-5 text-white"
              />
              <IconButton
                v-if="isEditing"
                @click="onEditClick(false)"
                name="close"
                class="cursor-pointer"
                icon-class-name="my-2 h-5 w-5 text-white"
              />
              <span v-if="error.show" class="text-red-400 text-base ml-4">{{
                error.text
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-row border-b border-neutral-600 py-2">
          <div class="capitalize basis-2/5">size :</div>
          <div class="basis-3/5 flex items-center">
            {{ withUrl.file.size }}
            <IconButton
              @click="download"
              name="download"
              class="cursor-pointer"
              icon-class-name="my-2 mx-4 h-5 w-5 text-white"
            />
          </div>
        </div>
        <div class="flex flex-row border-b border-neutral-600 py-2">
          <div class="capitalize basis-2/5">last modified :</div>
          <div class="basis-3/5">{{ withUrl.file.lastModified }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
