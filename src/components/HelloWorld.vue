<script setup lang="ts">
import { computed, ref } from "vue"

// for defineProps, do not support import type/interface from other file
interface Props {
  title: string
  message: string
}

const props = defineProps<Props>()
const inputNumber = ref<number>(111)

const emit = defineEmits<{
  (e: "testEmit", value: number): void
  (e: "update", value: string): void
}>()

const logging = (value: number) => {
  console.log(value)
}
</script>

<template>
  <div>
    <div>{{ title }}</div>
    <div class="green">{{ message }}</div>
    <div @click="emit('testEmit', inputNumber)">{{ inputNumber }}</div>
    <input id="inputNumber" class=" text-black" v-model="inputNumber" />
  </div>
</template>

<style scoped>
</style>
