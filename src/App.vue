<script setup lang="ts">
import { RouterView } from "vue-router"
import { computed } from "vue"
import NavBar from "@/components/NavBar.vue"
import { useSideBar } from "@/stores/sidebar"
import ModalDialog from "./components/ModalDialog.vue";

const sideBarStore = useSideBar()
const isSideBarShow = computed(() => sideBarStore.isSideBarShow)
</script>

<template>
  <div
    class="main-container text-black select-none w-screen h-screen overflow-hidden md:px-4 text-base md:text-xl bg-slate-100"
  >
    <NavBar />
    <div
      class="router-wrapper md:pb-2 h-[calc(100%-4rem)] transition-transform"
      :class="{
        'translate-x-[20rem]': isSideBarShow,
      }"
    >
      <RouterView class="shadow-2xl p-4 md:rounded-br-[2rem] h-full bg-white" />
    </div>

    <ModalDialog />
  </div>
</template>

<style scoped>
.test {
  color: black;
}
</style>
