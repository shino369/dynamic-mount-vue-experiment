<script setup lang="ts">
import DropArea from "@/components/DropArea.vue"
import IconButton from "@/components/IconButton.vue"
import ImgGird from "@/components/ImgGrid.vue"
import PopupDialog from "@/components/PopupDialog.vue"
import NotFound from "@/components/NotFound.vue"
import { useFolderStore, MAX_LENGTH } from "@/stores/folders"
import { useLoading } from "@/stores/loading"
import { useModal } from "@/stores/modal"
import type { FileObj } from "@/types"
import _ from "lodash"
import { onMounted, ref, shallowRef, computed, onUnmounted } from "vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import { rehydrate } from "@/main"
import type { Subscription } from "rxjs"

/* ****************state***************** */
const isfolderExist = ref<boolean>(false)

const fileList = ref<FileObj[]>([])
const tempFileList = ref<FileObj[]>([])
const selectedFileList = ref<string[]>([])
const totalSize = ref<number>(0)
const currentFolder = ref<string>("")
const offset = ref<number>(0)
const limit = ref<number>(50)
const enabledSelect = ref<boolean>(false)
const dotClicked = ref<boolean>(false)

const modal = useModal()

/* ****************store***************** */

const route = useRoute()
const folderStore = useFolderStore()
const { setLoading } = useLoading()
const loadingStore = useLoading()

const sortBy = computed(() => folderStore.sortBy)
const orderBy = computed(() => folderStore.orderBy)
let subscribeRehydrate: Subscription

onMounted(() => {
  setLoading(true)
  if (!rehydrate.getValue()) {
    // using custom async store cause delay in mounting.
    // here use rxjs to observe if ready.
    subscribeRehydrate = rehydrate.subscribe((ready) => {
      if (ready) {
   
        init(route.params.name as string)
      }
    })
  } else {
    init(route.params.name as string)
  }
})

onUnmounted(() => {
  if (subscribeRehydrate) {
    subscribeRehydrate.unsubscribe()
  }
  modal.close()
})

const init = (folderName: string) => {
  isfolderExist.value = folderStore.checkFolderExist(
    folderName
  )

  if (isfolderExist.value) {
    getFileFromStore(folderName)
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.name !== from.params.name) {
    setLoading(true)
    // update folder to store
    fileList.value = []
    clearSelected()
    modal.close()
    init(to.params.name as string)
  }
})

/* ****************event handler***************** */

const getFileFromStore = (folderName: string) => {
  currentFolder.value = folderName
  offset.value = 0

  const { data, size } = folderStore.getSection(
    currentFolder.value,
    offset.value,
    limit.value
  )
  fileList.value = data
  totalSize.value = size

  if (fileList.value.length === totalSize.value) {
    // already get all
    offset.value = totalSize.value - 1
  } else {
    offset.value += limit.value
  }
}

const onGetMoreFiles = () => {
  if (fileList.value.length < totalSize.value) {
    const { data, size } = folderStore.getSection(
      currentFolder.value,
      offset.value,
      limit.value
    )
    fileList.value.push(...data)
    totalSize.value = size

    if (fileList.value.length === totalSize.value) {
      // already get all
      offset.value = totalSize.value - 1
    } else {
      offset.value += limit.value
    }
  }
}

const onSetFileArr = (fileArr: FileObj[]) => {
  let fileToBePush: FileObj[] = fileArr
  // check if file exist
  const existArr = []
  fileArr.forEach((newFile) => {
    const exist = fileList.value.find(
      (old) => old.file.name === newFile.file.name
    )
    if (exist) {
      existArr.push(newFile.file.name)
    }
  })

  if (existArr.length > 0) {
    // pop up alert to comfirm replace

    fileToBePush = fileToBePush.filter(
      (file) => !fileList.value.find((old) => old.file.name === file.file.name)
    )
  }

  folderStore.addFiles(currentFolder.value, fileToBePush)
  offset.value = 0
  const { data, size } = folderStore.getSection(
    currentFolder.value,
    offset.value,
    limit.value
  )
  fileList.value = data
  totalSize.value = size
}

const onInitSelect = (fileName: string) => {
  dotClicked.value = true
  enabledSelect.value = true
  onAddToSelected(fileName)
}

const onAddToSelected = (fileName: string) => {
  if (selectedFileList.value.find((f) => f === fileName)) {
    selectedFileList.value = selectedFileList.value.filter(
      (f) => f !== fileName
    )
  } else {
    selectedFileList.value.push(fileName)
  }
}

const onDeleteSelected = () => {
  if (selectedFileList.value.length > 0) {
    modal.open({
      detail: {
        header: "delete",
        content: `Are you sure you want to delete ${selectedFileList.value.length} item(s)?`,
        actionBtns: [
          {
            name: "cancel",
            iconName: "close",
            onClick: () => {
              modal.close()
            },
          },
          {
            name: "confirm",
            iconName: "confirm",
            onClick: () => {
              confirmDelete()
              modal.close()
            },
          },
        ],
      },
      component: shallowRef(PopupDialog),
      onClose: () => {},
      type: "popup",
    })
  }
}

const confirmDelete = () => {
  selectedFileList.value.forEach((name) => {
    const itemIndex = fileList.value.findIndex((i) => i.file.name === name)
    if (itemIndex > -1) {
      fileList.value.splice(itemIndex, 1)
    }
  })

  folderStore.removeFiles(currentFolder.value, selectedFileList.value)
  clearSelected()
  getFileFromStore(currentFolder.value)
}

const clearSelected = () => {
  dotClicked.value = false
  enabledSelect.value = false
  selectedFileList.value = []
}

const onDotClick = () => {
  dotClicked.value = !dotClicked.value

  if (!dotClicked.value) {
    clearSelected()
  }
}

const onEditClick = () => {
  enabledSelect.value = !enabledSelect.value
  if (!enabledSelect.value) {
    enabledSelect.value = false
    selectedFileList.value = []
  }
}

const onSelectAll = () => {
  if (selectedFileList.value.length > 0) {
    selectedFileList.value = []
  } else {
    selectedFileList.value = folderStore
      .getFolder(currentFolder.value)
      .map((f) => f.file.name)
  }
}

const search = (e: Event) => {
  if (e.target) {
    const target = e.target as HTMLInputElement

    offset.value = 0
    const { data, size } = folderStore.getSection(
      currentFolder.value,
      offset.value,
      limit.value,
      target.value
    )
    tempFileList.value = fileList.value
    fileList.value = data
    totalSize.value = size

    if (fileList.value.length === totalSize.value) {
      // already get all
      offset.value = totalSize.value - 1
    } else {
      offset.value += limit.value
    }
  }
}

const handleFilesUpload = async (e: Event) => {
  if (e && e.target) {
    loadingStore.setLoading(true)
    const fileArr: FileObj[] = []
    try {
      const files = (e.target as HTMLInputElement).files

      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          const fileObj = {
            file: files[i],
          }
          fileArr.push(fileObj)
        }
      }
    } catch (e) {
      console.warn(e)
    } finally {
      onSetFileArr(fileArr)
      loadingStore.setLoading(false)
    }
  }
}

const onDebouncedSearch = _.debounce(search, 500)
</script>
<template>
  <div
    class="h-full transition-all"
    :class="{
      'bg-zinc-400': enabledSelect,
    }"
  >
    <template v-if="isfolderExist">
      <div class="text-sm md:text-base whitespace-nowrap text-end capitalize">
        total: {{ totalSize }} / {{ MAX_LENGTH }}
      </div>
      <!-- buttons groups -->
      <div
        class="flex justify-end items-center overflow-hidden transition-transform"
      >
        <div
          class="rounded-lg py-1 flex justify-end bg-slate-100 overflow-hidden transition-all"
          :class="{
            'bg-slate-300': !enabledSelect,
            'w-0': !dotClicked,
            'px-4 mr-2': dotClicked,
            'w-[18rem]': dotClicked && !enabledSelect,
            'w-[calc(100%-4rem)]': dotClicked && enabledSelect,
          }"
        >
          <input
            v-if="!enabledSelect"
            @input="onDebouncedSearch"
            class="mx-2 w-full text-base px-2"
          />
          <IconButton
            v-if="!enabledSelect"
            @click="onEditClick"
            name="edit"
            class="cursor-pointer mr-4"
            icon-class-name="w-6 h-6 text-black"
          />

          <input
            multiple
            type="file"
            id="img-upload"
            class="hidden"
            @change="handleFilesUpload"
          />
          <label
            for="img-upload"
            class="cursor-pointer mr-4"
            v-if="!enabledSelect"
          >
            <IconButton name="upload" icon-class-name="w-6 h-6 text-black" />
          </label>
          <IconButton
            v-if="!enabledSelect"
            name="download"
            class="cursor-pointer"
            icon-class-name="w-6 h-6 text-black"
          />
          <div
            class="transition-all flex overflow-hidden items-center"
            :class="{
              'w-0': !enabledSelect,
              'mr-auto': enabledSelect,
            }"
          >
            <IconButton
              @click="onDeleteSelected"
              name="trash"
              class="cursor-pointer"
              :class="{
                'w-0': !enabledSelect,
              }"
              icon-class-name="w-6 h-6 text-black"
            />
            <div
              v-if="enabledSelect && selectedFileList.length > 0 && dotClicked"
              class="ml-2 text-ellipsis text-sm md:text-base whitespace-nowrap"
            >
              {{ selectedFileList.length }} item(s) selected
            </div>
          </div>

          <IconButton
            @click="onSelectAll"
            name="all"
            class="cursor-pointer overflow-hidden transition-all"
            :class="{
              'w-0': !enabledSelect,
              'w-6 mr-2': enabledSelect,
            }"
            icon-class-name="w-6 h-6 text-black"
          />
          <IconButton
            v-if="enabledSelect"
            @click="onEditClick"
            name="close"
            class="cursor-pointer"
            icon-class-name="w-6 h-6 text-black"
          />
        </div>

        <IconButton
          @click="onDotClick"
          name="threeDot"
          class="cursor-pointer"
          icon-class-name="w-6 h-6 text-black"
        />
      </div>

      <DropArea
        @emit-file="onSetFileArr"
        @get-more="onGetMoreFiles"
        class="h-[calc(100%-4rem)]"
      >
        <ImgGird
          :enabled-select="enabledSelect"
          @item-select="onAddToSelected"
          @init-select="onInitSelect"
          :fileList="fileList"
          :selectedFileList="selectedFileList"
        />
      </DropArea>
    </template>

    <template v-if="!isfolderExist">
      <NotFound />
    </template>
  </div>
</template>

<style></style>
