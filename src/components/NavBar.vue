<script setup lang="ts">
import { useSideBar } from "@/stores/sidebar"
import { useRoute, useRouter } from "vue-router"
import { routes } from "@/router/index"
import IconButton from "./IconButton.vue"
import SideBar from "./SideBar.vue"
import { computed, ref } from "vue"
import { useFolderStore } from "@/stores/folders"

const folderStore = useFolderStore()
const folders = computed(() => {
  const getfolder = folderStore.getFolderList()
  if (typeof getfolder !== "string") {
    return getfolder
  } else {
    return []
  }
})

const isFullScreen = ref<boolean>(false)

const route = useRoute()
const router = useRouter()
const { toggle } = useSideBar()

const goHome = () => {
  router.push("/")
}

const onFullscreenClick = () => {
  isFullScreen.value = true
  document.documentElement.requestFullscreen()
}

const onExitFullscreenClick = () => {
  isFullScreen.value = false

  document.exitFullscreen()
}
</script>

<template>
  <div class="h-[4rem] w-full flex items-center pl-2 md:pl-0">
    <IconButton
      @click="toggle(true)"
      name="menu"
      class="cursor-pointer pr-2"
      icon-class-name="w-8 h-8 text-black"
    />
    <div
      class="ml-2 capitalize flex items-end font-bold flex-nowrap whitespace-nowrap overflow-hidden"
    >
      <div
        @click="route.name === 'folder' && goHome()"
        :class="{
          'cursor-pointer': route.name === 'folder',
        }"
      >
        {{ route.name }}
      </div>
      <div v-if="route.params.name" class="mx-2 font-normal text-gray-500">
        /
      </div>
      <div class="text-ellipsis overflow-hidden">
        {{ route.params.name }}
      </div>
    </div>
    <IconButton
      v-if="!isFullScreen"
      @click="onFullscreenClick"
      name="fullscreen"
      class="cursor-pointer ml-auto mr-2 md:mr-0"
      icon-class-name="w-6 h-6 text-black"
    />
    <IconButton
      v-if="isFullScreen"
      @click="onExitFullscreenClick"
      name="exitFullscreen"
      class="cursor-pointer ml-auto mr-2 md:mr-0"
      icon-class-name="w-6 h-6 text-black"
    />
  </div>
  <SideBar :routes="routes" :folders="folders" />
</template>
