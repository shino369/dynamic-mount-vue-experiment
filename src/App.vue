<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import ModalDialog from "./components/ModalDialog.vue"
import { phpProps } from "./main"

const comp = defineAsyncComponent(
  () => import(`@/views/${phpProps.view.trim()}.vue`)
)
</script>

<template>
  <component :is="comp" />
  <ModalDialog />
</template>

<style scoped>
.test {
  color: black;
}
</style>
