<script setup lang="ts">
import { computed, ref } from "vue"
import { routes } from "@/router"
import { useFolderStore } from "@/stores/folders"
import { useSideBar } from "@/stores/sidebar"
import { useRoute, RouterLink } from "vue-router"
import IconButton from "@/components/IconButton.vue"
import { collapseSideBar } from "@/utils/commonUtils"

interface Props {
  routes: {
    path: string
    name: string
  }[]
  folders: string[]
}
defineProps<Props>()
const currentRoute = useRoute()
const sideBarStore = useSideBar()
const isSideBarShow = computed(() => sideBarStore.isSideBarShow)
const folderStore = useFolderStore()
const showNewFolderInput = ref<boolean>(false)
const newFolderName = ref<string>("")
const inputRef = ref()

const addNewFolder = () => {
  showNewFolderInput.value = true
  inputRef.value.focus()
}
const comfirmAddNewFolder = () => {
  showNewFolderInput.value = false
  if (newFolderName.value && newFolderName.value.trim().length > 0) {
    folderStore.addNewFolder(newFolderName.value)
    newFolderName.value = ""
  }
}
const cancelAddNewFolder = () => {
  showNewFolderInput.value = false
  newFolderName.value = ""
}

const collpase = () => {
  setTimeout(() => {
    collapseSideBar()
  }, 100)
}
</script>

<template>
  <div
    class="absolute top-0 p-2 left-0 bg-slate-700 h-[100vh] w-[20rem] max-w-[100vw] z-50 transition-transform"
    :class="{
      '-translate-x-full': !isSideBarShow,
    }"
  >
    <div class="flex justify-end py-2">
      <IconButton
        @click="sideBarStore.toggle(false)"
        name="close"
        class="cursor-pointer"
        icon-class-name="w-8 h-8 text-white"
      />
    </div>
    <div class="upper-section px-4 py-2">
      <template v-for="(route, index) in routes" :key="index">
        <div v-if="route.name !== 'folder'" class="pb-4 flex">
          <RouterLink
            @click="collpase"
            draggable="false"
            class="w-full h-full px-4 py-2 bg-gray-400 text-white hover:opacity-80 overflow-hidden text-ellipsis whitespace-nowrap capitalize"
            :class="{
              'bg-sky-900': currentRoute.name === route.name,
            }"
            :to="route.path"
            >{{ route.name }}
          </RouterLink>
        </div>
      </template>
    </div>
    <div class="lower-section px-4 py-2">
      <div class="flex justify-end items-center py-4">
        <IconButton
          v-if="!showNewFolderInput"
          @click="addNewFolder"
          name="plus"
          class="cursor-pointer"
          icon-class-name="w-6 h-6 text-white group-hover:opacity-80"
        />
        <IconButton
          v-if="showNewFolderInput"
          @click="comfirmAddNewFolder"
          name="tick"
          class="cursor-pointer"
          icon-class-name="w-6 h-6 text-white group-hover:opacity-80"
        />
        <input
          ref="inputRef"
          class="transition-all py-1 focus:outline-none"
          :class="{
            'w-0': !showNewFolderInput,
            'px-2': showNewFolderInput,
            'ml-2': showNewFolderInput,
            'w-40': showNewFolderInput,
          }"
          v-model="newFolderName"
          placeholder="new folder"
        />
        <IconButton
          v-if="showNewFolderInput"
          @click="cancelAddNewFolder"
          name="close"
          class="cursor-pointer ml-1"
          icon-class-name="w-6 h-6 text-white group-hover:opacity-80"
        />
      </div>

      <div
        class="group pb-4 flex items-center"
        v-for="(folder, index) in folders"
        :key="index"
      >
        <IconButton
          name="folder"
          class="mr-2"
          icon-class-name="w-8 h-8 text-white group-hover:opacity-80"
        />
        <RouterLink
          @click="collpase"
          draggable="false"
          class="w-full h-full px-4 py-2 bg-gray-400 text-white group-hover:opacity-80 overflow-hidden text-ellipsis whitespace-nowrap"
          :class="{
            'bg-sky-900':
              currentRoute.name === 'folder' &&
              currentRoute.params.name === folder,
          }"
          :to="`/folder/${folder}`"
        >
          {{ folder }}
        </RouterLink>
      </div>
    </div>
  </div>
  <div
    @click="sideBarStore.toggle(false)"
    class="fixed top-0 left-0 h-full w-full max-w-[100vw] z-40 backdrop-brightness-50"
    :class="{
      hidden: !isSideBarShow,
    }"
  ></div>
</template>
