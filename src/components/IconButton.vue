<script setup lang="ts">
import { defineAsyncComponent } from "vue"

interface Props {
  name: string
  iconClassName: string
}
const props = defineProps<Props>()

const icon = defineAsyncComponent(
  () => import(`@/components/icons/Icon-${props.name.trim()}.vue`)
)
</script>
<template>
  <div>
    <component :is="icon" :class="iconClassName" />
  </div>
</template>
